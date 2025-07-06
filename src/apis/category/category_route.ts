import express from 'express';
import config from '../../config/config';
import asyncWrapper from '../../middleware/asyncWrapper';
import validateRequest from '../../middleware/validateRequest';
import verifyToken from '../../middleware/verifyToken';
import category_controller from './category_controller';
import category_validate from './category_validate';

const categoryRouter = express.Router();

categoryRouter.post(
  '/category/create',
  verifyToken(config.USER),
  validateRequest(category_validate.categorySchema),
  asyncWrapper(category_controller.create_category)
)

  .get(
    '/category/get-all',
    asyncWrapper(category_controller.get_all_categories)
  );

export default categoryRouter;