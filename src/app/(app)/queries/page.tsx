
import QueryEditor from "@/components/query/query-editor";
import QueryResults from "@/components/query/query-results";
import DatabaseSchema from "@/components/query/database-schema";

export default function QueriesPage() {
  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-110px)]">
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
        <DatabaseSchema />
        <QueryEditor />
      </div>
      <div className="flex-1 min-h-0">
        <QueryResults />
      </div>
    </div>
  );
}
