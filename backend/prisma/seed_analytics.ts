import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding rich interactive Analytics & Dashboard data safely (NON-DESTRUCTIVE)...');

  const passwordHash = await bcrypt.hash('password123', 12);

  // 1. Ensure Admin and Customer accounts exist (upsert - never delete)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@motovra.com' },
    update: { passwordHash, role: 'ADMIN' },
    create: { email: 'admin@motovra.com', passwordHash, role: 'ADMIN' },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: 'customer@motovra.com' },
    update: { passwordHash, role: 'CUSTOMER' },
    create: { email: 'customer@motovra.com', passwordHash, role: 'CUSTOMER' },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: 'jvora7990@gmail.com' },
    update: { passwordHash, role: 'CUSTOMER' },
    create: { email: 'jvora7990@gmail.com', passwordHash, role: 'CUSTOMER' },
  });

  const customer3 = await prisma.user.upsert({
    where: { email: 'alexander.pierce@luxury.com' },
    update: { passwordHash, role: 'CUSTOMER' },
    create: { email: 'alexander.pierce@luxury.com', passwordHash, role: 'CUSTOMER' },
  });

  // 2. All 15 Luxury Vehicles (upsert - never delete existing vehicles or orders!)
  const vehiclesData = [
    { make: 'Porsche', model: '911 GT3 RS', category: 'SPORTS', price: 223800, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1600' },
    { make: 'Aston Martin', model: 'DBS Superleggera', category: 'SPORTS', price: 330000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1600' },
    { make: 'Bentley', model: 'Continental GT', category: 'LUXURY', price: 235000, quantity: 4, imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1600' },
    { make: 'Rolls-Royce', model: 'Phantom', category: 'LUXURY', price: 460000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&q=80&w=1600' },
    { make: 'Mercedes-Benz', model: 'G63 AMG', category: 'SUV', price: 179000, quantity: 5, imageUrl: 'https://images.unsplash.com/photo-1520031441872-265e4ff70426?auto=format&fit=crop&q=80&w=1600' },
    { make: 'Lamborghini', model: 'Urus Performante', category: 'SUV', price: 260000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1600' },
    { make: 'Ferrari', model: 'SF90 Stradale', category: 'SPORTS', price: 524000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1600' },
    { make: 'McLaren', model: '765LT', category: 'SPORTS', price: 382500, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=1600' },
    { make: 'Range Rover', model: 'SV Autobiography', category: 'SUV', price: 218000, quantity: 5, imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1600' },
    { make: 'Tesla', model: 'Model S Plaid', category: 'ELECTRIC', price: 89990, quantity: 8, imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1600' },
    { make: 'Lucid', model: 'Air Sapphire', category: 'ELECTRIC', price: 249000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1669047970876-02e07172ca7c?auto=format&fit=crop&q=80&w=1600' },
    { make: 'Rivian', model: 'R1S', category: 'SUV', price: 78000, quantity: 6, imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1600' },
    { make: 'Audi', model: 'RS e-tron GT', category: 'ELECTRIC', price: 147500, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&q=80&w=1600' },
    { make: 'BMW', model: 'M8 Competition', category: 'SPORTS', price: 138800, quantity: 4, imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1600' },
    { make: 'Lexus', model: 'LC 500', category: 'LUXURY', price: 99800, quantity: 5, imageUrl: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=1600' },
  ];

  const vehicleMap: Record<string, any> = {};

  for (const v of vehiclesData) {
    const existing = await prisma.vehicle.findFirst({ where: { make: v.make, model: v.model } });
    if (existing) {
      const updated = await prisma.vehicle.update({
        where: { id: existing.id },
        data: { category: v.category, price: v.price, imageUrl: v.imageUrl }
      });
      vehicleMap[`${v.make}_${v.model}`] = updated;
    } else {
      const created = await prisma.vehicle.create({ data: v });
      vehicleMap[`${v.make}_${v.model}`] = created;
    }
  }

  // 3. Upsert Sample Orders (only if orderNumber doesn't already exist!)
  const porsche = vehicleMap['Porsche_911 GT3 RS'];
  if (porsche) {
    const existingOrder1 = await prisma.order.findUnique({ where: { orderNumber: 'MV-984210' } });
    if (!existingOrder1) {
      const order1 = await prisma.order.create({
        data: {
          orderNumber: 'MV-984210',
          userId: customer2.id,
          vehicleId: porsche.id,
          make: 'Porsche',
          model: '911 GT3 RS',
          priceAtPurchase: 223800,
          quantity: 1,
          totalAmount: 223800,
          status: 'CONFIRMED',
          fullName: 'Jainam Vora',
          phone: '+91 99887 76655',
          addressLine: '100 Marine Drive',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400020',
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        },
      });

      await prisma.payment.create({
        data: {
          orderId: order1.id,
          razorpayOrderId: 'order_Nx84920193',
          razorpayPaymentId: 'pay_Nz91840192',
          razorpaySignature: 'sig_mock_porsche',
          bookingAmount: 25000,
          remainingAmount: 198800,
          paymentMethod: 'RAZORPAY',
          paymentStatus: 'BOOKING_PAID',
          paidAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  console.log('🎉 Analytics data populated safely without deleting any user orders!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
