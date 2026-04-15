'use client'

import { Plus, X, List, ListOrdered } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import type { ListBlock } from '@/lib/types'

interface ListBlockEditorProps {
  block: ListBlock
  onUpdate: (updates: Partial<ListBlock>) => void
}

export function ListBlockEditor({ block, onUpdate }: ListBlockEditorProps) {
  const addItem = () => {
    onUpdate({ items: [...block.items, ''] })
  }

  const updateItem = (index: number, value: string) => {
    const newItems = [...block.items]
    newItems[index] = value
    onUpdate({ items: newItems })
  }

  const removeItem = (index: number) => {
    if (block.items.length <= 1) return
    const newItems = block.items.filter((_, i) => i !== index)
    onUpdate({ items: newItems })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Type:</span>
        <ButtonGroup>
          <Button
            variant={!block.ordered ? 'default' : 'outline'}
            size="sm"
            onClick={() => onUpdate({ ordered: false })}
            className="h-7 px-2"
          >
            <List className="size-3.5 mr-1" />
            Bullet
          </Button>
          <Button
            variant={block.ordered ? 'default' : 'outline'}
            size="sm"
            onClick={() => onUpdate({ ordered: true })}
            className="h-7 px-2"
          >
            <ListOrdered className="size-3.5 mr-1" />
            Numbered
          </Button>
        </ButtonGroup>
      </div>

      <div className="space-y-2">
        {block.items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm w-6 text-center">
              {block.ordered ? `${index + 1}.` : '•'}
            </span>
            <Input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder="List item..."
              className="flex-1"
            />
            <Button
              size="icon"
              variant="ghost"
              className="size-8 shrink-0"
              onClick={() => removeItem(index)}
              disabled={block.items.length <= 1}
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={addItem} className="w-full">
        <Plus className="size-3.5 mr-1" />
        Add Item
      </Button>
    </div>
  )
}
