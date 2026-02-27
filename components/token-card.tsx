"use client"

import Image from "next/image"
import { Printer, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface TokenData {
  tokenNumber: string
  docType: "cnic" | "passport"
  docNumber: string
  serviceType: string
  servicePrefix: string
  tokenType: string
  tokenTypeNumber: number
  branchName: string
  counter: string
  issuedAt: string
  date: string
}

interface TokenCardProps {
  token: TokenData
  onPrint: () => void
  onNewToken: () => void
}

export function TokenCard({ token, onPrint, onNewToken }: TokenCardProps) {
  const docLabel = token.docType === "cnic" ? "CNIC" : "Passport"
  const isFastTrack = token.tokenTypeNumber === 2

  const prefixLabel =
    token.servicePrefix === "L"
      ? "Learner"
      : token.servicePrefix === "P"
        ? "Permanent"
        : "International"

  return (
    <div className="flex flex-col items-center gap-4">
      {/* ===== Thermal Receipt - 72mm printable area ===== */}
      <div
        id="thermal-token"
        style={{ width: "272px" }}
        className="mx-auto border border-dashed border-foreground/20 bg-card text-card-foreground"
      >
        {/* Header - logo + title */}
        <div style={{ padding: "10px 12px 6px" }} className="flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/sindh-police-logo.png"
            alt="Sindh Police"
            width={40}
            height={40}
            style={{ width: "40px", height: "40px", objectFit: "contain" }}
          />
          <p style={{ fontSize: "10px", marginTop: "4px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Driving License Sindh
          </p>
          <p style={{ fontSize: "8px", color: "#666", marginTop: "1px" }}>
            {token.branchName}
          </p>
        </div>

        {/* Separator */}
        <div style={{ margin: "0 8px", borderTop: "1px dashed #999" }} />

        {/* Token type badge */}
        <div style={{ textAlign: "center", padding: "6px 12px 2px" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "9px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "2px 8px",
              border: isFastTrack ? "1px solid #c00" : "1px solid #333",
              borderRadius: "2px",
            }}
          >
            {"Type "}{token.tokenTypeNumber}{" - "}{isFastTrack ? "Fast Track / Senior" : "Normal"}
          </span>
        </div>

        {/* Token number - BIG */}
        <div style={{ textAlign: "center", padding: "4px 12px 2px" }}>
          <p style={{ fontSize: "8px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "#666" }}>
            Token No.
          </p>
          <p
            style={{
              fontSize: "36px",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              fontFamily: "monospace",
              margin: "2px 0",
            }}
          >
            {token.tokenNumber}
          </p>
        </div>

        {/* License type prefix badge */}
        <div style={{ textAlign: "center", paddingBottom: "6px" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "9px",
              fontWeight: 700,
              padding: "2px 10px",
              backgroundColor: "#eee",
              borderRadius: "2px",
            }}
          >
            {token.servicePrefix}{" - "}{prefixLabel}
          </span>
        </div>

        {/* Separator */}
        <div style={{ margin: "0 8px", borderTop: "1px dashed #999" }} />

        {/* Detail rows */}
        <div style={{ padding: "6px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
            <span style={{ fontSize: "9px", color: "#666" }}>{docLabel}</span>
            <span style={{ fontSize: "10px", fontWeight: 600, fontFamily: "monospace" }}>{token.docNumber}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
            <span style={{ fontSize: "9px", color: "#666" }}>License Type</span>
            <span style={{ fontSize: "10px", fontWeight: 600 }}>{token.serviceType}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
            <span style={{ fontSize: "9px", color: "#666" }}>Counter</span>
            <span style={{ fontSize: "10px", fontWeight: 600 }}>{token.counter}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
            <span style={{ fontSize: "9px", color: "#666" }}>Time</span>
            <span style={{ fontSize: "10px", fontWeight: 600, fontFamily: "monospace" }}>{token.issuedAt}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
            <span style={{ fontSize: "9px", color: "#666" }}>Date</span>
            <span style={{ fontSize: "10px", fontWeight: 600 }}>{token.date}</span>
          </div>
        </div>

        {/* Separator */}
        <div style={{ margin: "0 8px", borderTop: "1px dashed #999" }} />

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "6px 12px 10px" }}>
          <p style={{ fontSize: "8px", color: "#666" }}>
            Please wait for your token number to be called.
          </p>
          <p style={{ fontSize: "7px", color: "#999", marginTop: "2px" }}>
            Sindh Police - Proud to Serve
          </p>
        </div>
      </div>

      {/* Action buttons - NEVER printed */}
      <div className="flex w-[272px] gap-3" data-print-hide>
        <Button
          onClick={onPrint}
          className={`h-10 flex-1 gap-2 rounded-lg text-sm font-semibold ${
            isFastTrack
              ? "bg-accent text-accent-foreground hover:bg-accent/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button
          onClick={onNewToken}
          variant="outline"
          className="h-10 flex-1 gap-2 rounded-lg text-sm font-semibold"
        >
          <RotateCcw className="h-4 w-4" />
          New Token
        </Button>
      </div>
    </div>
  )
}
