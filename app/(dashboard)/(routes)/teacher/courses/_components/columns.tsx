"use client"

import  Link  from "next/link";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem, } from "@/components/ui/dropdown-menu";

import { Course } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, MoreHorizontal  } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          title
          <ArrowUpDown className="ml-2 w-4 h-4"/>
        </Button>
      );
    }
  },

  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          price
          <ArrowUpDown className="ml-2 w-4 h-4"/>
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") ||"0")
      const formattedPrice = formatPrice(price)
      return (
        <div>{formattedPrice}</div>
      )
    }
  },

  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Published
          <ArrowUpDown className="ml-2 w-4 h-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") || false;

      return (
        <Badge 
          className={cn(
            "bg-slate-400",
            isPublished && "bg-blue-400"
          )}
        >
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    }
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              className="p-3"
            >
              <MoreHorizontal />
              </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href={`/teacher/courses/${id}`} className='flex gap-x-2 w-full h-full'>
                <Edit />
                Edit 
              </Link> 
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>  
      );
    }
  }

];
