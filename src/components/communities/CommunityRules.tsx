import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from 'lucide-react';

interface Props {
    rules: string[];
}

export const CommunityRules = ({ rules }: Props) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Community Rules
            </CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-3">
                {rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">
                            {index + 1}
                        </span>
                        <span className="text-muted-foreground flex-1">{rule}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
);
