import { browser } from 'wxt/browser'

interface ColorInfo {
    hex: string
    rgb: string
    count: number
    role?: 'primary' | 'accent' | 'text' | 'background'
}

interface SpacingInfo {
    value: string
    frequency: number
}

interface TypographyInfo {
    fonts: string[]
    sizes: string[]
    weights: string[]
}

export interface DesignResult {
    colors: ColorInfo[]
    spacing: SpacingInfo[]
    typography: TypographyInfo
}

interface InjectionResult {
    result: DesignResult
}

export const detectDesign = async (): Promise<DesignResult> => {
    try {
        const tabs = await browser.tabs.query({
            active: true,
            lastFocusedWindow: true,
            currentWindow: true
        })
        
        const currentTab = tabs[0]
        if (!currentTab?.id) {
            return {
                colors: [],
                spacing: [],
                typography: { fonts: [], sizes: [], weights: [] }
            }
        }

        const results = await browser.scripting.executeScript({
            target: { tabId: currentTab.id },
            func: () => {
                const colorMap = new Map<string, { rgb: string; count: number; elements: Element[] }>()
                const spacingMap = new Map<string, number>()
                const fontFamilies = new Set<string>()
                const fontSizes = new Set<string>()
                const fontWeights = new Set<string>()

                const rgbToHex = (rgb: string): string => {
                    const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/)
                    if (!match) return rgb
                    
                    const r = parseInt(match[1])
                    const g = parseInt(match[2])
                    const b = parseInt(match[3])
                    
                    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
                }
                
                const getComputedColors = (element: Element): Array<{ hex: string; rgb: string }> => {
                    const style = window.getComputedStyle(element)
                    const colors = [
                        style.backgroundColor,
                        style.color,
                        style.borderColor
                    ]

                    return colors
                        .filter(color => 
                            color !== 'transparent' && 
                            color !== 'rgba(0, 0, 0, 0)' &&
                            color !== ''
                        )
                        .map(rgb => ({
                            rgb,
                            hex: rgbToHex(rgb)
                        }))
                }

                const determineColorRole = (element: Element, color: string): ColorInfo['role'] => {
                    const style = window.getComputedStyle(element)
                    const classes = element.className.toString().toLowerCase()
                    const id = element.id.toLowerCase()
                    const tagName = element.tagName.toLowerCase()

                    // Check for specific class names or IDs
                    if (classes.includes('primary') || id.includes('primary')) {
                        return 'primary'
                    }
                    if (classes.includes('accent') || id.includes('accent')) {
                        return 'accent'
                    }

                    // Check for semantic elements
                    if ((tagName === 'body' || tagName === 'main') && style.backgroundColor === color) {
                        return 'background'
                    }
                    if (tagName === 'p' && style.color === color) {
                        return 'text'
                    }
                    if (tagName === 'a' || tagName === 'button') {
                        if (style.backgroundColor === color) {
                            return 'primary'
                        }
                        if (style.color === color) {
                            return 'accent'
                        }
                    }

                    return undefined
                }
                
                // Process all elements
                document.querySelectorAll('*').forEach(element => {
                    const style = window.getComputedStyle(element)
                    
                    // Colors
                    getComputedColors(element).forEach(({ hex, rgb }) => {
                        const existing = colorMap.get(hex) || { rgb, count: 0, elements: [] }
                        existing.count++
                        existing.elements.push(element)
                        colorMap.set(hex, existing)
                    })
                    
                    // Spacing
                    const spacingValues = [
                        style.marginTop,
                        style.marginRight,
                        style.marginBottom,
                        style.marginLeft,
                        style.paddingTop,
                        style.paddingRight,
                        style.paddingBottom,
                        style.paddingLeft
                    ]
                    
                    spacingValues.forEach(space => {
                        if (space && space !== '0px') {
                            spacingMap.set(space, (spacingMap.get(space) || 0) + 1)
                        }
                    })
                    
                    // Typography
                    try {
                        const fontFamily = style.fontFamily.split(',')[0].trim()
                        if (fontFamily && fontFamily !== '') {
                            fontFamilies.add(fontFamily.replace(/['"]/g, ''))
                        }
                    } catch {
                        // Skip if font family can't be processed
                    }
                    
                    const fontSize = style.fontSize
                    if (fontSize && fontSize !== '') fontSizes.add(fontSize)
                    
                    const fontWeight = style.fontWeight
                    if (fontWeight && fontWeight !== '') fontWeights.add(fontWeight)
                })
                
                // Sort and format results
                const sortedColors = Array.from(colorMap.entries())
                    .map(([hex, { rgb, count, elements }]) => {
                        // Try to determine role from the first few elements
                        const role = elements.slice(0, 3).reduce<ColorInfo['role']>((acc, element) => {
                            if (acc) return acc // Return if role already found
                            return determineColorRole(element, rgb)
                        }, undefined)

                        return { hex, rgb, count, role }
                    })
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10)
                
                const sortedSpacing = Array.from(spacingMap.entries())
                    .map(([value, frequency]) => ({ value, frequency }))
                    .sort((a, b) => b.frequency - a.frequency)
                    .slice(0, 10)
                
                return {
                    colors: sortedColors,
                    spacing: sortedSpacing,
                    typography: {
                        fonts: Array.from(fontFamilies),
                        sizes: Array.from(fontSizes),
                        weights: Array.from(fontWeights)
                    }
                }
            }
        }) as InjectionResult[]

        return results[0].result
    } catch (error) {
        console.error('Error:', error)
        return {
            colors: [],
            spacing: [],
            typography: { fonts: [], sizes: [], weights: [] }
        }
    }
}