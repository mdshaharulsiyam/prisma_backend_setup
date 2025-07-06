import bcrypt from "bcrypt";
const matchPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
export default matchPassword;