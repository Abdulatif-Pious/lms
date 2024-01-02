"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import * as z from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Course } from '@prisma/client';
import { Edit, ImagePlus  } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required"
  })
});

interface ImageFormProps {
  initialData: Course
  courseId: string
};

export const ImageForm = ({
  initialData,
  courseId
} : ImageFormProps) => {

  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  const toggleEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (value : z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, value);
      router.refresh();
      toast.success("The image has beeen updated");
      toggleEditing();
    } catch {
      toast.error("someting went wrong")
    }
  }


  return (
    <div className="border rounded-md bg-sky-50 p-4 my-4">
      <div className="flex items-center justify-between">
        <p>Course Image</p>
        <Button onClick={toggleEditing} variant="outline">
          {isEditing ? (
            <p>Cancel</p>
          ) :  initialData?.imageUrl ? (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit image
            </>
            ) : (
            <>
              <ImagePlus className="w-4 h-4 mr-2" />
              Add an image
            </>
          )}
        </Button>
          
      </div>

      {!isEditing ? (
        !initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60  mt-2 rounded-md">
            <ImagePlus className="w-10 h-10 text-sky-500" />
          </div>
        ) : (
        <div className="relative aspect-video  mt-2">
          <Image 
            alt="upload"
            fill
            className="object-cover rounded-md"
            src={initialData.imageUrl}
          />
        </div>
        
        )) : (
        <div>
          <FileUpload 
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url })
              }
            }}
          />
          <p className="text-sm text-muted-foreground mt-4"> 16:9 aspect ratio recommended</p>
        </div>
      )}
    </div>
  )
}
