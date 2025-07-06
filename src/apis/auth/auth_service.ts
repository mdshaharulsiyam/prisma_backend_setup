import { PrismaClient, Users } from '../../../generated/prisma';
import generateToken from '../../utils/generateToken';
import hashText from '../../utils/hashText';
import matchPassword from '../../utils/matchPassword';
const prisma = new PrismaClient();

const register = async (data: Users): Promise<{ data: Users | null, message: string, error?: any }> => {
  const hasPassword = await hashText(data.password);
  const user = await prisma.users.create({ data: { ...data, password: hasPassword } });
  return { data: user, message: 'User created successfully' };
}

const get_all_users = async (): Promise<{ users: Users[] | null, message: string, error?: any }> => {
  const users = await prisma.users.findMany();
  return { users, message: 'Users fetched successfully' };
}

const login = async (data: Users): Promise<{ data: Users | null, message: string, token?: string, error?: any }> => {
  const user = await prisma.users.findUnique({ where: { email: data.email } });


  if (!user) {
    return { data: null, message: 'invalid email or password' };
  }

  const isPasswordMatch = await matchPassword(data.password, user.password);

  if (!isPasswordMatch) {
    return { data: null, message: 'invalid email or password' };
  }

  const token = await generateToken({ id: user.id, email: user.email, role: user.role });
  return { message: 'User logged in successfully', data: user, token };
}

export default {
  register,
  get_all_users,
  login
}