import express from 'express';
import { PrismaClient } from '../../../generated/prisma';
import asyncWrapper from '../../middleware/asyncWrapper';
const prisma = new PrismaClient();
const aggregateRouter = express.Router();

aggregateRouter.get('/aggregations/0', asyncWrapper(
  async (req, res) => {
    const data: any = await prisma.$queryRaw`
    SELECT 
      COUNT(*) AS total_posts,
      COUNT(DISTINCT user_id) AS total_users,
      COUNT(DISTINCT category_id) AS total_categories
    FROM "Posts"
    `
    console.log(data)
    const result = data[0];

    const serialized = {
      total_posts: Number(result.total_posts),
      total_users: Number(result.total_users),
      total_categories: Number(result.total_categories),
    };
    res.status(200).json(serialized);
  }
));
// 1
aggregateRouter.get('/aggregations/1', asyncWrapper(
  async (req, res) => {
    const data: any = await prisma.$queryRaw`
    SELECT 
      COUNT(*) AS total_posts,
      COUNT(DISTINCT user_id) AS total_users,
      COUNT(DISTINCT category_id) AS total_categories,
      COUNT(DISTINCT tag_id) AS total_tags
    FROM "Posts"
    `

    res.status(200).json(data);
  }
));

export default aggregateRouter;
