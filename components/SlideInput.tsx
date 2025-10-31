
import React from 'react';
import type { Slide } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface SlideInputProps {
  slide: Slide;
  index: number;
  onSlideChange: (id: string, field: keyof Omit<Slide, 'id'>, value: string) => void;
  onRemoveSlide: (id:string) => void;
}

export const SlideInput: React.FC<SlideInputProps> = ({ slide, index, onSlideChange, onRemoveSlide }) => {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3 relative bg-gray-50 dark:bg-gray-900/50">
      <div className="flex justify-between items-center">
        <label className="block text-md font-semibold text-gray-700 dark:text-gray-300">Slide {index + 1}</label>
        <button onClick={() => onRemoveSlide(slide.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
      <input
        type="text"
        placeholder="Slide Title (e.g., Our Services)"
        value={slide.title}
        onChange={(e) => onSlideChange(slide.id, 'title', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Slide content. You can use bullet points."
        value={slide.text}
        onChange={(e) => onSlideChange(slide.id, 'text', e.target.value)}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Image Description (for AI generation)"
        value={slide.image_description}
        onChange={(e) => onSlideChange(slide.id, 'image_description', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};
