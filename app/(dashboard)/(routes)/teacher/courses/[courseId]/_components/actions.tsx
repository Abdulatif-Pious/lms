"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { useConfettiStore } from '@/hooks/use-confetti-store';


interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const Actions = ({
  disabled,
  courseId,
  isPublished
} : ActionsProps) => {

  const router = useRouter();
  const confetti = useConfettiStore();

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true)
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        confetti.onOpen();
      }
      router.refresh();
      toast.success(`Course has been ${isPublished ? "unpublished" : "published"}`);

    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}`);
      
      router.push(`/teacher/courses`);
      toast.success("Course has been deleted");
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
