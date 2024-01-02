"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Course } from '@prisma/client';
import { Edit } from 'lucide-react';

import { Form, FormItem, FormControl, FormField } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  categoryId : z.string().min(1)
});


interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[]
}

export const  CategoryForm = ({
  initialData,
  courseId,
  options
} : CategoryFormProps) => {

  const router = useRouter();

  const [isEditing, setIsditing] = useState(false);

  const toggleEditing = () => setIsditing((isEditing) => !isEditing);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "" 
    }
  });

  const { isSubmitting, isValid } = form.formState;

  const submit = async (value: z.infer <typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, value);
      toggleEditing();
      router.refresh();
      toast.success("Categroy has been updated");
      
    } catch {
      toast.error("Something went wrong")
    }
  } 

  const selectedOption = options.find((option: any) => option.value === initialData?.categoryId)

  return (
    <div className='border p-4 rounded-md bg-sky-50 my-4'>
      <div className='flex items-center justify-between'>
        <p>Category</p>
        <Button
          onClick={toggleEditing}
          variant="outline"
        >
          {!isEditing ? (
            <>
              <Edit className='w-4 h-4 mr-2'/>
              Edit
            </>
            
            ) : (
            "Cancel"
          )}
        </Button>
      </div>

      {!isEditing ? (
        <p
          className={cn("text-sm mt-2", !initialData?.categoryId && "text-slate-500 italic")}
        >
          {selectedOption?.label || "no category"}
        </p>
      ) : (
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(submit)}
            className="mt-4 space-y-4"
          >
            <FormField 
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={...options}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
              <Button
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? "processing..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )

}

