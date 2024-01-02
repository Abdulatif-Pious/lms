"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BadgePlus, File, Trash, Loader2 } from 'lucide-react';
import * as z from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Course, Attachment } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file-upload';

const formSchema = z.object({
  url: z.string().min(1)
})

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string
}

export const AttachmentForm = ({
  initialData,
  courseId
} : AttachmentFormProps) => {

  const router = useRouter();

  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleAdding = () => setIsAdding((current) => !current);

  const onSubmit = async (value : z.infer <typeof formSchema> ) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, value);
      toggleAdding();
      router.refresh();
      toast.success("Attachment has beeen added");
    } catch {
      toast.error("Someting went wrong");
    }
  }

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);

      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      router.refresh();
      toast.success("Attachment has been deleted");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className='border rounded-md my-4 p-4 bg-sky-50'>
      <div className='flex items-center justify-between'>
        <p>Resources & Files</p>
        <Button
          onClick={toggleAdding}
          variant="outline"
        >
          {!isAdding ? (
            <>
              <BadgePlus className='w-4 h-4 mr-2'/>
              Add File
            </>
          ) : (
            "Cancel"
          )}
        </Button>
      </div>
      {!isAdding ? (
        !initialData.attachments.length ? (
          <p className='text-sm mt-2 text-slate-500 italic'>
            No attachment
          </p>
        ) : (
          <div className='mt-4'>
            {initialData.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="relative flex items-center  w-full  rounded-md text-sky-500 "
              >
                <File className='w-4 h-4 mr-2'/>
                <p className='line-clamp-1 hover:underline'>
                  {attachment.name}
                </p>
                {deletingId === attachment.id ? (
                  <div className='absolute w-full h-full flex items-center justify-center bg-sky-200'>
                  <Loader2  className='w-4 h-4 animate-spin' />
                </div>
                ) : (
                <button
                  className='ml-auto hover:opacity-75 transition'
                  onClick={() => onDelete(attachment.id)}
                >
                  <Trash className='w-4 h-4 ml-2'/>
                </button>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        <>
          <FileUpload 
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url })
              }
            } }
          />
          <p className='text-xs text-muted-foreground mt-2'>
            Add anything your students need to complete the course.
          </p>
        </>
      )}
    </div>
  );
};