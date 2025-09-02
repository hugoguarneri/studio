
'use client'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { PlayCircle, Save } from "lucide-react"

export default function QueryEditor() {
    return (
        <Card className="flex flex-col h-full shadow-none border-0">
            <CardContent className="flex-1 flex flex-col p-0">
                <Textarea
                    id="sql-query"
                    placeholder="SELECT * FROM users;"
                    className="font-code flex-1 bg-card rounded-md border text-base"
                />
            </CardContent>
            <CardFooter className="justify-end gap-2 p-0 pt-4">
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
