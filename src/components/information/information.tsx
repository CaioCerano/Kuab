import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TechnologiesTab } from './tabs/technologies-tab'
import { DesignTab } from './tabs/design-tab'
import { detectTechnologies, DetectionResult } from '@/lib/tech-detector'
import { detectDesign, DesignResult } from '@/lib/design-detector'
import { Loader2 } from 'lucide-react'

const isFirefox = import.meta.env.FIREFOX

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
    const [currentUrl, setCurrentUrl] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const getCurrentTab = async () => {
        try {
            // Firefox doesn't need explicit permission checks
            if (!isFirefox) {
                const permissions = await chrome.permissions.contains({
                    permissions: ['tabs'],
                    origins: ['<all_urls>']
                })

                if (!permissions) {
                    throw new Error('Required permissions not granted')
                }
            }

            const tabs = await browser.tabs.query({
                active: true,
                currentWindow: true
            })

            const activeTab = tabs[0]
            if (!activeTab?.url) {
                throw new Error('No active tab URL found')
            }

            return activeTab
        } catch (err) {
            console.error('Error getting current tab:', err)
            throw err
        }
    }

    const updateUrlAndDetect = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const activeTab = await getCurrentTab()
            const newUrl = activeTab.url

            if (newUrl && newUrl !== currentUrl) {
                setCurrentUrl(newUrl)

                // Wait for page load
                await new Promise(resolve => setTimeout(resolve, 1000))

                const [techData, designData] = await Promise.all([
                    detectTechnologies(),
                    detectDesign()
                ])

                setTechResult(techData)
                setDesignResult(designData)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get current tab information')
            console.error('Error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const handleTabUpdate = async (
            tabId: number,
            changeInfo: { status?: string },
            tab: browser.tabs.Tab
        ) => {
            if (changeInfo.status === 'complete' && tab.active) {
                await updateUrlAndDetect()
            }
        }

        const handleTabActivated = async (activeInfo: { tabId: number }) => {
            await updateUrlAndDetect()
        }

        // Initial detection
        updateUrlAndDetect()

        // Add listeners using the browser API
        browser.tabs.onUpdated.addListener(handleTabUpdate)
        browser.tabs.onActivated.addListener(handleTabActivated)

        // Cleanup listeners
        return () => {
            browser.tabs.onUpdated.removeListener(handleTabUpdate)
            browser.tabs.onActivated.removeListener(handleTabActivated)
        }
    }, [])

    if (error) {
        return (
            <div className="p-4 text-center text-red-500">
                <p>{error}</p>
                <button
                    onClick={updateUrlAndDetect}
                    className="mt-2 px-4 py-2 bg-red-100 rounded-md hover:bg-red-200"
                >
                    Retry
                </button>
            </div>
        )
    }

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
            {isLoading ? (
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <>
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
                </>
            )}
        </Tabs>
    )
}