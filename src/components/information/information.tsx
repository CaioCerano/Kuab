import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TechnologiesTab } from './tabs/technologies-tab'
import { DesignTab } from './tabs/design-tab'
import { detectTechnologies, DetectionResult } from '@/lib/tech-detector'
import { detectDesign, DesignResult } from '@/lib/design-detector'

export const Information: React.FC = () => {
    const [techResult, setTechResult] = useState<DetectionResult>({
        url: '',
        technologies: []
    })

    const [designResult, setDesignResult] = useState<DesignResult>({
        colors: [],
        spacing: [],
        typography: { fonts: [], sizes: [], weights: [] }
    })

    useEffect(() => {
        const detect = async () => {
            const [techData, designData] = await Promise.all([
                detectTechnologies(),
                detectDesign()
            ])
            setTechResult(techData)
            setDesignResult(designData)
        }
        detect()
    }, [])

    return (
        <Tabs defaultValue="tech" className="w-full h-full">
            <TabsList className="w-full">
                <TabsTrigger value="tech" className="flex-1">
                    Technologies
                </TabsTrigger>
                <TabsTrigger value="design" className="flex-1">
                    Design
                </TabsTrigger>
            </TabsList>
            <TabsContent value="tech">
                <TechnologiesTab
                    url={techResult.url}
                    technologies={techResult.technologies}
                />
            </TabsContent>
            <TabsContent value="design">
                <DesignTab
                    colors={designResult.colors}
                    spacing={designResult.spacing}
                    typography={designResult.typography}
                />
            </TabsContent>
        </Tabs>
    )
}