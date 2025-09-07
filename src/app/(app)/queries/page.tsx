
import QueryEditor from "@/components/query/query-editor";
import QueryResults from "@/components/query/query-results";
import DatabaseSchema from "@/components/query/database-schema";

export default function QueriesPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-2xl font-bold font-headline">Query Editor</h1>
        <p className="text-muted-foreground">
          Write, run, and save your database queries.
        </p>
      </div>

      <div className="flex flex-col flex-1 gap-6 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
            <div className="lg:col-span-1 h-full">
                <DatabaseSchema />
            </div>
            <div className="lg:col-span-2 h-full">
                <QueryEditor />
            </div>
        </div>
        <div className="flex-1 min-h-0">
          <QueryResults />
        </div>
      </div>
    </div>
  );
}
