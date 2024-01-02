"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modals/confirm-modal';


interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

export const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished
} : ChapterActionsProps) => {

  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true)
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
      } else {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
      }
      router.refresh();
      toast.success(`Chapter has been ${isPublished ? "unpublished" : "published"}`);

    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      
      router.push(`/teacher/courses/${courseId}`);
      toast.success("Chapter has been deleted");
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsMounted(true)
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className='flex items-cetner gap-x-2'>
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
      >
        {isPublished ?  isLoading ? "processing..." : "Unpublish" : isLoading ? "processing..." : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete} >
        <Button disabled={isLoading}>
          <Trash className='w-4 h-4' />
        </Button>
      </ConfirmModal>
    </div>
  );
};
