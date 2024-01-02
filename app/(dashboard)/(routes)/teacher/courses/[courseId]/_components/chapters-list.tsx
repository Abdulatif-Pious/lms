"use client"

import { useState, useEffect } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { Chapter } from '@prisma/client';
import { Edit, Grip } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';


interface ChaptersListProps {
  onEdit: (id: string) => void;
  onReorder: (updateData: { id: string; position: number }[]) => void;
  items: Chapter[];
}

export const ChaptersList = ({
  onEdit,
  onReorder,
  items,
} : ChaptersListProps) => {
  
  const [chapters, setChapters] = useState(items);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [ reorderedItem ] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const startIndex = Math.min(result.destination.index, result.source.index);
    const endIndex = Math.max(result.destination.index, result.source.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);
    
    setChapters(items);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id)
    }));

    onReorder(bulkUpdateData);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div 
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {chapters.map((chapter, index) => (
              <Draggable 
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex items-center gap-x-2 pr-2 text-slate-700 bg-slate-200 border border-slate-200 mb-4 text-sm rounded-md ",
                      chapter.isPublished && "text-sky-700 bg-sky-200 border-sky-200"
                      )}
                  >
                    <div 
                      {...provided.dragHandleProps}
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-300 rounded-l-md transition hover:bg-slate-300",
                        chapter.isPublished && "border-r-sky-200 bg-sky-200 hover:bg-sky-100 transition"
                      )}
                    >
                      <Grip 
                        className='w-5 h-5'
                      />
                    </div>
                    {chapter.title}
                    <div className='ml-auto flex items-center gap-x-2'>
                      {chapter.isFree && (
                        <Badge> 
                          Free
                        </Badge>
                      )}
                      <Badge className={cn("bg-slate-500", chapter.isPublished && "bg-sky-500")}>
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>
                      
                      <Button
                        onClick={() => onEdit(chapter.id) }
                        variant="outline"
                        size="sm"
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                      
                    </div>
                  </div> 
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};