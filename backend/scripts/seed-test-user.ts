import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const username = process.env.TEST_USER_USERNAME;
  const password = process.env.TEST_USER_PASSWORD;
  const email = process.env.TEST_USER_EMAIL || 'loadtest@example.test';

  if (!username || !password) {
    throw new Error(
      'TEST_USER_USERNAME and TEST_USER_PASSWORD must be set before seeding.',
    );
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to seed a test user in production.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      username,
      password: passwordHash,
    },
    create: {
      username,
      email,
      password: passwordHash,
    },
  });

  console.log(`Test user ready: id=${user.id}, username=${user.username}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
