import React from 'react';
import { Link } from 'react-router-dom';

export default function BreadcrumbNav({ items }: { items: Array<{label: string; href?: string}> }) {
  return (
    <nav className="flex text-sm text-slate-500 mb-6 whitespace-nowrap overflow-x-auto hide-scrollbar" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="inline-flex items-center">
              {index > 0 && <span className="mx-2 text-slate-400">/</span>}
              {item.href && !isLast ? (
                <Link to={item.href} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 truncate max-w-[150px] sm:max-w-none">
                  {item.label}
                </Link>
              ) : (
                <span className="text-sm font-medium text-slate-700 truncate max-w-[150px] sm:max-w-none">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
