
'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PlayCircle, Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { connections } from "@/lib/mock-data"

export default function QueryEditor() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Query Editor</CardTitle>
                <CardDescription>Craft and run a new SQL query.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="query-name">Query Name</Label>
                        <Input id="query-name" placeholder="e.g., Weekly User Growth" />
                    </div>
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
                </div>
                <div>
                    <Label htmlFor="sql-query">SQL</Label>
                    <Textarea
                        id="sql-query"
                        placeholder="SELECT * FROM users;"
                        className="font-code min-h-[200px] bg-card"
                        rows={10}
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
