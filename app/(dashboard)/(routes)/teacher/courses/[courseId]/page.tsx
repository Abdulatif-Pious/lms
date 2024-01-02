import { LayoutGrid, ListChecks, Trash, DollarSign, File } from 'lucide-react';
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db"; 
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { TitleForm } from './_components/title-form';
import { DescriptionForm } from './_components/description-form';
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { ChapterForm } from './_components/chapter-form';
import { PriceForm } from './_components/price-form';
import { AttachmentForm } from './_components/attachment-form';
import { Actions } from './_components/actions';


const CourseIdPage = async ({
  params
} : {
  params: { courseId: string }
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc"
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/teacher/courses");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  })

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished)
  ];

  const totalFields = requiredFields.length;
  const completedFfields = requiredFields.filter(Boolean).length;
  
  const completionField = `(${completedFfields}/${totalFields})`;

  const isCompelete = requiredFields.every(Boolean); 

  return (
    <div>
      {!course.isPublished && (
        <Banner 
          label="This course is unpublished. It will not be visible to the students."
      />
      )}
      
      <div className='p-4'>
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            <h2 className='font-semibold text-2xl md:text-4xl'>Course setup</h2>
            <p className='text-sm font-normal text-slate-500'>
              Complete all fields {completionField}
            </p>
          </div>
          <Actions
            disabled={!isCompelete}
            courseId={course.id}
            isPublished={course.isPublished}
          />
        </div>

        <div className='grid grid-cols-1  xl:grid-cols-2 my-4 space-y-4 xl:space-x-4'>
          <div>
            <div className='flex items-center gap-x-3'>
              <IconBadge icon={LayoutGrid} />
              <h4 className='font-medium text-2xl'>Customize your course</h4>
            </div> 
            <TitleForm
              initialData={course}
              courseId={course.id}
            />
            <DescriptionForm 
              initialData={course}
              courseId={course.id}
            />
            <ImageForm 
              initialData={course}
              courseId={course.id}
            />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category: any) => ({
                label: category.name,
                value: category.id
              }))}
            />
          </div>
          <div>
            <div className='flex items-center gap-x-3'>
              <IconBadge icon={ListChecks} />
              <h4 className='font-medium text-2xl'>Course Chapter</h4>
            </div>
            <ChapterForm 
              initialData={course}
              courseId={course.id}
            />
            <div className='flex items-center gap-x-3'>
              <IconBadge icon={DollarSign} />
              <h4 className='font-medium text-2xl'>Course price</h4>
            </div>
            <PriceForm 
              initialData={course}
              courseId={course.id}
            />
            <div className='flex items-center gap-x-3'>
              <IconBadge icon={File} />
              <h4 className='font-medium text-2xl'>Recources & Attachments</h4>
            </div>
            <AttachmentForm 
              initialData={course}
              courseId={course.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;