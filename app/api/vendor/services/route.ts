import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vendorProfileId, name, description, price, category } = body;

    if (!vendorProfileId || !name || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields (vendorProfileId, name, description, category)' },
        { status: 400 }
      );
    }

    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: { vendorProfileId, name, description, price, category },
    });

    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
