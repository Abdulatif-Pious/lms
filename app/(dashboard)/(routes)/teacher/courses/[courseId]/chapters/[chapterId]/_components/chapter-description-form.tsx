"use client";

import { useState } from "react"
import { useRouter } from 'next/navigation';
import * as z  from "zod";
import { zodResolver }  from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { Edit } from 'lucide-react';
import { Chapter } from "@prisma/client"

import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField
}  from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Editor } from '@/components/editor';
import { Preview } from '@/components/preview';
import { cn } from '@/lib/utils';



const formSchema = z.object({
  description: z.string().min(1, {
    message: "Descpription is required"
  })
});

interface ChapterDescriptionFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string; 
}

export const ChapterDescriptionForm = ({
  initialData,
  courseId,
  chapterId
} : ChapterDescriptionFormProps) => {
  
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false); 

  const toggleEditing = () => setIsEditing((current) => !current);

  const form = useForm<z.infer <typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || ""
    }
  });

  const { isValid, isSubmitting }  = form.formState;

  const onSubmit = async (value : z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, value);
      router.refresh();
      toast.success("Description has beeen updated");
      toggleEditing();
    } catch {
      toast.error("someting went wrong")
    }
  }

  return (
    <div className="border rounded-md bg-sky-50 p-4 my-4">
      <div className="flex items-center justify-between ">
        <p>Chapter title</p>
        <Button onClick={toggleEditing} variant="outline">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2"/>
              Edit description
            </> 
          )}
        </Button>
      </div>
    
        {!isEditing ? (
          <div className={cn(
            "text-sm mt-2",
            !initialData.description && "text-slate-500 italic"
          )}>
            {initialData.description ? (
              <Preview 
                value={initialData.description}
              />
            ) : (
              "no description"
            )}
          </div>
        ) : ( 
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField 
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor 
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              > 
                {isSubmitting ? "processing..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  ); 
};