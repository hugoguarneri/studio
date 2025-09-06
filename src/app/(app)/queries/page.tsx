
import QueryEditor from "@/components/query/query-editor";
import QueryResults from "@/components/query/query-results";
import DatabaseSchema from "@/components/query/database-schema";

export default function QueriesPage() {
  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-headline">Query Editor</h1>
          <p className="text-muted-foreground">
            Write, run, and save your database queries.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-6 flex-1 min-h-0">
        <div className="grid grid-cols-1 xl:grid-cols-[350px_1fr] gap-6">
          <DatabaseSchema />
          <QueryEditor />
        </div>
        <div className="flex-1 min-h-0">
          <QueryResults />
        </div>
      </div>
    </div>
  );
}
