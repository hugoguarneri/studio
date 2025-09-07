
import QueryEditor from "@/components/query/query-editor";
import QueryResults from "@/components/query/query-results";
import DatabaseSchema from "@/components/query/database-schema";

export default function QueriesPage() {
  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">Query Editor</h1>
        <p className="text-muted-foreground">
          Write, run, and save your database queries.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(300px,1fr)_2fr] gap-6 min-h-0">
        <div className="lg:col-span-1 h-full min-h-0">
            <DatabaseSchema />
        </div>
        <div className="lg:col-span-1 h-full min-h-0">
            <QueryEditor />
        </div>
        <div className="lg:col-span-2 flex-1 min-h-0">
          <QueryResults />
        </div>
      </div>
    </div>
  );
}
