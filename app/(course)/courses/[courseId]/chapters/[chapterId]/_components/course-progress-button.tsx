"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CircleSlash2, CheckCheck  } from 'lucide-react';

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { Button } from '@/components/ui/button';

interface CourseProgressButtonProps {
  courseId: string;
  chapterId: string;
  isCompleted: boolean;
  nextChapterId: string;
}

export const CourseProgressButton = ({
  courseId,
  chapterId,
  isCompleted,
  nextChapterId,
} : CourseProgressButtonProps) => {
  const [isLoading, setIsloading] = useState(false);

  const router = useRouter();
  const confetti = useConfettiStore();

  const Icon = isCompleted ? CircleSlash2 : CheckCheck;

  const onClick = async () => {
    try {
      setIsloading(true);

      const { data } =   await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
        isCompleted: !isCompleted
      });

      router.refresh();
      toast.success("Progress has been updated");
      
      if (data.isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if (data.isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

    } catch  {
      toast.error("Something went wrong");
    } finally {
      setIsloading(false);
    }
  }
  
  return (
      <Button
        onClick={onClick}
        variant={isCompleted  ? "success" : "outline"}
        disabled={isLoading}
      >
        {isLoading ? (
          <p>processing...</p>
        ) : (
          <>
            <p>{isCompleted ? "Mark as not completed" : "Mark as completed"}</p>
            <Icon className='w-4 h-4 ml-2' />
          </>
        )}
      </Button>
    );
};