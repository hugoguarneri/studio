
'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, Save, Sparkles } from "lucide-react"
import NumberedTextarea from "./numbered-textarea"

export default function QueryEditor() {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="font-headline text-lg">Query Editor</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
                <NumberedTextarea />
            </CardContent>
            <CardFooter className="justify-end gap-2 p-4 border-t">
                <Button variant="ghost">
                    <Sparkles className="mr-2 size-4" />
                    AI Assistant
                </Button>
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
