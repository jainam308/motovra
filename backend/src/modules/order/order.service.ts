import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface DeliveryInfo {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface CreateOrderPayload {
  vehicleId: string;
  userId?: string | null;
  quantity?: number;
  deliveryInfo?: Partial<DeliveryInfo>;
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<any> {
    const { vehicleId, userId, quantity = 1, deliveryInfo } = payload;
    const requestedQty = Math.max(1, quantity);

    let validUserId: string | null = userId && userId !== 'guest' ? userId : null;
    if (validUserId) {
      const existingUser = await prisma.user.findUnique({ where: { id: validUserId } });
      if (!existingUser) {
        validUserId = null;
      }
    }

    const delivery: DeliveryInfo = {
      fullName: deliveryInfo?.fullName?.trim() || '',
      phone: deliveryInfo?.phone?.trim() || '',
      addressLine: deliveryInfo?.addressLine?.trim() || '',
      city: deliveryInfo?.city?.trim() || '',
      state: deliveryInfo?.state?.trim() || '',
      postalCode: deliveryInfo?.postalCode?.trim() || ''
    };

    // Validate required delivery fields
    const missingFields = (Object.keys(delivery) as (keyof DeliveryInfo)[]).filter(k => !delivery[k]);
    if (missingFields.length > 0) {
      const err: any = new Error(`Missing delivery information: ${missingFields.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    try {
      return await prisma.$transaction(
        async (tx) => {
          const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId } });
          if (!vehicle) {
            const err: any = new Error('Vehicle not found');
            err.statusCode = 404;
            throw err;
          }

          if (vehicle.quantity < requestedQty) {
            const err: any = new Error('Insufficient stock available');
            err.statusCode = 409;
            throw err;
          }

          // Generate unique human-readable order number (e.g. MV-1001 or MV-847291)
          const randomSuffix = Math.floor(1000 + Math.random() * 9000);
          const orderNumber = `MV-${Date.now().toString().slice(-4)}${randomSuffix}`;

          const priceAtPurchase = Number(vehicle.price);
          const totalAmount = priceAtPurchase * requestedQty;

          // Decrement vehicle stock
          await tx.vehicle.update({
            where: { id: vehicleId },
            data: { quantity: vehicle.quantity - requestedQty }
          });

          // Create Order entity
          const order = await tx.order.create({
            data: {
              orderNumber,
              userId: validUserId,
              vehicleId,
              make: vehicle.make,
              model: vehicle.model,
              priceAtPurchase,
              quantity: requestedQty,
              totalAmount,
              status: 'CONFIRMED',
              fullName: delivery.fullName,
              phone: delivery.phone,
              addressLine: delivery.addressLine,
              city: delivery.city,
              state: delivery.state,
              postalCode: delivery.postalCode
            }
          });

          return {
            ...order,
            deliveryInfo: {
              fullName: order.fullName,
              phone: order.phone,
              addressLine: order.addressLine,
              city: order.city,
              state: order.state,
              postalCode: order.postalCode
            }
          };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable
        }
      );
    } catch (error: any) {
      if (error.code === 'P2034') {
        const err: any = new Error('Concurrency conflict. Please try again.');
        err.statusCode = 409;
        throw err;
      }
      throw error;
    }
  },

  async getUserOrders(userId: string): Promise<any[]> {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return orders.map(order => ({
      ...order,
      deliveryInfo: {
        fullName: order.fullName,
        phone: order.phone,
        addressLine: order.addressLine,
        city: order.city,
        state: order.state,
        postalCode: order.postalCode
      }
    }));
  },

  async getOrderById(id: string, userId: string): Promise<any> {
    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      const err: any = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }

    if (order.userId !== userId) {
      const err: any = new Error('You do not have permission to view this order');
      err.statusCode = 403;
      throw err;
    }

    return {
      ...order,
      deliveryInfo: {
        fullName: order.fullName,
        phone: order.phone,
        addressLine: order.addressLine,
        city: order.city,
        state: order.state,
        postalCode: order.postalCode
      }
    };
  }
};
