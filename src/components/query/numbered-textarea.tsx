
'use client';

import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';
import QuerySuggestions, { type Suggestion } from './query-suggestions';
import { schemaContent } from './database-schema-mock';
import { format } from 'sql-formatter';

const SQL_KEYWORDS = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', 'GROUP BY', 'ORDER BY', 
    'LIMIT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'TABLE', 'VIEW',
    'INDEX', 'ALTER', 'DROP', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN',
    'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'HAVING'
];

const NumberedTextarea = React.forwardRef((props, ref) => {
  const [value, setValue] = useState('SELECT * FROM users u JOIN orders o on u.id = o.user_id where u.id = 1 and (u.name = \'test\' or u.email = \'test@test.com\') and u.id > 100;');
  const [lineCount, setLineCount] = useState(1);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines);
  }, [value]);

  useImperativeHandle(ref, () => ({
    formatQuery: () => {
      try {
        const formattedQuery = format(value, {
            language: 'sql',
            tabWidth: 2,
            keywordCase: 'upper',
        });
        setValue(formattedQuery);
      } catch (error) {
        console.error("Failed to format SQL:", error);
      }
    }
  }));

  const handleTextareaScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };
  
  const handleValueChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setValue(text);
    updateSuggestions(text, event.target.selectionStart);
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

        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
        }, 0);
      }
    } else if (event.key === 'Escape') {
      setSuggestions([]);
    }
  }

  const getCursorCoordinates = (textarea: HTMLTextAreaElement) => {
    const { selectionStart } = textarea;
    const text = textarea.value.substring(0, selectionStart);
    
    // Create a temporary div to measure the text dimensions
    const div = document.createElement('div');
    const style = window.getComputedStyle(textarea);
    
    // Copy all relevant styles from the textarea to the div
    [
      'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 
      'lineHeight', 'textTransform', 'wordSpacing', 'paddingLeft', 'paddingTop',
      'borderLeftWidth', 'borderTopWidth'
    ].forEach(prop => {
      div.style[prop as any] = style[prop as any];
    });
    
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap'; // Use pre-wrap to respect newlines and spaces
    div.style.width = style.width;
    
    div.textContent = text;
    
    document.body.appendChild(div);

    // Create a span at the end of the text to get the coordinates
    const span = document.createElement('span');
    div.appendChild(span);

    const rect = textarea.getBoundingClientRect();
    const spanRect = span.getBoundingClientRect();
    
    document.body.removeChild(div);
    
    // Calculate position relative to the textarea
    const top = spanRect.top - rect.top + parseFloat(style.fontSize);
    const left = spanRect.left - rect.left;

    return { top, left };
  };

  const updateSuggestions = (text: string, cursorPosition: number) => {
      const textUntilCursor = text.substring(0, cursorPosition);
      const currentWordMatch = textUntilCursor.match(/(\b\w+)$/);
      const currentWord = currentWordMatch ? currentWordMatch[1].toLowerCase() : '';
      
      const tokens = textUntilCursor.toUpperCase().split(/[\s,()]+/);
      let lastToken = '';
      for (let i = tokens.length - 2; i >= 0; i--) {
          if (tokens[i]) {
              lastToken = tokens[i];
              break;
          }
      }

      let newSuggestions: Suggestion[] = [];

      if (lastToken === 'FROM' || lastToken === 'JOIN') {
          newSuggestions = schemaContent.map(t => ({ name: t.name, type: 'table' as const}));
      } else {
          const keywordSuggestions = SQL_KEYWORDS.map(kw => ({ name: kw, type: 'keyword' as const }));
          const tableSuggestions = schemaContent.map(t => ({ name: t.name, type: 'table' as const }));
          const allColumns = schemaContent.flatMap(t => t.columns.map(c => ({name: c.name, type: 'column' as const})));
          const uniqueColumns = Array.from(new Map(allColumns.map(item => [item.name, item])).values());

          newSuggestions = [...keywordSuggestions, ...tableSuggestions, ...uniqueColumns];
      }
      
      let filteredSuggestions = newSuggestions;
      if (currentWord) {
        filteredSuggestions = newSuggestions.filter(s => s.name.toLowerCase().startsWith(currentWord) && s.name.toLowerCase() !== currentWord);
      } else {
        filteredSuggestions = [];
      }
      
      const uniqueSuggestions = Array.from(new Map(filteredSuggestions.map(item => [item.name, item])).values());
      setSuggestions(uniqueSuggestions.slice(0, 10));

      if (textareaRef.current && uniqueSuggestions.length > 0) {
        const { top, left } = getCursorCoordinates(textareaRef.current);
        setSuggestionPosition({ top, left });
      }
  };
  
  const handleSuggestionSelect = (suggestion: Suggestion) => {
    const text = value;
    const cursor = textareaRef.current?.selectionStart || 0;
    
    const textUntilCursor = text.substring(0, cursor);
    const lastWordMatch = textUntilCursor.match(/(\b\w+)$/);
    
    let newText;
    let newCursorPos;

    if (lastWordMatch) {
      const startIndex = lastWordMatch.index || 0;
      newText = text.substring(0, startIndex) + suggestion.name + ' ' + text.substring(cursor);
      newCursorPos = startIndex + suggestion.name.length + 1;
    } else {
      newText = text.substring(0, cursor) + suggestion.name + ' ' + text.substring(cursor);
      newCursorPos = cursor + suggestion.name.length + 1;
    }

    setValue(newText);
    setSuggestions([]);
    
    setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };


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
        onClick={(e) => updateSuggestions(value, e.currentTarget.selectionStart)}
        onKeyUp={(e) => {
            if (e.key !== 'Escape' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Enter') {
                updateSuggestions(value, e.currentTarget.selectionStart)
            }
        }}
        className={cn(
          'flex-1 resize-none bg-transparent p-4 font-code text-sm leading-normal ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          'border-none focus:ring-0'
        )}
        placeholder="SELECT * FROM users;"
        wrap="off"
        spellCheck="false"
      />
      {suggestions.length > 0 && (
          <QuerySuggestions 
            suggestions={suggestions}
            onSelect={handleSuggestionSelect}
            position={suggestionPosition}
          />
      )}
    </div>
  );
});

NumberedTextarea.displayName = "NumberedTextarea";

export default NumberedTextarea;
