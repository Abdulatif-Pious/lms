"use client" ;

import { useState } from 'react';
import  { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import MuxPlayer from '@mux/mux-player-react';
import { Loader, Lock } from 'lucide-react';

import { useConfettiStore } from '@/hooks/use-confetti-store';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  title: string;
  playbackId: string;
  courseId: string;
  chapterId: string;
  nextChapterId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}

export const VideoPlayer = ({
  title,
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
} : VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false); 

  const confetti = useConfettiStore();
  const router = useRouter();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          IsComplete: true
        });
        
        router.refresh();
        toast.success("Progress has been updated");

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        } else {
          confetti.onOpen();
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className='relative aspect-video'>
      {!isReady && !isLocked && (
        <div className='absolute inset-0 flex items-center justify-center bg-slate-500 '>
          <Loader className='w-10 h-10 animate-spin'/>
        </div>
      )}
      {isLocked ? (
        <div className='absolute inset-0 flex items-center justify-center flex-col gap-y-2 bg-slate-500 '>
          <Lock className='w-10 h-10'/>
          <p className='text-sm text-slate-200'>Course is locked</p>
        </div>
      ) : (
        <MuxPlayer 
          className={cn(!isReady && "hidden")}
          title={title}
          playbackId={playbackId}
          onEnded={onEnd}
          onCanPlay={() => setIsReady(true)}
        />
      )}
    </div>
  )
} 