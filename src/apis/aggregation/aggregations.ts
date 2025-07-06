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
    const data: any = await prisma.users.count({})

    res.status(200).json(data);
  }
));
// 2
aggregateRouter.get('/aggregations/2', asyncWrapper(
  async (req, res) => {
    const data: any = await prisma.$queryRaw`
    SELECT COUNT(*)::INT AS total_posts, u.name AS user_name  FROM "Posts" s INNER JOIN "Users" u ON s.user_id = u.id GROUP BY u.id
    `
    res.status(200).json(data);
  }
));
// 3
aggregateRouter.get('/aggregations/3', asyncWrapper(
  async (req, res) => {
    const data: any = await prisma.comments.count()
    res.status(200).json(data);
  }
));
// 4
aggregateRouter.get('/aggregations/4', asyncWrapper(
  async (req, res) => {
    const data: any = await prisma.categories.findMany({
      select: {
        name: true,
        posts: true,
        _count: {
          select: {
            posts: true
          }
        }
      }
    })
    res.status(200).json(data);
  }
));
// 5
aggregateRouter.get('/aggregations/5', asyncWrapper(
  async (req, res) => {
    const data: any = await prisma.posts.findMany({
      select: {
        title: true,
        likes: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    })
    res.status(200).json(data);
  }
));
// 6
aggregateRouter.get('/aggregations/5', asyncWrapper(
  async (req, res) => {
    const data: any = await prisma.posts.findMany({
      select: {
        title: true,
        likes: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    })
    res.status(200).json(data);
  }
));



export default aggregateRouter;
