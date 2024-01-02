import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@clerk/nextjs';
import { Trash, ArrowLeft, LayoutGrid, Eye, Video } from "lucide-react";

import { db } from '@/lib/db';
import { Banner } from '@/components/banner';
import { IconBadge } from '@/components/icon-badge';

import { ChapterTitleForm } from './_components/chapter-title-form';
import { ChapterDescriptionForm } from './_components/chapter-description-form';
import { ChapterAccessForm } from './_components/chapter-access-form';
import { ChapterVideoForm } from './_components/chapter-video-form';
import { ChapterActions } from './_components/chapter-actions';

const ChapterIdPage = async (
  { params } : { params: { courseId: string; chapterId: string } }
) => {

  const { userId } = auth();

  if (!userId) {
    return redirect(`/teacher/courses/${params.courseId}`);
  };

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId
    }
  });

  if (!chapter) {
    return redirect(`/teacher/courses/${params.courseId}`);
  }

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionField = `${completedFields}/${totalFields}`;

  const isCompelete = requiredFields.every(Boolean);

  return (
    <div>
      {!chapter.isPublished && (
        <Banner 
          label="This chapter is unpublished. It will not be visible to the students."
        />
      )}

      <Link   
        href={`/teacher/courses/${params.courseId}`} 
        className='flex items-center w-fit m-4 hover:opacity-75 transform' 
      >
        <ArrowLeft className='w-4 h-4 mr-2' />
        <p>Back to course setup</p>
      </Link>

      <div className='p-4'>
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            <h2 className='font-semibold text-2xl md:text-4xl'>Chapter setup</h2>
            <p className='text-sm font-normal text-slate-500'>
              Complete all fields {completionField}
            </p>
          </div>
          <ChapterActions
            disabled={!isCompelete}
            courseId={params.courseId}
            chapterId={params.chapterId}
            isPublished={chapter.isPublished}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 my-4 space-y-4 lg:space-x-4">
          <div>
            <div className='flex items-center gap-x-3'>
              <IconBadge icon={LayoutGrid} />
              <h4 className='font-medium text-2xl'>Customize your chapter</h4>
            </div>
            <ChapterTitleForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
            <ChapterDescriptionForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
            <div className='flex items-center gap-x-3'>
              <IconBadge icon={Eye} />
              <h4 className='font-medium text-2xl'>Chapter access</h4>
            </div>
            <ChapterAccessForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
          <div>
            <div className='flex items-center gap-x-3'>
              <IconBadge icon={Video} />
              <h4 className='font-medium text-2xl'>Customize your video</h4>
            </div>
            <ChapterVideoForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;