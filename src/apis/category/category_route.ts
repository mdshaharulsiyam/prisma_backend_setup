import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import validateRequest from '../../middleware/validateRequest';
import category_controller from './category_controller';
import category_validate from './category_validate';

const categoryRouter = express.Router();

categoryRouter.post(
  '/category/create',
  validateRequest(category_validate.categorySchema),
  asyncWrapper(category_controller.create_category)
)

  .get(
    '/category/get-all',
    asyncWrapper(category_controller.get_all_categories)
  );

export default categoryRouter;