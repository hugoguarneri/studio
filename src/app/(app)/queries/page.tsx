
import QueryEditor from "@/components/query/query-editor";
import QueryResults from "@/components/query/query-results";
import DatabaseSchema from "@/components/query/database-schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function QueriesPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-headline">Query Editor</h1>
          <p className="text-muted-foreground">
            Write, run, and save your database queries.
          </p>
        </div>
        <div className="space-y-2 w-full sm:w-72">
            <Label htmlFor="query-name">Query Name</Label>
            <Input id="query-name" placeholder="e.g. Monthly Active Users" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
        <DatabaseSchema />
        <QueryEditor />
      </div>
      <div className="min-h-0">
        <QueryResults />
      </div>
    </div>
  );
}
