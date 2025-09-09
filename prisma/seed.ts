const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create a hashed password for the admin
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create an admin user
  await prisma.admin.create({
    data: {
      email: 'admin@tubestream.com',
      password: hashedPassword,
    },
  });
  console.log('Admin user created.');

  // Create some sample videos
  await prisma.video.createMany({
    data: [
      {
        title: 'Exploring the Mountains',
        description: 'A beautiful journey through the snowy peaks.',
        thumbnail: 'https://via.placeholder.com/400x225.png?text=Mountain+Video',
        videoUrl: 'placeholder.mp4',
        duration: '10:32',
        category: 'Travel',
        views: '1500',
      },
      {
        title: 'How to Cook Pasta',
        description: 'A simple and delicious pasta recipe for beginners.',
        thumbnail: 'https://via.placeholder.com/400x225.png?text=Cooking+Video',
        videoUrl: 'placeholder.mp4',
        duration: '05:15',
        category: 'Cooking',
        views: '8500',
      },
      {
        title: 'Introduction to React',
        description: 'Learn the basics of React in this comprehensive tutorial.',
        thumbnail: 'https://via.placeholder.com/400x225.png?text=Tech+Video',
        videoUrl: 'placeholder.mp4',
        duration: '45:10',
        category: 'Tech',
        views: '12000',
      },
      {
        title: 'Morning Yoga Flow',
        description: 'Start your day with this refreshing 15-minute yoga session.',
        thumbnail: 'https://via.placeholder.com/400x225.png?text=Yoga+Video',
        videoUrl: 'placeholder.mp4',
        duration: '15:00',
        category: 'Fitness',
        views: '950',
      },
    ],
  });
  console.log('Sample videos created.');
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });