import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding rich interactive Analytics & Dashboard data...');

  const passwordHash = await bcrypt.hash('password123', 12);

  // 1. Ensure Admin and Customer accounts exist
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

  // 2. Clear old test orders & payments safely
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.contactInquiry.deleteMany();

  // 3. Create Vehicles
  console.log('Seeding 15 Luxury Supercars & EVs...');
  const porsche = await prisma.vehicle.create({
    data: { make: 'Porsche', model: '911 GT3 RS', category: 'SPORTS', price: 223800, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1600' }
  });
  const aston = await prisma.vehicle.create({
    data: { make: 'Aston Martin', model: 'DBS Superleggera', category: 'SPORTS', price: 330000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1600' }
  });
  const bentley = await prisma.vehicle.create({
    data: { make: 'Bentley', model: 'Continental GT', category: 'LUXURY', price: 235000, quantity: 4, imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1600' }
  });
  const rolls = await prisma.vehicle.create({
    data: { make: 'Rolls-Royce', model: 'Phantom', category: 'LUXURY', price: 460000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&q=80&w=1600' }
  });
  const g63 = await prisma.vehicle.create({
    data: { make: 'Mercedes-Benz', model: 'G63 AMG', category: 'SUV', price: 179000, quantity: 5, imageUrl: 'https://images.unsplash.com/photo-1520031441872-265e4ff70426?auto=format&fit=crop&q=80&w=1600' }
  });
  const urus = await prisma.vehicle.create({
    data: { make: 'Lamborghini', model: 'Urus Performante', category: 'SUV', price: 260000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1600' }
  });
  const sf90 = await prisma.vehicle.create({
    data: { make: 'Ferrari', model: 'SF90 Stradale', category: 'SPORTS', price: 524000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1600' }
  });
  const mclaren = await prisma.vehicle.create({
    data: { make: 'McLaren', model: '765LT', category: 'SPORTS', price: 382500, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=1600' }
  });

  // 4. Create Interactive Orders & Payments
  console.log('Seeding Interactive Orders & Payments...');

  // Order 1: Porsche 911 GT3 RS
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
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
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

  // Order 2: Aston Martin DBS Superleggera
  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'MV-872914',
      userId: customer3.id,
      vehicleId: aston.id,
      make: 'Aston Martin',
      model: 'DBS Superleggera',
      priceAtPurchase: 330000,
      quantity: 1,
      totalAmount: 330000,
      status: 'CONFIRMED',
      fullName: 'Alexander Pierce',
      phone: '+1 (415) 890-1234',
      addressLine: '750 Park Avenue, Suite 12B',
      city: 'New York',
      state: 'NY',
      postalCode: '10021',
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    },
  });

  await prisma.payment.create({
    data: {
      orderId: order2.id,
      razorpayOrderId: 'order_Ax72910384',
      razorpayPaymentId: 'pay_Ap92048172',
      razorpaySignature: 'sig_mock_aston',
      bookingAmount: 25000,
      remainingAmount: 305000,
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'BOOKING_PAID',
      paidAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    },
  });

  // Order 3: Rolls-Royce Phantom
  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'MV-651092',
      userId: customer1.id,
      vehicleId: rolls.id,
      make: 'Rolls-Royce',
      model: 'Phantom',
      priceAtPurchase: 460000,
      quantity: 1,
      totalAmount: 460000,
      status: 'DELIVERED',
      fullName: 'VIP Customer',
      phone: '+1 (800) 555-0199',
      addressLine: '1 Rodeo Drive',
      city: 'Beverly Hills',
      state: 'CA',
      postalCode: '90210',
      createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago
    },
  });

  await prisma.payment.create({
    data: {
      orderId: order3.id,
      razorpayOrderId: 'order_Rr10293847',
      razorpayPaymentId: 'pay_Rp91029384',
      razorpaySignature: 'sig_mock_rolls',
      bookingAmount: 25000,
      remainingAmount: 435000,
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'BOOKING_PAID',
      paidAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    },
  });

  // Order 4: Ferrari SF90 Stradale
  const order4 = await prisma.order.create({
    data: {
      orderNumber: 'MV-910482',
      userId: customer2.id,
      vehicleId: sf90.id,
      make: 'Ferrari',
      model: 'SF90 Stradale',
      priceAtPurchase: 524000,
      quantity: 1,
      totalAmount: 524000,
      status: 'CONFIRMED',
      fullName: 'Jainam Vora',
      phone: '+91 99887 76655',
      addressLine: '100 Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400020',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  });

  await prisma.payment.create({
    data: {
      orderId: order4.id,
      razorpayOrderId: 'order_Fs91029384',
      razorpayPaymentId: 'pay_Fp81920491',
      razorpaySignature: 'sig_mock_ferrari',
      bookingAmount: 25000,
      remainingAmount: 499000,
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'BOOKING_PAID',
      paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // 5. Seed Contact Inquiries
  console.log('Seeding Contact Inquiries...');
  await prisma.contactInquiry.createMany({
    data: [
      {
        name: 'Sir Charles Sterling',
        email: 'charles.sterling@knightsbridge.co.uk',
        subject: 'Custom Bespoke Interior Spec - Rolls-Royce Phantom',
        message: 'Interested in commissioning a customized Starlight Headliner and personalized wood veneer for the Phantom.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'Elena Rostova',
        email: 'elena.r@monacomotors.mc',
        subject: 'Test Drive Reservation - Ferrari SF90 Stradale',
        message: 'Requesting a private track consultation for the SF90 Stradale at Yas Marina Circuit.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'Marcus Vance',
        email: 'marcus@vancecapital.com',
        subject: 'Fleet Acquisition Inquiry - Mercedes G63 AMG',
        message: 'Looking to purchase 2 units of G63 AMG for private security transport in Zurich.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('🎉 Analytics & Dashboard data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
