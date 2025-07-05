import { Categories, PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();
const create_category = async (data: Categories): Promise<{ category: Categories | null, message: string, error?: any }> => {
  const category = await prisma.categories.create({ data: { ...data } });
  return { category, message: 'Category created successfully' };
}
const get_all_categories = async (): Promise<{ categories: Categories[] | null, message: string, error?: any }> => {
  const categories = await prisma.categories.findMany();
  return { categories, message: 'Categories fetched successfully' };
}
export default {
  create_category,
  get_all_categories
}