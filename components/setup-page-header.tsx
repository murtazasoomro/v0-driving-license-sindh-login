"use client"

import Image from "next/image"
import { LogOut, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SetupPageHeaderProps {
  title: string
  username: string
  onLogout: () => void
  onBack: () => void
}

export function SetupPageHeader({ title, username, onLogout, onBack }: SetupPageHeaderProps) {
  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Back</span>
          </Button>
          <div className="hidden h-6 w-px bg-border sm:block" />
          <div className="relative h-7 w-7 overflow-hidden rounded-lg shadow-sm sm:h-9 sm:w-9">
            <Image
              src="/images/logo-dls.png"
              alt="DLS Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold leading-tight text-foreground sm:text-sm">
              <span className="hidden sm:inline">Driving License Sindh</span>
              <span className="sm:hidden">DLS</span>
            </span>
            <span className="text-[10px] text-muted-foreground sm:text-xs">{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-2 md:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-foreground">{username}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="h-7 gap-1.5 border-destructive/30 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive sm:h-8 sm:gap-2 sm:px-3"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
