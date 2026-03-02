"use client"

import { PlusCircle, Save, CircleDot, Trash2, ChevronFirst, ChevronLast, ChevronsLeft, ChevronsRight, RefreshCw } from "lucide-react"
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
  onDelete?: () => void
  showDelete?: boolean
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
  onDelete,
  showDelete = false,
}: MasterDetailToolbarProps) {
  return (
    <div className="border-b border-border bg-card px-3 py-2 sm:px-4 sm:py-3">
      <h2 className="mb-2 text-base font-bold text-foreground sm:mb-3 sm:text-lg">{title}</h2>
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <Button variant="outline" size="sm" onClick={onNew} className="h-7 gap-1 px-2 text-xs sm:h-8 sm:gap-1.5 sm:px-3">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="hidden xs:inline">New</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onSave} className="h-7 gap-1 px-2 text-xs sm:h-8 sm:gap-1.5 sm:px-3">
          <Save className="h-3.5 w-3.5" />
          <span className="hidden xs:inline">Save</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onSaveAndNew} className="h-7 gap-1 px-2 text-xs sm:h-8 sm:gap-1.5 sm:px-3">
          <CircleDot className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{'Save & New'}</span>
        </Button>
        {showDelete && onDelete && (
          <Button variant="outline" size="sm" onClick={onDelete} className="h-7 gap-1 px-2 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 sm:h-8 sm:gap-1.5 sm:px-3">
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        )}

        <div className="mx-0.5 h-5 w-px bg-border sm:mx-1 sm:h-6" />

        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7" onClick={onFirst}>
            <ChevronFirst className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7" onClick={onPrev}>
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>

          <span className="min-w-[60px] text-center text-[10px] font-medium text-muted-foreground sm:min-w-[80px] sm:text-xs">
            {totalRecords > 0 ? recordIndex + 1 : 0} Of {totalRecords}
          </span>

          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7" onClick={onNext}>
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7" onClick={onLast}>
            <ChevronLast className="h-3.5 w-3.5" />
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7" onClick={onRefresh}>
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
