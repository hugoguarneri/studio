
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
      let formatted = value.replace(/\s+/g, ' ').trim();
      
      const keywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT', 'JOIN', 'ON', 'INSERT', 'UPDATE', 'DELETE'];
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, `\n${keyword.toUpperCase()}`);
      });
      
      let indentLevel = 0;
      let result = '';
      const lines = formatted.split('\n');

      lines.forEach(line => {
        if (!line.trim()) return;
        
        let trimmedLine = line.trim();
        const indent = '  '.repeat(indentLevel);
        
        if (trimmedLine.includes(')')) {
            indentLevel = Math.max(0, indentLevel - trimmedLine.match(/\)/g)!.length);
        }

        result += '  '.repeat(indentLevel) + trimmedLine + '\n';
        
        if (trimmedLine.includes('(')) {
            indentLevel += trimmedLine.match(/\(/g)!.length;
        }
      });

      result = result
        .replace(/\s+AND\s+/gi, '\n  AND ')
        .replace(/\s+OR\s+/gi, '\n  OR ')
        .replace(/\s+ON\s+/gi, '\n  ON ')
        .replace(/\(\s*/g, '(\n')
        .replace(/\s*\)/g, '\n)');
        
      let finalResult = '';
      let currentIndent = 0;
      const resultLines = result.split('\n');

      resultLines.forEach(line => {
        if (!line.trim()) return;
        let trimmedLine = line.trim();
        
        if (trimmedLine.startsWith(')')) {
          currentIndent = Math.max(0, currentIndent - 1);
        }

        finalResult += '  '.repeat(currentIndent) + trimmedLine + '\n';

        if (trimmedLine.endsWith('(')) {
          currentIndent++;
        }
      });


      // Cleanup multiple newlines and trailing/leading spaces
      finalResult = finalResult.replace(/\n\s*\n/g, '\n').trim();
      
      setValue(finalResult);
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
