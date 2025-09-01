
'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Copy } from 'lucide-react';
import { suggestQueries, type AISuggestQueriesInput } from '@/ai/flows/ai-suggest-queries';
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from '../ui/scroll-area';

export default function AIAssistant() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSuggestions([]);

    const formData = new FormData(event.currentTarget);
    const input: AISuggestQueriesInput = {
      databaseSchema: formData.get('schema') as string,
      userPreferences: formData.get('preferences') as string,
    };
    
    try {
      const result = await suggestQueries(input);
      setSuggestions(result);
    } catch (error) {
      console.error(error);
      toast({
          variant: "destructive",
          title: "AI Assistant Error",
          description: "Could not generate query suggestions. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied to clipboard!",
    });
  }

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Sparkles className="text-accent" />
          AI Query Assistant
        </CardTitle>
        <CardDescription>
          Describe your schema and what you want to find out. We'll suggest some queries.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schema">Database Schema</Label>
            <Textarea
              id="schema"
              name="schema"
              placeholder="e.g., users(id, name, email, signup_date)&#10;orders(id, user_id, amount, created_at)"
              rows={4}
              required
              className="bg-card"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferences">Preferences</Label>
            <Textarea
              id="preferences"
              name="preferences"
              placeholder="e.g., I'm interested in user engagement metrics and sales trends."
              rows={2}
              required
              className="bg-card"
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Suggestions
          </Button>
          {suggestions.length > 0 && (
            <div className="mt-4 space-y-3">
              <h4 className="font-semibold text-sm">Suggestions:</h4>
              <ScrollArea className="h-64">
                <div className="space-y-2 pr-4">
                {suggestions.map((query, index) => (
                  <div key={index} className="group relative rounded-md border bg-muted/30 p-3">
                    <pre className="text-xs font-code whitespace-pre-wrap">{query}</pre>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(query)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
