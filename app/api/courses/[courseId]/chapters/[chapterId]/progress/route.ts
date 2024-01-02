import  { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function PUT(
  req: Request,
  { params } : { params: { chapterId : string }
}) {
  try {
    const { userId } = auth();
    const { isCompleted } = await req.json();

    if (!userId)  {
      return new NextResponse("Unauthorized", { status: 401 }); 
    }

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          chapterId: params.chapterId,
          userId
        },
      }, 
      update: {
        isCompleted,
      },
      create: {
        chapterId: params.chapterId,
        userId,
        isCompleted
      }
    })

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("CHAPTER_ID_PROGRESS", error);
    return new NextResponse("Intrenal error", { status: 500 });
  }
} 
