import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

const ALLOWED_CATEGORIES = ['Cleaning', 'Plumbing', 'AC Repair', 'Electrical', 'Painting', 'Carpentry'];
const MAX_NAME_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description, price, category } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > MAX_NAME_LENGTH) {
      return NextResponse.json({ error: 'Invalid service name' }, { status: 400 });
    }
    if (!description || typeof description !== 'string' || description.trim().length === 0 || description.length > MAX_DESCRIPTION_LENGTH) {
      return NextResponse.json({ error: 'Invalid description' }, { status: 400 });
    }
    if (typeof price !== 'number' || !isFinite(price) || price <= 0) {
      return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 });
    }
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: session.id },
    });

    if (!vendorProfile) {
      return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 });
    }

    const service = await prisma.service.create({
      data: {
        vendorProfileId: vendorProfile.id,
        name: name.trim(),
        description: description.trim(),
        price,
        category,
      },
    });

    return NextResponse.json({ success: true, service });
  } catch {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
