
// Assuming you have initialized PrismaClient somewhere or it's globally available

import { PrismaClient } from '../../generated/prisma';

// If not, you'll need to pass an instance to prismaAggregator when not using rawSQLQuery
const prisma = new PrismaClient();

export interface QueryKeys {
  limit?: string;
  page?: string;
  sort?: string;
  order?: "asc" | "desc";
  q?: string; // Added for general search term
  search?: string; // Added for general search term
  [key: string]: any; // Allows for other filter keys and general search key
}

export interface SearchKeys {
  [key: string]: string;
}

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface ResponseData<T> {
  success: boolean;
  data: T[];
  pagination?: Pagination;
}

export const prismaAggregator = async <T>(
  model: {
    findMany: (...args: any[]) => Promise<any>;
    count: (...args: any[]) => Promise<number>;
  },
  queryKeys: QueryKeys,
  searchKeys: SearchKeys = {},
  searchableFields: (keyof T)[] = [],
  whereExtra: Record<string, any> = {},
  include?: Record<string, any>,
  rawSQLQuery?: string,
  prismaClient?: PrismaClient
): Promise<ResponseData<T>> => {
  const {
    limit = "10",
    page = "1",
    sort,
    order = "asc",
    q: generalSearchTermQ, // Destructure 'q' for general search
    search: generalSearchTermSearch, // Destructure 'search' for general search
    ...filters // Remaining query keys are treated as filters
  } = queryKeys;

  // Prioritize 'q' then 'search' for the general search term
  const generalSearchTerm = generalSearchTermQ || generalSearchTermSearch;

  const itemsPerPage = parseInt(limit, 10);
  const currentPage = parseInt(page, 10);
  const offset = (currentPage - 1) * itemsPerPage;

  if (rawSQLQuery) {
    if (!prismaClient) {
      throw new Error("prismaClient must be provided when rawSQLQuery is used.");
    }

    const paginatedSQL = `${rawSQLQuery} LIMIT ${itemsPerPage} OFFSET ${offset}`;

    const [data, countResult] = await Promise.all([
      (await prismaClient.$queryRawUnsafe(paginatedSQL)) as T[],
      (await prismaClient.$queryRawUnsafe(
        `SELECT COUNT(*) as total FROM (${rawSQLQuery}) AS sub`
      )) as { total: number }[],
    ]);

    const totalItems = Number(countResult?.[0]?.total ?? 0);

    return {
      success: true,
      data,
      pagination: {
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages: Math.ceil(totalItems / itemsPerPage),
      },
    };
  }

  // ✅ Prisma-built query fallback
  const where: Record<string, any> = { ...whereExtra };

  // Handle specific field searches from searchKeys
  if (Object.keys(searchKeys).length > 0) {
    where.OR = Object.entries(searchKeys).map(([field, keyword]) => ({
      [field]: {
        contains: keyword,
        mode: "insensitive",
      },
    }));
  }

  // Handle general search term with searchableFields
  if (generalSearchTerm && searchableFields.length > 0) {
    // If searchKeys already created an OR, add to it. Otherwise, initialize.
    if (!where.OR) {
      where.OR = [];
    }

    searchableFields.forEach(field => {
      where.OR.push({
        [field as string]: { // Cast to string as dynamic key
          contains: generalSearchTerm,
          mode: "insensitive",
        },
      });
    });
  }

  // Apply remaining filters from queryKeys
  for (const [key, value] of Object.entries(filters)) {
    // Exclude general search keys here as they've been handled
    if (key === 'q' || key === 'search') continue;

    if (value !== undefined && value !== "undefined") {
      if (!isNaN(Number(value))) {
        where[key] = Number(value);
      } else {
        where[key] = value;
      }
    }
  }

  const totalItems = await model.count({ where });

  const data = await model.findMany({
    where,
    ...(include ? { include } : {}),
    ...(sort ? { orderBy: { [sort]: order } } : {}),
    skip: offset,
    take: itemsPerPage,
  });

  return {
    success: true,
    data,
    pagination: {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages: Math.ceil(totalItems / itemsPerPage),
    },
  };
};