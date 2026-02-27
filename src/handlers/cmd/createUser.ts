import { PrismaClient } from '@prisma/client';
          import bcrypt from 'bcrypt';

          const prisma = new PrismaClient();

          async function main() {
            const username = process.argv[2];
            const email = process.argv[3];
            const password = process.argv[4];

            if (!username || !email || !password) {
              console.error('Usage: ts-node createUser.ts <username> <email> <password>');
              process.exit(1);
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.users.upsert({
              where: { email },
              update: {},
              create: {
                username,
                email,
                password: hashedPassword,
                isAdmin: true,
              },
            });

            console.log('User created or already exists');
          }

          main()
            .catch(e => {
              console.error(e);
              process.exit(1);
            })
            .finally(async () => {
              await prisma.\$disconnect();
            });
