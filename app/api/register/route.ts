import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { rollNumber, email, password } = await req.json()
    const hashedPassword = await bcrypt.hash(password, 10)

    const student = await prisma.student.create({
      data: {
        rollNumber,
        name: rollNumber, // Using rollNumber as name for simplicity
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json({ message: 'Student registered successfully' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}

