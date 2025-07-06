import { Request, Response } from 'express';
import config, { HttpStatus } from '../../config/config';
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
  sendResponse(res, HttpStatus.SUCCESS, data, [config.ACCESS_TOKEN_NAME, data.token || "", 60 * 60 * 24 * 1000]);
}

export default {
  register,
  get_all_users,
  login
}
