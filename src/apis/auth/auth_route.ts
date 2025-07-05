import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import auth_controller from './auth_controller';

const authRouter = express.Router();
authRouter.post('/auth/sign-up', asyncWrapper(auth_controller.register));
export default authRouter;