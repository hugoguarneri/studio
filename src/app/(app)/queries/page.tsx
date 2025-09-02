
import QueryEditor from "@/components/query/query-editor";
import QueryResults from "@/components/query/query-results";
import DatabaseSchema from "@/components/query/database-schema";

export default function QueriesPage() {
  return (
    <div className="flex flex-col gap-6">
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
