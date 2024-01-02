import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { File } from 'lucide-react';

import { getChapter } from '@/actions/get-chapter';
import { Banner } from '@/components/banner';
import { Separator } from '@/components/ui/separator';
import { Preview } from '@/components/preview';

import { VideoPlayer } from './_components/video-player';
import { CourseProgressButton } from './_components/course-progress-button';
import { CourseEnrollButton } from './_components/course-enroll-button';

const ChapterIdPage = async (
  { params } : { params: { courseId : string; chapterId : string } }
) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  };
  
  const {
    course,
    chapter,
    userProgress,
    attachments,
    muxData,
    purchase,
    nextChapter,
  } = await getChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId
  });

  if (!course || !chapter) {
    return redirect("/");
  }

  const isLocked = !chapter?.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner 
          label="You already completed this chapter"
          variant="success"
        />
      )}
      {isLocked && (
        <Banner 
          label="You need to purchase this course to watch this chapter "
        />
      )}
      <div className='flex flex-col max-w-4xl mx-auto pb-20 p-4'>
        <VideoPlayer 
          title={chapter?.title!}
          playbackId={muxData?.playbackId!}
          courseId={params.courseId}
          chapterId={params.chapterId}
          nextChapterId={nextChapter?.id!}
          isLocked={isLocked}
          completeOnEnd={completeOnEnd}
        />
        <div className='flex flex-col gap-2 md:flex-row items-center justify-between my-2'>
          <h2 className='text-semibold text-2xl'>{chapter?.title}</h2>
          {purchase ? (
            <CourseProgressButton
              courseId={params.courseId}
              chapterId={params.chapterId}
              isCompleted={userProgress?.isCompleted!}
              nextChapterId={nextChapter?.id!}

            />
          ) : (
            <CourseEnrollButton 
              price={course?.price!}
              courseId={params.courseId}
            />
          )}
        </div>
        <Separator />
        <div>
          <Preview value={chapter?.description!}/>
        </div>
        {!!attachments.length && (
          <>
            <Separator />
            {attachments.map((attachment) => (
              <a 
                key={attachment.id}
                href={attachment.url}
                target="_blank"
                className='flex items-center gap-x-2 p-3 w-full bg-sky-200 text-sky-700 border rounded-md hover:underline'
              >
                <File />
                <p className='line-clamp-1'>
                  {attachment.name}
                </p>
              </a>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ChapterIdPage;