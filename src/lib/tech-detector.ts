import { browser } from 'wxt/browser'

export interface DetectionResult {
    url: string
    technologies: string[]
}

interface InjectionResult {
    result: string[]
}

const getHostname = (url: string): string => {
    try {
        const urlObject = new URL(url)
        return urlObject.hostname.replace('www.', '')
    } catch {
        return url
    }
}

export const detectTechnologies = async (): Promise<DetectionResult> => {
    try {
        const tabs = await browser.tabs.query({
            active: true,
            lastFocusedWindow: true,
            currentWindow: true
        })

        const currentTab = tabs[0]
        if (!currentTab?.id) return { url: '', technologies: [] }

        const results = await browser.scripting.executeScript({
            target: { tabId: currentTab.id },
            func: (): string[] => {
                const detected: string[] = []
                const html = document.documentElement.innerHTML.toLowerCase()
                const meta = document.getElementsByTagName('meta')
                const scripts = document.getElementsByTagName('script')

                // React Detection
                if (document.querySelector('[data-reactroot]') || html.includes('react')) {
                    detected.push('React')
                }

                // Next.js Detection
                if (document.querySelector('#__next') || html.includes('next/router')) {
                    detected.push('Next.js')
                }

                // Vue Detection
                if (document.querySelector('[data-v-]') || html.includes('vue')) {
                    detected.push('Vue')
                }

                // Angular Detection
                if (document.querySelector('[ng-version]') || html.includes('angular')) {
                    detected.push('Angular')
                }

                // Svelte Detection
                if (html.includes('svelte')) {
                    detected.push('Svelte')
                }

                // CSS Frameworks
                if (document.querySelector('[class*="text-"]') && document.querySelector('[class*="bg-"]')) {
                    detected.push('Tailwind')
                }
                if (html.includes('bootstrap')) {
                    detected.push('Bootstrap')
                }
                if (document.querySelector('[class*="mui-"]') || html.includes('material-ui')) {
                    detected.push('Material UI')
                }
                if (html.includes('chakra')) {
                    detected.push('Chakra UI')
                }

                // State Management
                if (html.includes('redux')) {
                    detected.push('Redux')
                }
                if (html.includes('recoil')) {
                    detected.push('Recoil')
                }
                if (html.includes('zustand')) {
                    detected.push('Zustand')
                }

                // Build Tools
                if (html.includes('vite')) {
                    detected.push('Vite')
                }
                if (html.includes('webpack')) {
                    detected.push('Webpack')
                }

                // Analytics and Monitoring
                if (html.includes('google-analytics') || html.includes('gtag')) {
                    detected.push('Google Analytics')
                }
                if (html.includes('sentry')) {
                    detected.push('Sentry')
                }
                if (html.includes('mixpanel')) {
                    detected.push('Mixpanel')
                }

                return detected
            }
        }) as InjectionResult[]

        return {
            url: getHostname(currentTab.url || ''),
            technologies: results[0]?.result || []
        }
    } catch (error) {
        console.error('Error:', error)
        return { url: '', technologies: [] }
    }
}