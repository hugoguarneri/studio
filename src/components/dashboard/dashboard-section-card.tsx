

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface DashboardSectionCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    href: string;
}

export default function DashboardSectionCard({ icon: Icon, title, description, href }: DashboardSectionCardProps) {
    return (
        <Link href={href} className="group">
            <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <div className="bg-primary/10 p-2 rounded-md">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="font-headline text-lg">{title}</CardTitle>
                        <CardDescription className="text-xs">{description}</CardDescription>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </CardHeader>
            </Card>
        </Link>
    )
}
