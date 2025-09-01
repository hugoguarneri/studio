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

const AISuggestQueriesInputSchema = z.object({
  databaseSchema: z
    .string()
    .describe('The schema of the database, including table names and column names.'),
  userPreferences: z
    .string()
    .describe('The user preferences for the types of queries they are interested in.'),
});
export type AISuggestQueriesInput = z.infer<typeof AISuggestQueriesInputSchema>;

const AISuggestQueriesOutputSchema = z.array(z.string()).describe('A list of suggested SQL queries.');
export type AISuggestQueriesOutput = z.infer<typeof AISuggestQueriesOutputSchema>;

export async function suggestQueries(input: AISuggestQueriesInput): Promise<AISuggestQueriesOutput> {
  return suggestQueriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestQueriesPrompt',
  input: {schema: AISuggestQueriesInputSchema},
  output: {schema: AISuggestQueriesOutputSchema},
  prompt: `You are an AI assistant that suggests SQL queries based on a database schema and user preferences.

  Database Schema:
  {{{databaseSchema}}}

  User Preferences:
  {{{userPreferences}}}

  Suggest SQL queries that could reveal interesting insights from the data, considering the schema and preferences. Return the queries as a JSON array of strings.
  Make sure the queries are compatible with PostgreSQL and MySQL.
  Queries:
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
