
'use client';

import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';
import QuerySuggestions, { type Suggestion } from './query-suggestions';
import { schemaContent } from './database-schema-mock';
import { format } from 'sql-formatter';

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
        // Optionally, show a toast or message to the user
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

        // We need to wait for the state to update before setting the cursor position
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
    const lines = text.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length;

    const div = document.createElement('div');
    const style = window.getComputedStyle(textarea);
    ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'lineHeight', 'textTransform', 'wordSpacing'].forEach(prop => {
        div.style.setProperty(prop, style.getPropertyValue(prop));
    });
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.style.padding = style.padding;
    div.style.width = style.width;
    
    div.textContent = text.substring(0, selectionStart);
    document.body.appendChild(div);

    const span = document.createElement('span');
    span.textContent = text.substring(selectionStart);
    div.appendChild(span);

    const rect = textarea.getBoundingClientRect();
    const spanRect = span.getBoundingClientRect();
    
    document.body.removeChild(div);
    
    return {
        top: spanRect.top - rect.top + 20, // Add some offset
        left: spanRect.left - rect.left,
    };
  };

  const updateSuggestions = (text: string, cursorPosition: number) => {
      const textUntilCursor = text.substring(0, cursorPosition);
      const lastWordMatch = textUntilCursor.match(/\b\w+$/);
      const lastWord = lastWordMatch ? lastWordMatch[0] : '';
      
      const lastKeywordMatch = textUntilCursor.trim().split(/\s+/).pop()?.toUpperCase();

      let newSuggestions: Suggestion[] = [];
      const fromOrJoinRegex = /\b(FROM|JOIN)\s+(\w+)?$/i;

      if (fromOrJoinRegex.test(textUntilCursor.trim())) {
        newSuggestions = schemaContent
          .map(t => ({ name: t.name, type: 'table' as const}))
          .filter(t => t.name.startsWith(lastWord));
      } else {
        setSuggestions([]);
        return;
      }
      
      if (textareaRef.current && newSuggestions.length > 0) {
        const { top, left } = getCursorCoordinates(textareaRef.current);
        setSuggestionPosition({ top, left });
      }

      setSuggestions(newSuggestions);
  };
  
  const handleSuggestionSelect = (suggestion: Suggestion) => {
    const text = value;
    const cursor = textareaRef.current?.selectionStart || 0;
    const textUntilCursor = text.substring(0, cursor);
    const lastWordMatch = textUntilCursor.match(/\b(\w+)$/);

    let newText = '';
    if (lastWordMatch) {
      const lastWord = lastWordMatch[1];
      const startIndex = lastWordMatch.index || 0;
      newText = text.substring(0, startIndex) + suggestion.name + ' ' + text.substring(cursor);
    } else {
      newText = text.substring(0, cursor) + suggestion.name + ' ' + text.substring(cursor);
    }

    setValue(newText);
    setSuggestions([]);
    
    setTimeout(() => {
        textareaRef.current?.focus();
        const newCursorPos = (lastWordMatch?.index || cursor) + suggestion.name.length + 1;
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
