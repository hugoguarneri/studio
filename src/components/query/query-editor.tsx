
'use client'
import { Card, CardContent, CardFooter, CardHeader, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, Save, Sparkles } from "lucide-react"
import NumberedTextarea from "./numbered-textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import AIAssistant from "./ai-assistant"
import { Input } from "../ui/input"

export default function QueryEditor() {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <Input 
                    defaultValue="New Query"
                    className="border-none text-lg font-headline p-0 h-auto focus-visible:ring-0"
                />
                <CardDescription>
                    Enter your SQL query below. You can also use the AI assistant to generate one.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 pb-4">
                <NumberedTextarea />
            </CardContent>
            <CardFooter className="justify-end gap-2 p-4 border-t">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost">
                            <Sparkles className="mr-2 size-4" />
                            AI Assistant
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>AI Query Assistant</SheetTitle>
                            <SheetDescription>
                                Let AI help you generate or optimize your SQL queries.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="py-4">
                            <AIAssistant />
                        </div>
                    </SheetContent>
                </Sheet>

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
