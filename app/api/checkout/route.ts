import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId, serviceId, amount, paymentMethod } = await request.json();

    if (!userId || !serviceId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        serviceId,
        amount,
        status: 'SUCCESS',
        paymentMethod: paymentMethod || 'bKash',
      },
      include: {
        service: true,
        user: true,
      },
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}
