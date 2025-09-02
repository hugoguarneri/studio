
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Database } from 'lucide-react';

const schemaContent = `
TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  signup_date DATE
);

TABLE orders (
  id INT PRIMARY KEY,
  user_id INT,
  amount DECIMAL(10, 2),
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`.trim();

export default function DatabaseSchema() {
  return (
    <AccordionItem value="database-schema">
      <Card>
        <AccordionTrigger className="p-6">
          <CardHeader className="p-0 text-left">
            <CardTitle className="flex items-center gap-2 font-headline">
              <Database className="text-accent" />
              Database Schema
            </CardTitle>
            <CardDescription>
              Schema for the selected database connection.
            </CardDescription>
          </CardHeader>
        </AccordionTrigger>
        <AccordionContent className="px-6">
          <div className="rounded-md border bg-muted/30 p-3">
            <pre className="text-xs font-code whitespace-pre-wrap">
              {schemaContent}
            </pre>
          </div>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}
