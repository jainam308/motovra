import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding seed data (non-destructive for users)...');

  // Only clear orders and vehicles — never wipe all users
  try {
    await prisma.order.deleteMany();
  } catch (e) {}
  await prisma.vehicle.deleteMany();

  // Upsert admin and customer seed accounts (preserves all other users including Google OAuth users)
  const passwordHash = await bcrypt.hash('password123', 12);

  console.log('Upserting seed users...');
  await prisma.user.upsert({
    where: { email: 'admin@motovra.com' },
    update: { passwordHash, role: 'ADMIN' },
    create: { email: 'admin@motovra.com', passwordHash, role: 'ADMIN' },
  });

  await prisma.user.upsert({
    where: { email: 'customer@motovra.com' },
    update: { passwordHash, role: 'CUSTOMER' },
    create: { email: 'customer@motovra.com', passwordHash, role: 'CUSTOMER' },
  });

  console.log('Seeding vehicles...');
  const vehicles = [
    { make: 'Porsche', model: '911 GT3 RS', category: 'SPORTS', price: 223800, quantity: 2 },
    { make: 'Aston Martin', model: 'DBS Superleggera', category: 'SPORTS', price: 330000, quantity: 1 },
    { make: 'Bentley', model: 'Continental GT', category: 'LUXURY', price: 235000, quantity: 3 },
    { make: 'Rolls-Royce', model: 'Phantom', category: 'LUXURY', price: 460000, quantity: 1 },
    { make: 'Mercedes-Benz', model: 'G63 AMG', category: 'SUV', price: 179000, quantity: 4 },
    { make: 'Lamborghini', model: 'Urus Performante', category: 'SUV', price: 260000, quantity: 2 },
    { make: 'Ferrari', model: 'SF90 Stradale', category: 'SPORTS', price: 524000, quantity: 1 },
    { make: 'McLaren', model: '765LT', category: 'SPORTS', price: 382500, quantity: 1 },
    { make: 'Range Rover', model: 'SV Autobiography', category: 'SUV', price: 211000, quantity: 5 },
    { make: 'Tesla', model: 'Model S Plaid', category: 'ELECTRIC', price: 108490, quantity: 8 },
    { make: 'Lucid', model: 'Air Sapphire', category: 'ELECTRIC', price: 249000, quantity: 2 },
    { make: 'Rivian', model: 'R1S', category: 'SUV', price: 92000, quantity: 12 },
    { make: 'Audi', model: 'RS e-tron GT', category: 'ELECTRIC', price: 143900, quantity: 3 },
    { make: 'BMW', model: 'M8 Competition', category: 'SPORTS', price: 138800, quantity: 4 },
    { make: 'Lexus', model: 'LC 500', category: 'LUXURY', price: 99050, quantity: 5 },
  ];

  for (const v of vehicles) {
    await prisma.vehicle.create({ data: v });
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
