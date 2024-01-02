"use client"

import { useState, useEffect } from "react";
import  Link  from 'next/link'

import { 
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { BadgePlus } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface TableDataProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[] 
}

export function DataTable<TData, TValue> ({
  columns,
  data
}: TableDataProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isMounting, setIsMounting] = useState(false);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters
    }
  });

  useEffect(() => {
    setIsMounting(true);
  }, []);

  if (!isMounting) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-3 justify-between my-6">
        <Input 
          className="max-w-xs" 
          placeholder="Filter courses by title ..."
          value={(table.getColumn("title")?.getFilterValue()) as string }  
          onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value) }
        />

        <Link href="/teacher/create">
          <Button className="">
            <BadgePlus className="mr-2 w-4 h-4"/>
            New Course
          </Button>
        </Link>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                        )
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.slice(0, 10)
                .map(row => {
                  return (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map(cell => {
                        return (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No result  
                </TableCell> 
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end items-center gap-3 my-4">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant='outline'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

