
'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PlayCircle, Save } from "lucide-react"

export default function QueryEditor() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Editor de Consultas</CardTitle>
                <CardDescription>Crea y ejecuta una nueva consulta SQL.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="query-name">Nombre de la Consulta</Label>
                    <Input id="query-name" placeholder="p. ej., Crecimiento Semanal de Usuarios" />
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
                    Ejecutar
                </Button>
                <Button>
                    <Save className="mr-2 size-4" />
                    Guardar
                </Button>
            </CardFooter>
        </Card>
    )
}
