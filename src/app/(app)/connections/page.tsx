
'use client';

import ConnectionList from "@/components/connections/connection-list";
import NewConnectionDialog from "@/components/connections/new-connection-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export default function ConnectionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-headline">Connections</h1>
          <p className="text-muted-foreground">
            Manage your connections to Postgres and MySQL databases.
          </p>
        </div>
        <NewConnectionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Connection
          </Button>
        </NewConnectionDialog>
      </div>
      <ConnectionList />
    </div>
  );
}
