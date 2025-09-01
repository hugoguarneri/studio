
import ConnectionList from "@/components/connections/connection-list";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function ConnectionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Conexiones de Base de Datos</h1>
          <p className="text-muted-foreground">
            Gestiona tus conexiones a bases de datos Postgres y MySQL.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Conexión
        </Button>
      </div>
      <ConnectionList />
    </div>
  );
}
