
'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function NumberedTextarea() {
  const [value, setValue] = useState('SELECT * FROM users;');
  const [lineCount, setLineCount] = useState(1);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines);
  }, [value]);

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
        className="w-12 text-right p-4 text-muted-foreground select-none overflow-y-hidden bg-muted/30 font-code text-sm"
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
}
