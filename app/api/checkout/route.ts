import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

const ALLOWED_PAYMENT_METHODS = ['bKash', 'Nagad', 'Card'] as const;

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'END_USER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { serviceId, paymentMethod } = body;

    if (!serviceId || typeof serviceId !== 'string') {
      return NextResponse.json({ error: 'Invalid serviceId' }, { status: 400 });
    }

    const resolvedPayment = ALLOWED_PAYMENT_METHODS.includes(paymentMethod)
      ? paymentMethod
      : 'bKash';

    const service = await prisma.service.findUnique({
      where: { id: serviceId, isActive: true },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: session.id,
        serviceId: service.id,
        amount: service.price,
        status: 'SUCCESS',
        paymentMethod: resolvedPayment,
      },
      include: {
        service: true,
        user: true,
      },
    });

    return NextResponse.json({ success: true, transaction });
  } catch {
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}
