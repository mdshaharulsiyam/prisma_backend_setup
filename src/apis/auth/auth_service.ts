import { PrismaClient, Users } from '../../../generated/prisma';
import hashText from '../../utils/hashText';
const prisma = new PrismaClient();
const register = async (data: Users): Promise<{ user: Users | null, message: string, error?: any }> => {
  const hasPassword = await hashText(data.password);
  const user = await prisma.users.create({ data: { ...data, password: hasPassword } });
  return { user, message: 'User created successfully' };
}

export default {
  register
}