import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { vendorProfileId, name, description, price, category } = await request.json();

    const service = await prisma.service.create({
      data: { vendorProfileId, name, description, price, category },
    });

    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
