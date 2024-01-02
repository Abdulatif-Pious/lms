"use client"

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from  'react-hot-toast';
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { Course } from '@prisma/client';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
}  from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

const formSchema = z.object({
  price: z.coerce.number(),
})


interface PriceFormProps {
  initialData : Course
  courseId: string
}

export const PriceForm = ({
  initialData,
  courseId
}: PriceFormProps) => {
  
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false); 

  const toggleEditing = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined
    }
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value : z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, value);
      router.refresh();
      toast.success("The price has beeen updated");
      toggleEditing();
    } catch {
      toast.error("someting went wrong")
    }
  }

  return (
    <div className="border rounded-md bg-sky-50 p-4 my-4">
      <div className="flex items-center justify-between ">
        <p>Course price</p>
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
          <p className={cn("text-sm mt-2", !initialData.price && "text-slate-500 italic")}>{initialData.price ? formatPrice(initialData.price) : "No price"}</p>
        ) : ( 
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField 
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.01"
                      placeholder="set price"
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


