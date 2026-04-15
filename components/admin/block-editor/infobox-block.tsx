'use client'

import { Info, AlertTriangle, CheckCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import type { InfoBoxBlock } from '@/lib/types'
import { cn } from '@/lib/utils'

interface InfoBoxBlockEditorProps {
  block: InfoBoxBlock
  onUpdate: (updates: Partial<InfoBoxBlock>) => void
}

const variants: { value: 'info' | 'warning' | 'success'; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'info', label: 'Info', icon: <Info className="size-3.5" />, color: 'text-info' },
  { value: 'warning', label: 'Warning', icon: <AlertTriangle className="size-3.5" />, color: 'text-warning' },
  { value: 'success', label: 'Success', icon: <CheckCircle className="size-3.5" />, color: 'text-success' },
]

export function InfoBoxBlockEditor({ block, onUpdate }: InfoBoxBlockEditorProps) {
  const currentVariant = variants.find((v) => v.value === block.variant) || variants[0]
  
  const bgColors = {
    info: 'bg-info/10 border-info/30',
    warning: 'bg-warning/10 border-warning/30',
    success: 'bg-success/10 border-success/30',
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Variant:</span>
        <ButtonGroup>
          {variants.map((variant) => (
            <Button
              key={variant.value}
              variant={block.variant === variant.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onUpdate({ variant: variant.value })}
              className={cn('h-7 px-2', block.variant === variant.value && variant.color)}
            >
              {variant.icon}
              <span className="ml-1">{variant.label}</span>
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <div className={cn('rounded-lg border p-4', bgColors[block.variant])}>
        <div className="flex items-start gap-3">
          <div className={currentVariant.color}>{currentVariant.icon}</div>
          <Textarea
            placeholder="Enter info box content..."
            value={block.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            className="flex-1 resize-none border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={2}
          />
        </div>
      </div>
    </div>
  )
}
