"use client"

import { FileText } from "lucide-react"

export interface SettingsTile {
  id: string
  label: string
  href?: string
  onClick?: () => void
}

interface SettingsTileGridProps {
  tiles: SettingsTile[]
}

export function SettingsTileGrid({ tiles }: SettingsTileGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {tiles.map((tile) => (
        <button
          key={tile.id}
          type="button"
          onClick={tile.onClick}
          className="group flex items-center gap-3 rounded-md border-l-4 border-l-primary bg-secondary px-3 py-4 text-left transition-all hover:bg-secondary/80 hover:shadow-lg active:scale-[0.98] sm:px-4 sm:py-5"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center sm:h-8 sm:w-8">
            <FileText className="h-5 w-5 text-muted-foreground group-hover:text-foreground sm:h-6 sm:w-6" />
          </div>
          <span className="truncate text-sm font-semibold leading-tight text-foreground">
            {tile.label}
          </span>
        </button>
      ))}
    </div>
  )
}
