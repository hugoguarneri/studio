
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
      
      const keywords = ['FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT', 'JOIN', 'ON', 'AND', 'OR', 'SELECT'];
      keywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
          formatted = formatted.replace(regex, `\n${keyword.toUpperCase()}`);
      });
      
      // Handle parentheses
      formatted = formatted.replace(/\(/g, ' ( ');
      formatted = formatted.replace(/\)/g, ' ) ');
      formatted = formatted.replace(/\s+/g, ' '); // Clean up extra spaces again

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
      
      finalResult = finalResult.replace(/\(\s*\n/g, '(\n');
      finalResult = finalResult.replace(/\n\s*\)/g, '\n)');
      
      // Post-processing to fix common issues
      let resultWithParens = '';
      indentLevel = 0;
      finalResult.split('\n').forEach(line => {
          let trimmedLine = line.trim();
          if (trimmedLine.startsWith(')')) {
              indentLevel = Math.max(0, indentLevel - 1);
          }
          
          let lineToAdd = '  '.repeat(indentLevel) + trimmedLine;
          
          // Don't add newline for the very first line if it's SELECT
          if (resultWithParens === '' && trimmedLine.startsWith('SELECT')) {
            resultWithParens += lineToAdd;
          } else {
            resultWithParens += '\n' + lineToAdd;
          }

          if (trimmedLine.endsWith('(')) {
              indentLevel++;
          }
      });
      
      // Final cleanup
      resultWithParens = resultWithParens
        .replace(/\n\s*\n/g, '\n') // Remove double newlines
        .replace(/ \(/g, ' (\n')
        .replace(/\) /g, '\n) ')
        .replace(/\s+AND/g, '\n  AND')
        .replace(/\s+OR/g, '\n  OR')
        .replace(/\s*JOIN/g, '\nJOIN')
        .replace(/\s*WHERE/g, '\nWHERE')
        .replace(/\s*FROM/g, '\nFROM')
        .replace(/\s*ON/g, '\n  ON')
        .replace(/\s*SELECT/g, 'SELECT')
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
