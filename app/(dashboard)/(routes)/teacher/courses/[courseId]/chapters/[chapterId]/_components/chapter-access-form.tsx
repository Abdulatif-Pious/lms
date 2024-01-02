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
  FormField,
  FormDescription
}  from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";



const formSchema = z.object({
  isFree: z.boolean().default(false)
});

interface ChapterAccessFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string; 
}

export const ChapterAccessForm = ({
  initialData,
  courseId,
  chapterId
} : ChapterAccessFormProps) => {
  
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false); 

  const toggleEditing = () => setIsEditing((current) => !current);

  const form = useForm<z.infer <typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: !!initialData.isFree
    }
  });

  const { isValid, isSubmitting }  = form.formState;

  const onSubmit = async (value : z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, value);
      router.refresh();
      toast.success("Access has beeen updated");
      toggleEditing();
    } catch {
      toast.error("someting went wrong")
    }
  }

  return (
    <div className="border rounded-md bg-sky-50 p-4 my-4">
      <div className="flex items-center justify-between ">
        <p>Access setting</p>
        <Button onClick={toggleEditing} variant="outline">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2"/>
              Edit access
            </> 
          )}
        </Button>
      </div>
    
        {!isEditing ? (
          <p className="mt-4">{initialData.isFree ? (
            "This chapter is free for preview."
          ) : (
            "This chapter isn't free."
          )}</p>
        ) : ( 
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField 
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 border rounded-md p-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Check this box if you want to make this chapter free for preview
                  </FormDescription>
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