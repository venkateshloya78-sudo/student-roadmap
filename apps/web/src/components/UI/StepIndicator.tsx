import React from 'react';
import { Check } from 'lucide-react';
import clsx from 'clsx';

interface StepIndicatorProps {
  steps: string[];
  current: number; // 0-indexed
}

export const StepIndicator = ({ steps, current }: StepIndicatorProps) => (
  <div className="flex items-start w-full mb-8 overflow-x-auto pb-2">
    {steps.map((label, i) => (
      <React.Fragment key={label}>
        <div className="flex flex-col items-center min-w-0 flex-shrink-0">
          <div
            className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-200',
              i < current
                ? 'bg-brand-600 border-brand-600 text-white'
                : i === current
                ? 'bg-white border-brand-600 text-brand-600 shadow-sm shadow-brand-100'
                : 'bg-white border-gray-200 text-gray-400'
            )}
          >
            {i < current ? <Check className="w-4 h-4" /> : <span>{i + 1}</span>}
          </div>
          <span
            className={clsx(
              'text-[10px] mt-1 hidden sm:block text-center leading-tight px-1 max-w-[56px]',
              i === current ? 'text-brand-600 font-medium' : 'text-gray-400'
            )}
          >
            {label}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div
            className={clsx(
              'flex-1 h-0.5 mx-1 mt-4 rounded-full transition-colors duration-200',
              i < current ? 'bg-brand-600' : 'bg-gray-200'
            )}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);
