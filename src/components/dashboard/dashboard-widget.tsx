import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface DashboardWidgetProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

export default function DashboardWidget({ title, children, className }: DashboardWidgetProps) {
  return (
    <Card className={cn("flex flex-col shadow-md", className)}>
      <CardHeader>
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex min-h-0">
        {children}
      </CardContent>
    </Card>
  );
}
