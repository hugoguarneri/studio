
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
      
      const keywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT', 'JOIN', 'ON', 'INSERT', 'UPDATE', 'DELETE', 'AND', 'OR'];
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        if (keyword === 'AND' || keyword === 'OR') {
          // Add extra indentation for AND/OR within WHERE
          formatted = formatted.replace(regex, `\n  ${keyword.toUpperCase()}`);
        } else {
          formatted = formatted.replace(regex, `\n${keyword.toUpperCase()}`);
        }
      });
        
      let finalResult = '';
      let indentLevel = 0;
      const lines = formatted.split('\n');

      lines.forEach((line) => {
        if (!line.trim()) return;

        let trimmedLine = line.trim();

        if (trimmedLine.startsWith(')')) {
            indentLevel = Math.max(0, indentLevel - 1);
        }
        
        finalResult += '  '.repeat(indentLevel) + trimmedLine + '\n';

        if (trimmedLine.endsWith('(')) {
            indentLevel++;
        }
      });


      // Cleanup multiple newlines and trailing/leading spaces
      finalResult = finalResult.replace(/\n\s*\n/g, '\n').trim();
      
      // Handle parentheses specifically for block-like structure
      let resultWithParens = '';
      indentLevel = 0;
      finalResult.split('\n').forEach(line => {
          let trimmedLine = line.trim();
          if (trimmedLine.endsWith(')')) {
              indentLevel = Math.max(0, indentLevel - 1);
              resultWithParens += '  '.repeat(indentLevel) + trimmedLine + '\n';
          } else if (trimmedLine.endsWith('(')) {
              resultWithParens += '  '.repeat(indentLevel) + trimmedLine + '\n';
              indentLevel++;
          } else {
              resultWithParens += '  '.repeat(indentLevel) + trimmedLine + '\n';
          }
      });
      
      // A final pass to fix common issues
      resultWithParens = resultWithParens
        .replace(/\(\s*\n/g, '(\n')
        .replace(/\n\s*\)/g, '\n)')
        .replace(/\s+AND/g, '\n  AND')
        .replace(/\s+OR/g, '\n  OR')
        .replace(/JOIN/g, '\nJOIN')
        .replace(/WHERE/g, '\nWHERE')
        .replace(/FROM/g, '\nFROM')
        .trim();

      setValue(resultWithParens);
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const { current: textarea } = textareaRef;
      if (textarea) {
        const { selectionStart, selectionEnd } = textarea;
        const newValue = 
          value.substring(0, selectionStart) + 
          '  ' + 
          value.substring(selectionEnd);
        
        setValue(newValue);

        // We need to wait for the state to update before setting the cursor position
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
        }, 0);
      }
    }
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
        onKeyDown={handleKeyDown}
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
