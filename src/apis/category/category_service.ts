import { Categories, PrismaClient } from '../../../generated/prisma';
import { prismaAggregator, QueryKeys, SearchKeys } from '../../utils/prismaAggregator';
const prisma = new PrismaClient();
const create_category = async (data: Categories): Promise<{ category: Categories | null, message: string, error?: any }> => {
  const category = await prisma.categories.create({ data: { ...data } });
  return { category, message: 'Category created successfully' };
}
const get_all_categories = async (queryKeys: QueryKeys, searchKeys: SearchKeys): Promise<{
  categories: Categories[] | null;
  message: string;
  error?: any;
}> => {
  try {
    const result = await prismaAggregator<Categories>(
      prisma.categories,
      queryKeys,
      searchKeys,
      ["name"],
      {},
      {
        posts: true,
        _count: {
          select: {
            posts: true,
          },
        },
      }
    );

    return {
      categories: result.data,
      message: "Categories fetched successfully",
    };
  } catch (error) {
    return {
      categories: null,
      message: "Failed to fetch categories",
      error,
    };
  }
};

export default {
  create_category,
  get_all_categories
}