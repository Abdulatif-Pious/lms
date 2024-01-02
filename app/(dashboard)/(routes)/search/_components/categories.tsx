"use client";

import { Category } from '@prisma/client';
import { IconType } from 'react-icons';
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode 
} from "react-icons/fc"

import { CategoryItem } from './category-item';

interface CategoriesProps {
  items: Category[];
};

const iconMap : Record<Category["name"], IconType> = {
  "Computer science": FcMultipleDevices,
  "Music":            FcMusic,
  "Fitness":          FcSportsMode,
  "Photography":      FcOldTimeCamera,
  "Accounting":       FcSalesPerformance,
  "Engineering":      FcEngineering,
  "Filming":          FcFilmReel 
};

export const Categories = ({
  items
} : CategoriesProps) => {


  return (
    <div className='flex items-center gap-x-2 overflow-x-auto '>
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          value={item.id}
          label={item.name}
          icon={iconMap[item.name]}
        />
      ))}
    </div>
  )
}