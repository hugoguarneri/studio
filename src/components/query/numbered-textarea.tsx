
'use client';

import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { cn } from '@/lib/utils';

const NumberedTextarea = forwardRef((props, ref) => {
  const [value, setValue] = useState('SELECT * FROM users u JOIN orders o on u.id = o.user_id where u.id = 1 and (u.name = \'test\' or u.email = \'test@test.com\') and u.id > 100;');
  const [lineCount, setLineCount] = useState(1);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines);
  }, [value]);

  useImperativeHandle(ref, () => ({
    formatQuery: () => {
      // A more robust regex-based formatting approach.
      let formatted = value.replace(/\s+/g, ' ').trim();

      // Uppercase major keywords
      const keywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT', 'JOIN', 'ON', 'INSERT', 'UPDATE', 'DELETE', 'AND', 'OR'];
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, keyword.toUpperCase());
      });

      // Add newlines before major clauses
      formatted = formatted
        .replace(/\s*FROM\s*/g, '\nFROM ')
        .replace(/\s*JOIN\s*/g, '\nJOIN ')
        .replace(/\s*WHERE\s*/g, '\nWHERE ')
        .replace(/\s*GROUP BY\s*/g, '\nGROUP BY ')
        .replace(/\s*ORDER BY\s*/g, '\nORDER BY ')
        .replace(/\s*LIMIT\s*/g, '\nLIMIT ');
        
      // Handle WHERE clause conditions
      formatted = formatted
        .replace(/\s*AND\s*/g, '\n  AND ')
        .replace(/\s*OR\s*/g, '\n  OR ');
      
      // Handle JOIN ON conditions
      formatted = formatted
        .replace(/\s*ON\s*/g, '\n  ON ');

      // Indent subqueries in parentheses on new lines
      formatted = formatted
        .replace(/\(\s*/g, '(\n  ')
        .replace(/\s*\)/g, '\n)');

      // Cleanup multiple newlines
      formatted = formatted.replace(/\n\s*\n/g, '\n');

      setValue(formatted.trim());
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
