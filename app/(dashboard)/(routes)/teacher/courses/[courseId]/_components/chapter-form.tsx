"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {  useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Course, Chapter } from "@prisma/client";
import { Loader, BadgePlus  } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormItem, FormControl, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChaptersList } from './chapters-list';


const formSchema = z.object({
  title: z.string().min(1)
});

interface ChapterFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string
};

export const ChapterForm = ({
  initialData,
  courseId
} : ChapterFormProps) => {
  
  const router = useRouter();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const toggleCreating = () => setIsCreating((isCreating) => !isCreating);

  const form = useForm<z.infer <typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    }
  });

  const { isSubmitting, isValid } = form.formState;

  const submit = async (value: z.infer <typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, value);
      toggleCreating();
      router.refresh();
      toast.success("Chapter has been created");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData
      });
      router.refresh();
      toast.success("The chapter has been reordered");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }


  }

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`)
  };

  return (
    <div className='relative border rounded-md p-4 my-4 bg-sky-50'>
      {isUpdating && (
        <div className='absolute right-0 top-0 w-full h-full rounded-md bg-sky-200 flex items-center justify-center'>
          <Loader className='animate-spin w-10 h-10'/>
        </div>
      )}
      <div className='flex items-center justify-between'>
        <p>Course chapter</p>
        <Button
          variant="outline"
          onClick={toggleCreating}
        >
          {!isCreating ? (
            <>
              <BadgePlus className='w-4 h-4 mr-2'/>
              add a chapter
            </>
          ) : (
            "Cancel"
          )}
        </Button>
      </div>

      {!isCreating ? (
        <div 
          className={cn("text-sm mt-4", !initialData.chapters.length && "text-slate-500 italic")}
        >
          {!initialData.chapters.length && "no Chapter"}

          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="mt-4 space-y-4">
            <FormField 
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      disabled={isSubmitting}
                      placeholder="e.g Intro the course"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
              <Button disabled={isSubmitting || !isValid}>
                {isSubmitting ? "processing..." : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
} 