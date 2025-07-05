import { Request, Response } from 'express';
import auth_service from './auth_service';

const register = async (req: Request, res: Response) => {
  const data = await auth_service.register(req.body);
  res.status(200).json(data);
}

export default {
  register
}
