import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    // Fetch all lost items from the database
    const lostItems = await prisma.lostItem.findMany();
    return NextResponse.json(lostItems, { status: 200 });
  } catch (error) {
    console.error('Error fetching lost items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lost items' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Parse the request body to extract item details
    const { name, description, location, dateFound, claimQuestions } = await req.json();

    // Validate required fields
    if (!name || !description || !location || !dateFound || !Array.isArray(claimQuestions)) {
      return NextResponse.json(
        { error: 'All fields (name, description, location, dateFound, claimQuestions) are required' },
        { status: 400 }
      );
    }

    // Create a new lost item in the database
    const lostItem = await prisma.lostItem.create({
      data: {
        name,
        description,
        location,
        dateFound: new Date(dateFound), // Ensure dateFound is properly parsed to a Date object
        claimQuestions,
      },
    });

    return NextResponse.json(lostItem, { status: 201 });
  } catch (error) {
    console.error('Error creating lost item:', error);
    return NextResponse.json(
      { error: 'Failed to create lost item' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // Parse the request to extract the ID of the item to delete
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required to delete a lost item' },
        { status: 400 }
      );
    }

    // Check if the item exists
    const item = await prisma.lostItem.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json({ error: 'Lost item not found' }, { status: 404 });
    }

    // Delete the item
    await prisma.lostItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Lost item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting lost item:', error);
    return NextResponse.json(
      { error: 'Failed to delete lost item' },
      { status: 500 }
    );
  }
}
