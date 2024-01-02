"use client";

import { useState,  } from "react";
import { useRouter } from "next/navigation";
import * as z from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Chapter, MuxData } from '@prisma/client';
import { Edit, Video  } from 'lucide-react';
import MuxPlayer from "@mux/mux-player-react";

import { Button } from '@/components/ui/button';
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  videoUrl: z.string().min(1, {
    message: "Video is required"
  })
});

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
};

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId
} : ChapterVideoFormProps) => {

  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  const toggleEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (value : z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, value);
      router.refresh();
      toast.success("Video has beeen updated");
      toggleEditing();
    } catch {
      toast.error("someting went wrong")
    }
  }


  return (
    <div className="border rounded-md bg-sky-50 p-4 my-4">
      <div className="flex items-center justify-between">
        <p>Chapter video</p>
        <Button onClick={toggleEditing} variant="outline">
          {isEditing ? (
            <p>Cancel</p>
          ) :  initialData?.videoUrl ? (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit Video
            </>
            ) : (
            <>
              <Video className="w-4 h-4 mr-2" />
              Add an video
            </>
          )}
        </Button>
          
      </div>

      {!isEditing ? (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60  mt-2 rounded-md">
            <Video className="w-10 h-10 text-sky-500" />
          </div>
        ) : (
        <div className="relative aspect-video  mt-2">
          <MuxPlayer
            playbackId={initialData?.muxData?.playbackId || ""}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Videos can take a few minutes to process. Refresh the page if video does not appear.
          </p>
        </div>
        
        )) : (
        <div>
          <FileUpload 
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url })
              }
            }}
          />
          <p className="text-sm text-muted-foreground mt-4">upload a video to your chapter</p>
        </div>
      )}
    </div>
  )
}
