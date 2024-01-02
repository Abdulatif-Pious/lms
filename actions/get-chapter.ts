import { db } from '@/lib/db';
import { Attachment, Chapter } from '@prisma/client';

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
};

export const getChapter = async ({
  userId,
  courseId,
  chapterId
} : GetChapterProps) => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId,
        courseId
      }
    });
    
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      select: {
        price: true
      }
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true
      }
    });

    if (!course || !chapter) {
      throw new Error("course or chapter not found");
    }

    let muxData = null;
    let attachments : Attachment[] = [];
    let nextChapter : Chapter | null = null;

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId
        }
      })
    };

    if (purchase || chapter.isFree) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId
        }
      });

      nextChapter = await db.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: {
            gt: chapter?.position
          },
        },
        orderBy: {
          position: "asc"
        }
      });
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        }
      }
    });

    return {
      course,
      chapter,
      userProgress,
      attachments,
      muxData,
      purchase,
      nextChapter,
    }

  } catch (error) {
    console.log("[GET_CHAPTER]", error);
    return {
      course: null,
      chapter: null,
      userProgress: null,
      attachments: [],
      muxData: null,
      purchase: null,
      nextChapter: null,
    }
  }
} 