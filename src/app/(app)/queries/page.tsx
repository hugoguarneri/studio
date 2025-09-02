
import QueryEditor from "@/components/query/query-editor";
import AIAssistant from "@/components/query/ai-assistant";
import QueryResults from "@/components/query/query-results";
import DatabaseSchema from "@/components/query/database-schema";
import { Accordion } from "@/components/ui/accordion";

export default function QueriesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <QueryEditor />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-8">
            <Accordion type="multiple" defaultValue={['ai-assistant', 'database-schema']} className="space-y-8">
                <AIAssistant />
                <DatabaseSchema />
            </Accordion>
        </div>
      </div>
      <div>
        <QueryResults />
      </div>
    </div>
  );
}
