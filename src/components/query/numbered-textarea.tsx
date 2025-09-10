
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
      // In a real app, you'd use a proper SQL formatting library like sql-formatter.
      // This is a simplified version to demonstrate the concept.
      const keywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT', 'JOIN', 'ON', 'INSERT', 'UPDATE', 'DELETE', 'AND', 'OR'];
      let formatted = value.replace(/\s+/g, ' ').trim();

      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, ` ${keyword.toUpperCase()} `);
      });
      
      // Add newlines for better readability
      formatted = formatted.replace(/ FROM /g, '\nFROM ')
                           .replace(/ JOIN /g, '\nJOIN ')
                           .replace(/ ON /g, '\n  ON ')
                           .replace(/ GROUP BY /g, '\nGROUP BY ')
                           .replace(/ ORDER BY /g, '\nORDER BY ');

      // Handle WHERE clause with multiple AND/OR
      const whereIndex = formatted.toUpperCase().indexOf('WHERE ');
      if (whereIndex > -1) {
        const whereClause = formatted.substring(whereIndex + 6);
        const conditions = whereClause.split(/\s+(AND|OR)\s+/i);
        
        // This is a simplification. A real implementation would need a proper parser.
        if (conditions.length > 2) {
          let newWhereClause = 'WHERE ';
          let andOrStack = [''];
          
          let i = 0;
          while(i < conditions.length) {
            let condition = conditions[i].trim();
            const nextOperator = (conditions[i+1] || '').toUpperCase();

            // Handle parentheses
            let openParen = 0;
            if (condition.startsWith('(')) {
                let temp = condition;
                while(temp.startsWith('(')) {
                    openParen++;
                    temp = temp.substring(1).trim();
                }
            }
             
            let closeParen = 0;
            if (condition.endsWith(')')) {
                let temp = condition;
                while(temp.endsWith(')')) {
                    closeParen++;
                    temp = temp.substring(0, temp.length - 1).trim();
                }
            }
            
            if (i === 0) {
              newWhereClause += condition;
            } else {
              const indent = '    '.repeat(openParen + 1);
              newWhereClause += `\n${indent}${andOrStack.pop()} ${condition}`;
            }

            if (nextOperator === 'AND' || nextOperator === 'OR') {
              andOrStack.push(nextOperator);
              i += 2;
            } else {
              i += 1;
            }
          }
          
          const baseQuery = formatted.substring(0, whereIndex);
          formatted = `${baseQuery}\n${newWhereClause}`;
        } else {
          formatted = formatted.replace(/ WHERE /g, '\nWHERE ');
        }
      }

      // Cleanup extra spaces
      formatted = formatted.replace(/\s+/g, ' ').replace(/\s+\n/g, '\n').replace(/\n\s+/g, '\n').trim();
      formatted = formatted.replace(/ \n/g, '\n');
      
      const lines = formatted.split('\n');
      const indentedLines = lines.map((line, index) => {
        line = line.trim();
        if (index > 0 && !line.startsWith('(') && (
            line.toUpperCase().startsWith('FROM') ||
            line.toUpperCase().startsWith('WHERE') ||
            line.toUpperCase().startsWith('GROUP BY') ||
            line.toUpperCase().startsWith('ORDER BY') ||
            line.toUpperCase().startsWith('JOIN')
        )) {
            return line;
        }
        if (index > 0) {
            return '  ' + line;
        }
        return line;
      });

      setValue(indentedLines.join('\n'));
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
