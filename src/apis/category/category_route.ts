import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import validateRequest from '../../middleware/validateRequest';
import auth_controller from './category_controller';
import category_validate from './category_validate';

const categoryRouter = express.Router();

categoryRouter.post(
  '/category/sign-up',
  validateRequest(category_validate.categorySchema),
  asyncWrapper(auth_controller.register)
)

  .get(
    '/category/get-all',
    asyncWrapper(auth_controller.get_all_users)
  );

export default categoryRouter;