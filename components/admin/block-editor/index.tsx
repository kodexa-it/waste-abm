'use client'

import { useState } from 'react'
import {
  Plus,
  GripVertical,
  Trash2,
  Copy,
  Type,
  Heading,
  Image,
  List,
  Quote,
  Info,
  MousePointer,
  ChevronDown,
  PenLine,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import type { Block, BlockType } from '@/lib/types'
import { generateId } from '@/lib/store'
import { ParagraphBlockEditor } from './paragraph-block'
import { HeadingBlockEditor } from './heading-block'
import { ImageBlockEditor } from './image-block'
import { ListBlockEditor } from './list-block'
import { QuoteBlockEditor } from './quote-block'
import { InfoBoxBlockEditor } from './infobox-block'
import { CTABlockEditor } from './cta-block'
import { cn } from '@/lib/utils'

interface BlockEditorProps {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
}

const blockTypes: { type: BlockType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: 'paragraph', label: 'Paragraph', icon: <Type className="size-4" />, description: 'Plain text content' },
  { type: 'heading', label: 'Heading', icon: <Heading className="size-4" />, description: 'Section title (H1-H4)' },
  { type: 'image', label: 'Image', icon: <Image className="size-4" />, description: 'Upload or embed image' },
  { type: 'list', label: 'List', icon: <List className="size-4" />, description: 'Bullet or numbered list' },
  { type: 'quote', label: 'Quote', icon: <Quote className="size-4" />, description: 'Blockquote with author' },
  { type: 'infobox', label: 'Info Box', icon: <Info className="size-4" />, description: 'Info, warning, or success' },
  { type: 'cta', label: 'Call to Action', icon: <MousePointer className="size-4" />, description: 'CTA with button' },
]

function createEmptyBlock(type: BlockType): Block {
  const id = generateId()
  switch (type) {
    case 'paragraph':
      return { id, type: 'paragraph', text: '' }
    case 'heading':
      return { id, type: 'heading', level: 2, text: '' }
    case 'image':
      return { id, type: 'image', url: '', caption: '' }
    case 'list':
      return { id, type: 'list', ordered: false, items: [''] }
    case 'quote':
      return { id, type: 'quote', text: '', author: '' }
    case 'infobox':
      return { id, type: 'infobox', variant: 'info', text: '' }
    case 'cta':
      return { id, type: 'cta', title: '', text: '', buttonText: '', buttonLink: '' }
    default:
      return { id, type: 'paragraph', text: '' }
  }
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const addBlock = (type: BlockType, index?: number) => {
    const newBlock = createEmptyBlock(type)
    const newBlocks = [...blocks]
    if (index !== undefined) {
      newBlocks.splice(index + 1, 0, newBlock)
    } else {
      newBlocks.push(newBlock)
    }
    onChange(newBlocks)
  }

  const updateBlock = (id: string, updates: Partial<Block>) => {
    onChange(blocks.map((block) => (block.id === id ? { ...block, ...updates } as Block : block)))
  }

  const deleteBlock = (id: string) => {
    onChange(blocks.filter((block) => block.id !== id))
  }

  const duplicateBlock = (id: string) => {
    const index = blocks.findIndex((block) => block.id === id)
    if (index !== -1) {
      const newBlock = { ...blocks[index], id: generateId() }
      const newBlocks = [...blocks]
      newBlocks.splice(index + 1, 0, newBlock)
      onChange(newBlocks)
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setHoveredIndex(index)
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newBlocks = [...blocks]
    const draggedBlock = newBlocks[draggedIndex]
    newBlocks.splice(draggedIndex, 1)
    newBlocks.splice(index, 0, draggedBlock)
    onChange(newBlocks)
    setDraggedIndex(null)
    setHoveredIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setHoveredIndex(null)
  }

  const renderBlock = (block: Block) => {
    const commonProps = {
      onUpdate: (updates: Partial<Block>) => updateBlock(block.id, updates),
    }

    switch (block.type) {
      case 'paragraph':
        return <ParagraphBlockEditor block={block} {...commonProps} />
      case 'heading':
        return <HeadingBlockEditor block={block} {...commonProps} />
      case 'image':
        return <ImageBlockEditor block={block} {...commonProps} />
      case 'list':
        return <ListBlockEditor block={block} {...commonProps} />
      case 'quote':
        return <QuoteBlockEditor block={block} {...commonProps} />
      case 'infobox':
        return <InfoBoxBlockEditor block={block} {...commonProps} />
      case 'cta':
        return <CTABlockEditor block={block} {...commonProps} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-3">
      {blocks.length === 0 ? (
        <Card className="border-dashed border-2 p-12 flex flex-col items-center justify-center text-center bg-muted/20">
          <div className="p-4 rounded-full bg-muted mb-4">
            <PenLine className="size-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg mb-1">Start writing</h3>
          <p className="text-muted-foreground mb-6 max-w-xs">
            Add your first content block to start building your post
          </p>
          <AddBlockButton onAdd={addBlock} />
        </Card>
      ) : (
        <>
          {blocks.map((block, index) => (
            <div
              key={block.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                'group relative transition-all duration-200',
                draggedIndex === index && 'opacity-50 scale-[0.98]',
                hoveredIndex === index && draggedIndex !== null && draggedIndex !== index && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
              )}
            >
              <Card className="relative transition-shadow hover:shadow-md">
                {/* Drag Handle */}
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="cursor-grab active:cursor-grabbing p-1.5 rounded hover:bg-muted flex items-center justify-center"
                    aria-label="Drag to reorder"
                  >
                    <GripVertical className="size-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Block Actions */}
                <div className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 hover:bg-muted"
                    onClick={() => duplicateBlock(block.id)}
                    title="Duplicate block"
                  >
                    <Copy className="size-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => deleteBlock(block.id)}
                    title="Delete block"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>

                <div className="p-4">{renderBlock(block)}</div>
              </Card>

              {/* Add Block Between */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 opacity-0 group-hover:opacity-100 transition-all z-10">
                <AddBlockButton onAdd={(type) => addBlock(type, index)} size="sm" />
              </div>
            </div>
          ))}

          <div className="flex justify-center pt-6">
            <AddBlockButton onAdd={addBlock} />
          </div>
        </>
      )}
    </div>
  )
}

function AddBlockButton({
  onAdd,
  size = 'default',
}: {
  onAdd: (type: BlockType) => void
  size?: 'default' | 'sm'
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={cn(
            'transition-all',
            size === 'sm' ? 'h-6 px-2 text-xs rounded-full' : ''
          )}
        >
          <Plus className={size === 'sm' ? 'size-3 mr-1' : 'size-4 mr-2'} />
          {size === 'sm' ? 'Add' : 'Add Block'}
          <ChevronDown className={size === 'sm' ? 'size-3 ml-1' : 'size-4 ml-2'} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuLabel>Block Types</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {blockTypes.map((blockType) => (
          <DropdownMenuItem
            key={blockType.type}
            onClick={() => onAdd(blockType.type)}
            className="flex items-start gap-3 py-2.5 cursor-pointer"
          >
            <div className="mt-0.5 text-muted-foreground">{blockType.icon}</div>
            <div>
              <div className="font-medium">{blockType.label}</div>
              <div className="text-xs text-muted-foreground">{blockType.description}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
