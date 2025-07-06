import express from 'express';
import { PrismaClient } from '../../../generated/prisma';
const router = express.Router();
const prisma = new PrismaClient();

async function clearAllData() {
  // Delete in dependency order
  await prisma.postTag.deleteMany();
  await prisma.likes.deleteMany();
  await prisma.comments.deleteMany();
  await prisma.posts.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.users.deleteMany();
  await prisma.tags.deleteMany();
  await prisma.categories.deleteMany();
}
async function main() {
  await clearAllData();

  // Users (12 users)
  await prisma.users.createMany({
    data: [
      { id: 1, email: 'user1@example.com', password: 'pass', name: 'User 1' },
      { id: 2, email: 'user2@example.com', password: 'pass', name: 'User 2', block: true },
      { id: 3, email: 'user3@example.com', password: 'pass', name: 'User 3', is_verified: false },
      { id: 4, email: 'user4@example.com', password: 'pass', name: 'User 4' },
      { id: 5, email: 'user5@example.com', password: 'pass', name: 'User 5' },
      { id: 6, email: 'user6@example.com', password: 'pass', name: 'User 6', block: true },
      { id: 7, email: 'user7@example.com', password: 'pass', name: 'User 7' },
      { id: 8, email: 'user8@example.com', password: 'pass', name: 'User 8' },
      { id: 9, email: 'user9@example.com', password: 'pass', name: 'User 9', is_verified: false },
      { id: 10, email: 'user10@example.com', password: 'pass', name: 'User 10' },
      { id: 11, email: 'user11@example.com', password: 'pass', name: 'User 11' },
      { id: 12, email: 'user12@example.com', password: 'pass', name: 'User 12' },
    ],
  });

  // Profiles (at least 10)
  await prisma.profile.createMany({
    data: [
      { id: 1, userId: 1, bio: 'Bio 1', avatarUrl: 'https://example.com/avatar1.png' },
      { id: 2, userId: 2, bio: 'Bio 2', avatarUrl: 'https://example.com/avatar2.png' },
      { id: 3, userId: 3, bio: 'Bio 3', avatarUrl: 'https://example.com/avatar3.png' },
      { id: 4, userId: 4, bio: 'Bio 4', avatarUrl: 'https://example.com/avatar4.png' },
      { id: 5, userId: 5, bio: 'Bio 5', avatarUrl: 'https://example.com/avatar5.png' },
      { id: 6, userId: 6, bio: 'Bio 6', avatarUrl: 'https://example.com/avatar6.png' },
      { id: 7, userId: 7, bio: 'Bio 7', avatarUrl: 'https://example.com/avatar7.png' },
      { id: 8, userId: 8, bio: 'Bio 8', avatarUrl: 'https://example.com/avatar8.png' },
      { id: 9, userId: 9, bio: 'Bio 9', avatarUrl: 'https://example.com/avatar9.png' },
      { id: 10, userId: 10, bio: 'Bio 10', avatarUrl: 'https://example.com/avatar10.png' },
    ],
  });

  // Categories (6 categories)
  await prisma.categories.createMany({
    data: [
      { id: 1, name: 'Tech' },
      { id: 2, name: 'Life' },
      { id: 3, name: 'Health' },
      { id: 4, name: 'Travel' },
      { id: 5, name: 'Food' },
      { id: 6, name: 'Education' },
    ],
  });

  // Tags (12 tags)
  await prisma.tags.createMany({
    data: [
      { id: 1, name: 'javascript' },
      { id: 2, name: 'nodejs' },
      { id: 3, name: 'prisma' },
      { id: 4, name: 'life' },
      { id: 5, name: 'tech' },
      { id: 6, name: 'code' },
      { id: 7, name: 'ai' },
      { id: 8, name: 'webdev' },
      { id: 9, name: 'database' },
      { id: 10, name: 'design' },
      { id: 11, name: 'health' },
      { id: 12, name: 'travel' },
    ],
  });

  // Posts (12 posts)
  await prisma.posts.createMany({
    data: [
      { id: 1, title: 'JS Basics', desc: 'Intro', category_id: 1, user_id: 1 },
      { id: 2, title: 'Deep Node', desc: 'Node', category_id: 1, user_id: 2 },
      { id: 3, title: 'Life Tips', desc: 'Tips', category_id: 2, user_id: 1 },
      { id: 4, title: 'Healthy Living', desc: 'Health post', category_id: 3, user_id: 3 },
      { id: 5, title: 'Travel Hacks', desc: 'Travel post', category_id: 4, user_id: 4 },
      { id: 6, title: 'Food Recipes', desc: 'Food post', category_id: 5, user_id: 5 },
      { id: 7, title: 'Prisma ORM', desc: 'Prisma tips', category_id: 1, user_id: 6 },
      { id: 8, title: 'AI Trends', desc: 'AI discussion', category_id: 5, user_id: 7 },
      { id: 9, title: 'Web Design', desc: 'Design tips', category_id: 6, user_id: 8 },
      { id: 10, title: 'Node and Databases', desc: 'Databases', category_id: 1, user_id: 9 },
      { id: 11, title: 'Mental Health', desc: 'Health tips', category_id: 3, user_id: 10 },
      { id: 12, title: 'Coding Best Practices', desc: 'Coding tips', category_id: 6, user_id: 11 },
    ],
  });

  // PostTag (assigning multiple tags per post)
  await prisma.postTag.createMany({
    data: [
      { post_id: 1, tag_id: 1 },
      { post_id: 1, tag_id: 6 },
      { post_id: 2, tag_id: 2 },
      { post_id: 2, tag_id: 9 },
      { post_id: 3, tag_id: 4 },
      { post_id: 4, tag_id: 11 },
      { post_id: 5, tag_id: 12 },
      { post_id: 6, tag_id: 5 },
      { post_id: 7, tag_id: 3 },
      { post_id: 8, tag_id: 7 },
      { post_id: 9, tag_id: 10 },
      { post_id: 10, tag_id: 2 },
      { post_id: 10, tag_id: 9 },
      { post_id: 11, tag_id: 11 },
      { post_id: 12, tag_id: 6 },
    ],
  });

  // Comments (12 comments)
  await prisma.comments.createMany({
    data: [
      { text: 'Great post!', post_id: 1, user_id: 2 },
      { text: 'Very helpful', post_id: 1, user_id: 3 },
      { text: 'Thanks for sharing', post_id: 2, user_id: 1 },
      { text: 'Interesting read', post_id: 3, user_id: 4 },
      { text: 'Awesome tips', post_id: 4, user_id: 5 },
      { text: 'Loved it', post_id: 5, user_id: 6 },
      { text: 'Well explained', post_id: 6, user_id: 7 },
      { text: 'Good info', post_id: 7, user_id: 8 },
      { text: 'Helpful post', post_id: 8, user_id: 9 },
      { text: 'Nice article', post_id: 9, user_id: 10 },
      { text: 'Thanks!', post_id: 10, user_id: 11 },
      { text: 'Very useful', post_id: 11, user_id: 12 },
    ],
  });

  // Likes (12 likes)
  await prisma.likes.createMany({
    data: [
      { post_id: 1, user_id: 3 },
      { post_id: 1, user_id: 4 },
      { post_id: 2, user_id: 1 },
      { post_id: 3, user_id: 2 },
      { post_id: 4, user_id: 3 },
      { post_id: 5, user_id: 4 },
      { post_id: 6, user_id: 5 },
      { post_id: 7, user_id: 6 },
      { post_id: 8, user_id: 7 },
      { post_id: 9, user_id: 8 },
      { post_id: 10, user_id: 9 },
      { post_id: 11, user_id: 10 },
    ],
  });
}

router.get('/insert', async (req, res) => {
  try {
    await main().finally(() => prisma.$disconnect());
    res.send('Data inserted successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Failed to insert data');
  }
});

export default router;
