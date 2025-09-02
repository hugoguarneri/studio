
import QueryEditor from "@/components/query/query-editor";
import AIAssistant from "@/components/query/ai-assistant";
import { savedQueries } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import QueryResults from "@/components/query/query-results";

export default function QueriesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 flex flex-col gap-8">
            <AIAssistant />
            <Card>
            <CardHeader>
                <CardTitle className="font-headline">Saved Queries</CardTitle>
                <CardDescription>
                Browse and manage your saved SQL queries.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {savedQueries.map((query) => (
                        <TableRow key={query.id}>
                        <TableCell className="font-medium">{query.name}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </div>
            </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <QueryEditor />
        </div>
      </div>
      <div>
        <QueryResults />
      </div>
    </div>
  );
}
