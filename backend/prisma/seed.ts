import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data for a clean seed
  console.log('Clearing existing data...');
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // Hash password
  const passwordHash = await bcrypt.hash('password123', 12);

  // Users
  console.log('Seeding users...');
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      email: 'customer@example.com',
      passwordHash,
      role: 'CUSTOMER',
    },
  });

  // Vehicles
  console.log('Seeding vehicles...');
  const vehicles = [
    {
      make: 'Toyota',
      model: 'Camry',
      category: 'Sedan',
      price: 25000,
      quantity: 5,
    },
    {
      make: 'Honda',
      model: 'Civic',
      category: 'Sedan',
      price: 22000,
      quantity: 3,
    },
    {
      make: 'Ford',
      model: 'F-150',
      category: 'Truck',
      price: 45000,
      quantity: 2,
    },
    {
      make: 'Tesla',
      model: 'Model 3',
      category: 'Electric',
      price: 40000,
      quantity: 4,
    },
    {
      make: 'BMW',
      model: 'X5',
      category: 'SUV',
      price: 60000,
      quantity: 1,
    },
    {
      make: 'Porsche',
      model: '911',
      category: 'Sports',
      price: 105000,
      quantity: 1,
    },
  ];

  for (const v of vehicles) {
    await prisma.vehicle.create({
      data: v,
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
