import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import validateRequest from '../../middleware/validateRequest';
import auth_controller from './auth_controller';
import auth_validate from './auth_validate';

const authRouter = express.Router();
authRouter.post('/auth/sign-up', validateRequest(auth_validate.userRegisterSchema), asyncWrapper(auth_controller.register));
export default authRouter;