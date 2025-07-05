import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import validateRequest from '../../middleware/validateRequest';
import auth_controller from './category_controller';
import auth_validate from './category_validate';

const categoryRouter = express.Router();

categoryRouter.post(
  '/category/sign-up',
  validateRequest(auth_validate.userRegisterSchema),
  asyncWrapper(auth_controller.register)
)

  .get(
    '/category/get-all',
    asyncWrapper(auth_controller.get_all_users)
  );

export default categoryRouter;