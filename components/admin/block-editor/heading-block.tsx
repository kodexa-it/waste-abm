'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import type { HeadingBlock } from '@/lib/types'

interface HeadingBlockEditorProps {
  block: HeadingBlock
  onUpdate: (updates: Partial<HeadingBlock>) => void
}

const levels: { value: 1 | 2 | 3 | 4; label: string }[] = [
  { value: 1, label: 'H1' },
  { value: 2, label: 'H2' },
  { value: 3, label: 'H3' },
  { value: 4, label: 'H4' },
]

export function HeadingBlockEditor({ block, onUpdate }: HeadingBlockEditorProps) {
  const sizeClasses = {
    1: 'text-3xl font-bold',
    2: 'text-2xl font-bold',
    3: 'text-xl font-semibold',
    4: 'text-lg font-semibold',
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Level:</span>
        <ButtonGroup>
          {levels.map((level) => (
            <Button
              key={level.value}
              variant={block.level === level.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onUpdate({ level: level.value })}
              className="h-7 px-2 text-xs"
            >
              {level.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <Input
        placeholder="Heading text..."
        value={block.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        className={`border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${sizeClasses[block.level]}`}
      />
    </div>
  )
}
