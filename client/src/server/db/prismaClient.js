import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

prisma
  .$connect()
  .then(() => {
    console.log('PostgreSQL connected via Prisma');
  })
  .catch((err) => {
    console.error('Failed to connect to PostgreSQL via Prisma:', err);
    process.exit(1);
  });

export default prisma;
