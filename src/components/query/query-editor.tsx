
'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PlayCircle, Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { connections } from "@/lib/mock-data"

export default function QueryEditor() {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="font-headline">Query Editor</CardTitle>
                <CardDescription>Craft and run a new SQL query against your database.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <div>
                    <Label htmlFor="connection">Connection</Label>
                    <Select>
                        <SelectTrigger id="connection">
                            <SelectValue placeholder="Select a database" />
                        </SelectTrigger>
                        <SelectContent>
                            {connections.map(conn => (
                                <SelectItem key={conn.id} value={conn.id}>{conn.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex-1 flex flex-col">
                    <Label htmlFor="sql-query">SQL</Label>
                    <Textarea
                        id="sql-query"
                        placeholder="SELECT * FROM users;"
                        className="font-code flex-1 bg-card"
                    />
                </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
                <Button variant="outline">
                    <PlayCircle className="mr-2 size-4" />
                    Run
                </Button>
                <Button>
                    <Save className="mr-2 size-4" />
                    Save
                </Button>
            </CardFooter>
        </Card>
    )
}
