import { Request, Response } from 'express';
import category_service from './category_service';

const create_category = async (req: Request, res: Response) => {
  const data = await category_service.create_category(req.body);
  res.status(200).json(data);
}
const get_all_categories = async (req: Request, res: Response) => {
  const data = await category_service.get_all_categories();
  res.status(200).json(data);
}
export default {
  create_category,
  get_all_categories
}
