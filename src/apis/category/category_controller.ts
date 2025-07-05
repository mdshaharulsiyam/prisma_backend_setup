import { Request, Response } from 'express';
import { QueryKeys, SearchKeys } from '../../utils/prismaAggregator';
import category_service from './category_service';

const create_category = async (req: Request, res: Response) => {
  const data = await category_service.create_category(req.body);
  res.status(200).json(data);
}
const get_all_categories = async (req: Request, res: Response) => {
  const { search, ...otherFilters } = req.query;
  const queryKeys = {
    ...otherFilters
  } as QueryKeys;
  const searchKeys = {} as SearchKeys;
  if (search) {
    searchKeys.name = search as string;
  }
  const data = await category_service.get_all_categories(queryKeys, searchKeys);
  res.status(200).json(data);
}
export default {
  create_category,
  get_all_categories
}
