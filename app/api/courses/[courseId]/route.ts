import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import  Mux  from "@mux/mux-node";

import { db } from "@/lib/db";

const { Video } = new Mux(process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!);


export async function DELETE (
  req: Request,
  { params } : { params: { courseId: string  } }
) {

  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    };

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId
      },
      include: {
        chapters: {
          include: {
            muxData: true
          }
        }
      }
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        Video.Assets.del(chapter.muxData.assetId);
      }
    };

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
        userId
      }
    });

    return NextResponse.json(deletedCourse)

  } catch (error) {
    console.log("COURSE_ID_DELETE", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH( 
  req : Request,
  { params } : { params: { courseId: string } }
)  {
  try {
    const  values  = await req.json();
    const { userId } = auth();
    const { courseId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const course = await db.course.update({
      where: {
        userId,
        id: courseId
      }, 
      data: {
        ...values
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ID]",  error)
    return new NextResponse("Internal error", { status: 500 });
  }
}; 