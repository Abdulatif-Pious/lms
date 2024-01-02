"use client"

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from  'react-hot-toast';
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
}  from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "title is required"
  }),
})


interface ChapterTitleFormProps {
  initialData : {
    title: string
  };
  courseId: string;
  chapterId: string;
}

export const ChapterTitleForm = ({
  initialData,
  courseId,
  chapterId
}: ChapterTitleFormProps) => {
  
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false); 

  const toggleEditing = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value : z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, value);
      router.refresh();
      toast.success("Title has beeen updated");
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
              Edit title
            </> 
          )}
        </Button>
      </div>
      
        {!isEditing ? (
          <p>{initialData.title}</p>
        ) : ( 
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField 
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="e.g intro to web"
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


