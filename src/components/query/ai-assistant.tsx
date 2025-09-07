
'use client'

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Send, Paperclip, User, Bot, X } from 'lucide-react';
import { suggestQueries, type AISuggestQueriesInput } from '@/ai/flows/ai-suggest-queries';
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { schemaContent } from './database-schema-mock';
import { Card, CardContent } from '../ui/card';
import { marked } from 'marked';
import { cn } from '@/lib/utils';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

const getFormattedSchema = () => {
    return schemaContent.map(table => 
      `${table.name}(${table.columns.map(col => col.name).join(', ')})`
    ).join('\n');
};

const SchemaAttachment = ({ onRemove }: { onRemove: () => void }) => (
    <Card className="p-3 bg-muted/50 flex items-center gap-3 w-full">
        <Paperclip className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
            <p className="text-sm font-medium">Database Schema Attached</p>
            <p className="text-xs text-muted-foreground line-clamp-2">{getFormattedSchema()}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRemove}>
            <X className="h-4 w-4" />
        </Button>
    </Card>
);

const ChatMessage = ({ message }: { message: Message }) => {
    const isUser = message.role === 'user';

    const createMarkup = (content: string) => {
        const rawMarkup = marked(content, { breaks: true, gfm: true });
        return { __html: rawMarkup as string };
    };

    return (
        <div className={cn("flex items-start gap-3", isUser ? 'justify-end' : '')}>
            {!isUser && (
                <Avatar className="h-8 w-8 border">
                    <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
            )}
            <div className={cn(
                "max-w-[80%] rounded-xl px-4 py-3 text-sm prose dark:prose-invert prose-p:my-1 prose-pre:my-2 prose-pre:bg-background/50", 
                isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}
             dangerouslySetInnerHTML={createMarkup(message.content)}
            />
             {isUser && (
                <Avatar className="h-8 w-8 border">
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
            )}
        </div>
    )
}

export default function AIAssistant() {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [attachSchema, setAttachSchema] = useState(true);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A bit of a hack to get the viewport. The ref points to the outer div.
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [history]);
  
  useEffect(() => {
    setHistory([{
        role: 'assistant',
        content: 'Hello! I can help you generate SQL queries. What are you looking for?'
    }]);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    setInput('');
    setLoading(true);

    const flowInput: AISuggestQueriesInput = {
      history: newHistory,
      ...(attachSchema && { databaseSchema: getFormattedSchema() }),
    };
    
    try {
      const result = await suggestQueries(flowInput);
      setHistory([...newHistory, { role: 'assistant', content: result }]);
    } catch (error) {
      console.error(error);
      setHistory([...newHistory, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      toast({
          variant: "destructive",
          title: "AI Assistant Error",
          description: "Could not generate a response. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
                {history.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                ))}
                 {loading && (
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 border">
                            <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                        <div className="max-w-[80%] rounded-xl px-4 py-3 text-sm bg-muted flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
        <div className="p-4 border-t">
            {attachSchema && (
                <div className="mb-2">
                    <SchemaAttachment onRemove={() => setAttachSchema(false)} />
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex items-start gap-2">
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., Show me the top 5 most active users"
                    className="flex-1 resize-none bg-card"
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e as any);
                        }
                    }}
                    disabled={loading}
                />
                <Button type="submit" disabled={loading || !input.trim()} size="icon">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </form>
            <div className="flex items-center space-x-2 mt-3">
                <Switch 
                    id="attach-schema" 
                    checked={attachSchema} 
                    onCheckedChange={setAttachSchema}
                />
                <Label htmlFor="attach-schema" className="text-xs text-muted-foreground">Use Schema Context</Label>
            </div>
        </div>
    </div>
  );
}
