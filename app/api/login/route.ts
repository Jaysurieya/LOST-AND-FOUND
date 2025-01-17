import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { rollNumber, password } = await req.json()

    const student = await prisma.student.findUnique({
      where: { rollNumber },
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(password, student.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    return NextResponse.json({
      id: student.id,
      name: student.name,
      role: 'student',
      rollNumber: student.rollNumber,
      email: student.email,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

