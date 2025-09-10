
'use client';

import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { cn } from '@/lib/utils';

const NumberedTextarea = forwardRef((props, ref) => {
  const [value, setValue] = useState('SELECT * FROM users;');
  const [lineCount, setLineCount] = useState(1);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines);
  }, [value]);

  useImperativeHandle(ref, () => ({
    formatQuery: () => {
      // Basic formatter: uppercase keywords and fix spacing.
      // In a real app, you'd use a proper SQL formatting library.
      const keywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT', 'JOIN', 'ON', 'INSERT', 'UPDATE', 'DELETE'];
      let formatted = value.replace(/\s+/g, ' ').trim();
      
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, keyword.toUpperCase());
      });

      // Add newlines for better readability
      formatted = formatted.replace(/ FROM /g, '\nFROM ')
                           .replace(/ WHERE /g, '\nWHERE ')
                           .replace(/ GROUP BY /g, '\nGROUP BY ')
                           .replace(/ ORDER BY /g, '\nORDER BY ');

      setValue(formatted);
    }
  }));

  const handleTextareaScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };
  
  const handleValueChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  }

  return (
    <div className="flex flex-1 border bg-background overflow-hidden relative rounded-md">
      <div 
        ref={lineNumbersRef} 
        className="w-12 text-right p-4 text-muted-foreground select-none overflow-y-hidden bg-muted/30 font-code text-sm leading-normal"
        aria-hidden="true"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleValueChange}
        onScroll={handleTextareaScroll}
        className={cn(
          'flex-1 resize-none bg-transparent p-4 font-code text-sm leading-normal ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          'border-none focus:ring-0'
        )}
        placeholder="SELECT * FROM users;"
        wrap="off"
        spellCheck="false"
      />
    </div>
  );
});

NumberedTextarea.displayName = "NumberedTextarea";

export default NumberedTextarea;
