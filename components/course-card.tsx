import Image from 'next/image';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

import { IconBadge } from '@/components/icon-badge';
import { formatPrice } from '@/lib/format';
import { CourseProgress } from '@/components/course-progress';


interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chapterLength: number;
  price: number;
  category: string;
  progress: number;
};

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chapterLength,
  price,
  category,
  progress,
} : CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className='group h-full border rounded-md p-3 overflow-hidden hover:shadow transition'>
        <div className='relative aspect-video w-full rounded-md overflow-hidden'>
          <Image 
            fill
            className='object-cover'
            alt={title}
            src={imageUrl}
          />
        </div>
        <div className='flex flex-col mt-2'>
          <div className='text-lg md:text-base font-medium line-clamp-2 group-hover:text-sky-500 transition'>
            {title}
          </div>
          <p className='text-xs text-muted-foreground italic'>{category}</p>
        </div>
        <div className='flex items-center gap-x-2 my-3 text-sm text-slate-500'>
          <IconBadge size="sm" icon={BookOpen}/>
          <span>
            {chapterLength} { chapterLength > 1 ? "Chapters" : "Chapter" }
          </span>
        </div>
          {progress === null ? (
            <p className='text-lg md:text-base font-medium text-slate-700'>{formatPrice(price)}</p>
          ) : (
            <CourseProgress 
              variant={progress === 100 ? "success" : "default"}
              value={progress}
            />
          )}
      </div>
    </Link>
  )
}