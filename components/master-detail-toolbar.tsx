"use client"

import { PlusCircle, Save, CircleDot, ChevronFirst, ChevronLast, ChevronsLeft, ChevronsRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MasterDetailToolbarProps {
  title: string
  recordIndex: number
  totalRecords: number
  onNew: () => void
  onSave: () => void
  onSaveAndNew: () => void
  onFirst: () => void
  onPrev: () => void
  onNext: () => void
  onLast: () => void
  onRefresh: () => void
}

export function MasterDetailToolbar({
  title,
  recordIndex,
  totalRecords,
  onNew,
  onSave,
  onSaveAndNew,
  onFirst,
  onPrev,
  onNext,
  onLast,
  onRefresh,
}: MasterDetailToolbarProps) {
  return (
    <div className="border-b border-border bg-card px-4 py-3">
      <h2 className="mb-3 text-lg font-bold text-foreground">{title}</h2>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={onNew} className="gap-1.5">
          <PlusCircle className="h-4 w-4" />
          New
        </Button>
        <Button variant="outline" size="sm" onClick={onSave} className="gap-1.5">
          <Save className="h-4 w-4" />
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={onSaveAndNew} className="gap-1.5">
          <CircleDot className="h-4 w-4" />
          {'Save & New'}
        </Button>

        <div className="mx-1 h-6 w-px bg-border" />

        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onFirst}>
          <ChevronFirst className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onPrev}>
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <span className="min-w-[80px] text-center text-xs font-medium text-muted-foreground">
          {totalRecords > 0 ? recordIndex + 1 : 0} Of {totalRecords}
        </span>

        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onNext}>
          <ChevronsRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onLast}>
          <ChevronLast className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
