
'use client'
import { Card, CardContent, CardFooter, CardDescription, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, Save, Sparkles, Code } from "lucide-react"
import NumberedTextarea from "./numbered-textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import AIAssistant from "./ai-assistant"
import { Input } from "../ui/input"
import { useRef } from "react"

interface NumberedTextareaHandle {
  formatQuery: () => void;
}

export default function QueryEditor() {
    const numberedTextareaRef = useRef<NumberedTextareaHandle>(null);

    const handleFormatQuery = () => {
        numberedTextareaRef.current?.formatQuery();
    }

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="p-4">
                <Input 
                    defaultValue="New Query"
                    className="border-none text-xl font-medium h-auto p-2 focus-visible:ring-0 font-headline text-muted-foreground"
                />
                <CardDescription className="px-2 mt-1">
                    Enter your SQL query below. You can also use the AI assistant to generate one.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4 pt-0">
                <NumberedTextarea ref={numberedTextareaRef} />
            </CardContent>
            <CardFooter className="flex items-center justify-between gap-2 p-4 border-t">
                <div>
                    <span className="text-xs text-muted-foreground">Limit 100</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={handleFormatQuery}>
                        <Code className="mr-2 size-4" />
                        Format
                    </Button>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost">
                                <Sparkles className="mr-2 size-4" />
                                AI Assistant
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-xl p-0">
                            <AIAssistant />
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
                </div>
            </CardFooter>
        </Card>
    )
}
