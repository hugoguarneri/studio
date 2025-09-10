'use client';

import { cn } from '@/lib/utils';
import { Table2, Type } from 'lucide-react';

export type Suggestion = {
  name: string;
  type: 'table' | 'column';
};

interface QuerySuggestionsProps {
  suggestions: Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
  position: { top: number; left: number };
}

export default function QuerySuggestions({
  suggestions,
  onSelect,
  position,
}: QuerySuggestionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div
      className="absolute z-10 w-64 rounded-md border bg-popover text-popover-foreground shadow-md"
      style={{ top: position.top, left: position.left }}
    >
      <ul className="p-1">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion.type === 'table' ? (
              <Table2 className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Type className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="font-code">{suggestion.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
