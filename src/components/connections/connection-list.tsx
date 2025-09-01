import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { connections } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

const DbIcon = ({ type }: { type: string }) => {
    // In a real app, you might have different icons for Postgres, MySQL, etc.
    return <Database className="h-8 w-8 text-muted-foreground" />;
}

export default function ConnectionList() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {connections.map((conn) => (
                <Card key={conn.id}>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <DbIcon type={conn.type} />
                        <div className="flex-1">
                            <CardTitle className="font-headline text-lg">{conn.name}</CardTitle>
                            <CardDescription>{conn.type}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Host: <span className="font-code text-foreground">{conn.host}</span></p>
                    </CardContent>
                    <CardFooter className="gap-2">
                        <Button className="w-full">Manage</Button>
                        <Button variant="outline" className="w-full">Test</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
