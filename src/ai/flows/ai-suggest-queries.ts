'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting SQL queries based on a database schema and user preferences.
 *
 * - suggestQueries - A function that takes a database schema and user preferences, and returns a list of suggested SQL queries.
 * - AISuggestQueriesInput - The input type for the suggestQueries function, including the database schema and user preferences.
 * - AISuggestQueriesOutput - The output type for the suggestQueries function, a list of suggested SQL queries.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const AISuggestQueriesInputSchema = z.object({
  databaseSchema: z
    .string()
    .optional()
    .describe('The schema of the database, including table names and column names.'),
  history: z.array(MessageSchema),
});
export type AISuggestQueriesInput = z.infer<typeof AISuggestQueriesInputSchema>;

const AISuggestQueriesOutputSchema = z.string().describe('A markdown-formatted string with suggested SQL queries.');
export type AISuggestQueriesOutput = z.infer<typeof AISuggestQueriesOutputSchema>;

export async function suggestQueries(input: AISuggestQueriesInput): Promise<AISuggestQueriesOutput> {
  return suggestQueriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestQueriesPrompt',
  input: {schema: AISuggestQueriesInputSchema},
  output: {format: 'markdown'},
  prompt: `You are an AI assistant that suggests SQL queries based on a database schema and user preferences.
  
  {{#if databaseSchema}}
  The user has provided the following database schema for context. Use this to inform your suggestions.
  Database Schema:
  {{{databaseSchema}}}
  {{/if}}

  The following is the chat history between you and the user.
  {{#each history}}
  {{#if (eq role 'user')}}
  User: {{{content}}}
  {{else}}
  Assistant: {{{content}}}
  {{/if}}
  {{/each}}
  
  Based on the final user message, suggest SQL queries that could reveal interesting insights from the data.
  If the user asks for something that is not a query, answer their question.
  Your response should be formatted in Markdown, and SQL queries should be in a code block.
  Make sure the queries are compatible with PostgreSQL and MySQL.
  Assistant:
  `,
});

const suggestQueriesFlow = ai.defineFlow(
  {
    name: 'suggestQueriesFlow',
    inputSchema: AISuggestQueriesInputSchema,
    outputSchema: AISuggestQueriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
