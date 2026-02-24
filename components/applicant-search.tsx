"use client"

import { useState } from "react"
import { Search, CreditCard, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ApplicantSearchProps {
  onSearch: (type: "cnic" | "passport", value: string) => void
  isSearching: boolean
}

export function ApplicantSearch({ onSearch, isSearching }: ApplicantSearchProps) {
  const [searchType, setSearchType] = useState<"cnic" | "passport">("cnic")
  const [searchValue, setSearchValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      onSearch(searchType, searchValue.trim())
    }
  }

  const formatCNIC = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 13)
    if (digits.length <= 5) return digits
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchType === "cnic") {
      setSearchValue(formatCNIC(e.target.value))
    } else {
      setSearchValue(e.target.value.toUpperCase())
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-foreground">Search Applicant</h2>

      {/* Search Type Toggle */}
      <div className="mb-5 flex rounded-lg border border-border bg-secondary/30 p-1">
        <button
          type="button"
          onClick={() => {
            setSearchType("cnic")
            setSearchValue("")
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
            searchType === "cnic"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <CreditCard className="h-4 w-4" />
          CNIC
        </button>
        <button
          type="button"
          onClick={() => {
            setSearchType("passport")
            setSearchValue("")
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
            searchType === "passport"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Passport
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="search-input" className="text-sm font-medium text-foreground">
            {searchType === "cnic" ? "CNIC Number" : "Passport Number"}
          </Label>
          <div className="relative">
            <Input
              id="search-input"
              type="text"
              placeholder={
                searchType === "cnic"
                  ? "XXXXX-XXXXXXX-X"
                  : "Enter passport number"
              }
              value={searchValue}
              onChange={handleValueChange}
              required
              className="h-12 rounded-lg border-border bg-secondary/50 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary font-mono text-base tracking-wider"
            />
            <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            {searchType === "cnic"
              ? "Enter 13-digit CNIC number (e.g., 42201-1234567-1)"
              : "Enter passport number (e.g., AB1234567)"}
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSearching || !searchValue.trim()}
          className="h-11 w-full rounded-lg bg-primary text-primary-foreground font-semibold shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-60"
        >
          {isSearching ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Searching...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Applicant
            </span>
          )}
        </Button>
      </form>
    </div>
  )
}
