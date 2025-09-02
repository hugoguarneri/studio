
'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { PlayCircle, Save } from "lucide-react"

export default function QueryEditor() {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="font-headline text-lg">Query Editor</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <Textarea
                    id="sql-query"
                    placeholder="SELECT * FROM users;"
                    className="font-code flex-1 bg-background text-base"
                />
            </CardContent>
            <CardFooter className="justify-end gap-2 p-4 border-t">
                <Button variant="outline">
                    <Save className="mr-2 size-4" />
                    Save
                </Button>
                <Button>
                    <PlayCircle className="mr-2 size-4" />
                    Run
                </Button>
            </CardFooter>
        </Card>
    )
}
