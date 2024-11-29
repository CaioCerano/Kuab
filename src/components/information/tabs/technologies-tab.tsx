import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TechnologiesTabProps {
    url: string
    technologies: string[]
}

export const TechnologiesTab: React.FC<TechnologiesTabProps> = ({ url, technologies }) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-sm truncate">{url}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 flex-wrap">
                    {technologies.map(tech => (
                        <Badge key={tech} variant="secondary">
                            {tech}
                        </Badge>
                    ))}
                    {technologies.length === 0 && (
                        <span className="text-sm text-slate-500">
                            No technologies detected
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}