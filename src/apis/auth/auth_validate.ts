import { z } from 'zod';
const userRegisterSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(3, 'Name must be at least 3 characters long'),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
  })
});
export default {
  userRegisterSchema
};
