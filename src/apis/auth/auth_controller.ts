import { Request, Response } from 'express';
import { HttpStatus } from '../../config/config';
import { sendResponse } from '../../utils/sendResponse';
import auth_service from './auth_service';

const register = async (req: Request, res: Response) => {
  const data = await auth_service.register(req.body);
  sendResponse(res, HttpStatus.SUCCESS, data);
}

const get_all_users = async (req: Request, res: Response) => {
  const data = await auth_service.get_all_users();
  sendResponse(res, HttpStatus.SUCCESS, data);
}

const login = async (req: Request, res: Response) => {
  const data = await auth_service.login(req.body);
  sendResponse(res, HttpStatus.SUCCESS, data);
}

export default {
  register,
  get_all_users,
  login
}
