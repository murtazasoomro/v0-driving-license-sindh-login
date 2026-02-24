"use client"

import Image from "next/image"
import { LogOut, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TokenHeaderProps {
  username: string
  onLogout: () => void
  onBack: () => void
}

export function TokenHeader({ username, onLogout, onBack }: TokenHeaderProps) {
  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className="relative h-9 w-9 overflow-hidden rounded-lg shadow-sm">
            <Image
              src="/images/logo-dls.png"
              alt="DLS Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight text-foreground">
              Driving License Sindh
            </span>
            <span className="text-xs text-muted-foreground">Token Issuance</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-foreground">{username}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
