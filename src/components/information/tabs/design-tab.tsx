import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useToast } from "@/hooks/use-toast"
import { Copy } from 'lucide-react'

interface ColorInfo {
    hex: string
    rgb: string
    count: number
    role?: 'primary' | 'accent' | 'text' | 'background'
}

interface DesignTabProps {
    colors: ColorInfo[]
    spacing: Array<{ value: string; frequency: number }>
    typography: {
        fonts: string[]
        sizes: string[]
        weights: string[]
    }
}

const ColorCard: React.FC<{ color: ColorInfo }> = ({ color }) => {
    const [showHex, setShowHex] = useState(true)
    const { toast } = useToast()

    const copyColor = () => {
        navigator.clipboard.writeText(showHex ? color.hex : color.rgb)
        toast({
            description: 'Color copied to clipboard'
        })
    }

    const getRoleLabel = (role?: string) => {
        switch (role) {
            case 'primary': return 'Primary'
            case 'accent': return 'Accent'
            case 'text': return 'Text'
            case 'background': return 'Background'
            default: return null
        }
    }

    return (
        <div className="relative group">
            <div
                className="h-14 w-full rounded-md border cursor-pointer group-hover:ring-2 ring-offset-2"
                style={{ backgroundColor: color.hex }}
                onClick={copyColor}
            >
                <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Copy className="h-4 w-4 text-white mix-blend-difference" />
                </div>
            </div>
            <div className="mt-1 space-y-1">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-mono">
                        {showHex ? color.hex : color.rgb}
                    </span>
                    <Switch
                        checked={showHex}
                        onCheckedChange={setShowHex}
                        aria-label="Toggle color format"
                        className="scale-75"
                    />
                </div>
                {color.role && (
                    <Badge
                        variant="outline"
                        className="text-xs w-full justify-center"
                    >
                        {getRoleLabel(color.role)}
                    </Badge>
                )}
            </div>
        </div>
    )
}

export const DesignTab: React.FC<DesignTabProps> = ({ colors, spacing, typography }) => {
    return (
        <ScrollArea className="h-[400px] w-full pr-4">
            <div className="space-y-6">
                {/* Color Palette */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm">Color Palette</CardTitle>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Label>Click to copy</Label>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {colors.map((color) => (
                                <ColorCard key={color.hex} color={color} />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Typography */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Typography</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium mb-2">Font Families</h4>
                            <div className="space-y-1">
                                {typography.fonts.map(font => (
                                    <div
                                        key={font}
                                        className="text-sm px-2 py-1 bg-slate-100 rounded"
                                        style={{ fontFamily: font }}
                                    >
                                        {font}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium mb-2">Font Sizes</h4>
                                <div className="space-y-1">
                                    {typography.sizes.map(size => (
                                        <div
                                            key={size}
                                            className="text-sm px-2 py-1 bg-slate-100 rounded"
                                        >
                                            {size}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium mb-2">Font Weights</h4>
                                <div className="space-y-1">
                                    {typography.weights.map(weight => (
                                        <div
                                            key={weight}
                                            className="text-sm px-2 py-1 bg-slate-100 rounded"
                                        >
                                            {weight}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Spacing */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Common Spacing</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {spacing.map(({ value, frequency }) => (
                                <div
                                    key={value}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span>{value}</span>
                                    <span className="text-slate-500">
                                        Used {frequency} times
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
    )
}