import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const { title } = await req.json();
    const todo = await prisma.todo.create({
        data: {
            title,
            completed: false
        }
    });
    return NextResponse.json(todo);
}

export async function GET() {
    // 取出所有的
    const todos = await prisma.todo.findMany({
        orderBy:{
            createdAt: 'desc'
        }
    });
    return NextResponse.json(todos);
}
