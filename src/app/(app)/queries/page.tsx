
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
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3">
                <DatabaseSchema />
            </div>
            <div className="lg:w-2/3">
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
