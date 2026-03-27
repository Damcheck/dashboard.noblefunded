"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardShell } from "@/components/dashboard/shell"
import {
  mockAccounts,
  formatCurrency,
  getStatusLabel,
  getStatusClass,
} from "@/lib/data"
import {
  Wallet,
  ShoppingCart,
  ChevronRight,
  AlertTriangle,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AccountsPage() {
  const [filter, setFilter] = useState<"all" | "naira" | "dollar">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "challenge" | "failed">("all")

  const filtered = mockAccounts.filter((a) => {
    const typeMatch = filter === "all" || (filter === "naira" ? a.type === "naira" : a.type === "dollar")
    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "active" && (a.status === "funded" || a.status === "active")) ||
      (statusFilter === "challenge" && (a.status === "challenge_phase1" || a.status === "challenge_phase2")) ||
      (statusFilter === "failed" && a.status === "failed")
    return typeMatch && statusMatch
  })

  return (
    <DashboardShell title="My Accounts" subtitle="Manage all your trading accounts">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Type filter */}
            <div className="flex items-center gap-1 p-1 glass-card rounded-lg">
              {(["all", "naira", "dollar"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    filter === f
                      ? "bg-[#a7ffeb] text-[#001e28]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f === "all" ? "All" : f === "naira" ? "Naira ₦" : "Dollar $"}
                </button>
              ))}
            </div>
            {/* Status filter */}
            <div className="flex items-center gap-1 p-1 glass-card rounded-lg">
              {(["all", "active", "challenge", "failed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                    statusFilter === f
                      ? "bg-[rgba(167,255,235,0.15)] text-[#a7ffeb]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <Link
            href="https://noble-frontend-lilac.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#001e28] bg-[#a7ffeb] hover:bg-[#7bf5d5] transition-all"
          >
            <ShoppingCart size={15} />
            Buy New Challenge
          </Link>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Accounts", value: mockAccounts.length, color: "text-foreground" },
            { label: "Funded", value: mockAccounts.filter(a => a.status === "funded").length, color: "text-[#4ade80]" },
            { label: "In Challenge", value: mockAccounts.filter(a => a.status.startsWith("challenge")).length, color: "text-[#fbbf24]" },
            { label: "Failed", value: mockAccounts.filter(a => a.status === "failed").length, color: "text-[#f87171]" },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4 text-center">
              <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Accounts list */}
        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold text-foreground">No accounts found</p>
            <p className="text-sm text-muted-foreground mt-1">Try changing your filters or buy a new challenge.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((account) => {
              const progressPct = Math.min(100, (account.currentProfit / account.profitTarget) * 100)
              const drawdownPct = Math.min(100, (account.currentOverallDrawdown / account.maxOverallDrawdown) * 100)
              const isNaira = account.currency === "NGN"

              return (
                <div key={account.id} className="glass-card p-5 hover:border-[rgba(167,255,235,0.2)] transition-all duration-200">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", isNaira ? "badge-naira" : "badge-dollar")}>
                          {isNaira ? "₦ NAIRA" : "$ DOLLAR"}
                        </span>
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", getStatusClass(account.status))}>
                          {account.status === "challenge_phase1" ? "Phase 1" : account.status === "challenge_phase2" ? "Phase 2" : getStatusLabel(account.status)}
                        </span>
                      </div>
                      <p className="font-bold text-foreground text-sm">{account.accountNumber}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Started {new Date(account.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{formatCurrency(account.balance, account.currency)}</p>
                      <p className={cn("text-xs font-semibold", account.currentProfit >= 0 ? "text-[#4ade80]" : "text-[#f87171]")}>
                        {account.currentProfit >= 0 ? "+" : ""}{account.currentProfit.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {/* MT5 Credentials */}
                  <div className="grid grid-cols-2 gap-2 mb-4 bg-[rgba(167,255,235,0.03)] rounded-lg p-3 border border-[rgba(167,255,235,0.06)]">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Login</p>
                      <p className="text-xs font-mono font-semibold text-foreground">{account.login}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Password</p>
                      <p className="text-xs font-mono font-semibold text-foreground">{account.password}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Platform</p>
                      <p className="text-xs font-mono font-semibold text-foreground">{account.platform}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Leverage</p>
                      <p className="text-xs font-mono font-semibold text-foreground">{account.leverage}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  {account.status !== "failed" && (
                    <div className="space-y-2.5 mb-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Profit Target ({account.profitTarget}%)</span>
                          <span className={cn("font-medium", account.currentProfit >= account.profitTarget ? "text-[#4ade80]" : "text-foreground")}>
                            {account.currentProfit.toFixed(2)}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-bar-fill" style={{ width: `${Math.max(0, progressPct)}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Max Drawdown ({account.maxOverallDrawdown}%)</span>
                          <span className={cn("font-medium", drawdownPct > 70 ? "text-[#f87171]" : drawdownPct > 40 ? "text-[#fbbf24]" : "text-foreground")}>
                            {account.currentOverallDrawdown.toFixed(2)}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div className={cn("progress-bar-fill", drawdownPct > 70 ? "progress-bar-danger" : drawdownPct > 40 ? "progress-bar-warning" : "")} style={{ width: `${drawdownPct}%` }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {account.status === "failed" && (
                    <div className="flex items-start gap-2 text-xs text-[#f87171] bg-[rgba(248,113,113,0.08)] rounded-lg px-3 py-2.5 mb-4 border border-[rgba(248,113,113,0.15)]">
                      <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                      <span>Account breached max drawdown. Purchase a new challenge to trade again.</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/accounts/${account.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-[#a7ffeb] bg-[rgba(167,255,235,0.08)] hover:bg-[rgba(167,255,235,0.14)] py-2 rounded-lg transition-colors"
                    >
                      Details <ChevronRight size={13} />
                    </Link>
                    {account.status === "funded" && (
                      <Link
                        href="/dashboard/payouts"
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-[#001e28] bg-[#a7ffeb] hover:bg-[#7bf5d5] py-2 rounded-lg transition-colors"
                      >
                        Payout
                      </Link>
                    )}
                    {account.status === "failed" && (
                      <Link
                        href="https://noble-frontend-lilac.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-[#ffd166] bg-[rgba(255,209,102,0.1)] hover:bg-[rgba(255,209,102,0.18)] py-2 rounded-lg transition-colors"
                      >
                        Retry
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
