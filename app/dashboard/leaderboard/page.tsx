"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardShell } from "@/components/dashboard/shell"
import { mockLeaderboard, formatCurrency } from "@/lib/data"
import {
  Trophy,
  TrendingUp,
  Star,
  Globe,
  Medal,
  Crown,
  ChevronRight,
  ShoppingCart,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

const CURRENT_USER_RANK = 8

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "alltime">("monthly")
  const [tab, setTab] = useState<"all" | "naira" | "dollar">("all")

  const filtered = tab === "all"
    ? mockLeaderboard
    : mockLeaderboard.filter((e) => tab === "naira" ? e.currency === "NGN" : e.currency === "USD")

  const top3 = filtered.slice(0, 3)
  const rest = filtered.slice(3)

  const chartData = filtered.slice(0, 8).map((e) => ({
    name: e.name.split(" ")[0],
    profit: e.profit,
  }))

  return (
    <DashboardShell title="Leaderboard" subtitle="Top performing traders on Noble Funded this month">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Period + Tab filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-1 p-1 glass-card rounded-lg">
            {(["weekly", "monthly", "alltime"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                  period === p
                    ? "bg-[#a7ffeb] text-[#001e28]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p === "alltime" ? "All Time" : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 p-1 glass-card rounded-lg">
            {(["all", "naira", "dollar"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  tab === t
                    ? "bg-[rgba(167,255,235,0.15)] text-[#a7ffeb]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t === "all" ? "All" : t === "naira" ? "Naira ₦" : "Dollar $"}
              </button>
            ))}
          </div>
        </div>

        {/* Your rank banner */}
        <div className="glass-card p-4 border border-[rgba(167,255,235,0.18)] relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 60% 50%, rgba(20,101,91,0.25) 0%, transparent 70%)" }}
          />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[rgba(167,255,235,0.1)] border border-[rgba(167,255,235,0.2)] flex items-center justify-center">
                <span className="text-lg font-black text-[#a7ffeb]">#{CURRENT_USER_RANK}</span>
              </div>
              <div>
                <p className="text-xs text-[#a7ffeb] font-semibold uppercase tracking-wider">Your Current Rank</p>
                <p className="text-base font-bold text-foreground">Adebayo Ogundimu</p>
                <p className="text-xs text-muted-foreground">+14.3% profit this month</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <TrendingUp size={16} className="text-[#4ade80]" />
              <span className="text-sm font-semibold text-[#4ade80]">Climbing fast</span>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-3">
          {/* 2nd Place */}
          <div className="glass-card p-4 text-center order-1 self-end border border-[rgba(167,255,235,0.08)]">
            <div className="w-10 h-10 rounded-full bg-[rgba(148,163,184,0.15)] border-2 border-[rgba(148,163,184,0.3)] flex items-center justify-center mx-auto mb-2">
              <Medal size={18} className="text-slate-400" />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">2nd</p>
            <p className="text-sm font-bold text-foreground truncate">{top3[1]?.name || "—"}</p>
            <p className="text-lg font-black text-[#a7ffeb] mt-1">{top3[1]?.profit}%</p>
            <p className="text-xs text-muted-foreground">profit</p>
          </div>

          {/* 1st Place */}
          <div
            className="glass-card p-5 text-center order-2 border border-[rgba(255,209,102,0.25)] relative overflow-hidden"
            style={{ background: "rgba(255,209,102,0.04)" }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,209,102,0.12) 0%, transparent 60%)" }}
            />
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-[rgba(255,209,102,0.15)] border-2 border-[rgba(255,209,102,0.4)] flex items-center justify-center mx-auto mb-2">
                <Crown size={20} className="text-[#ffd166]" />
              </div>
              <p className="text-[#ffd166] text-xs font-bold uppercase tracking-wider mb-1">Champion</p>
              <p className="text-sm font-bold text-foreground truncate">{top3[0]?.name || "—"}</p>
              <p className="text-2xl font-black text-[#ffd166] mt-1">{top3[0]?.profit}%</p>
              <p className="text-xs text-muted-foreground">profit</p>
              <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#ffd166] bg-[rgba(255,209,102,0.1)] px-2 py-0.5 rounded-full">
                <Star size={9} />
                Top Trader
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="glass-card p-4 text-center order-3 self-end border border-[rgba(167,255,235,0.08)]">
            <div className="w-10 h-10 rounded-full bg-[rgba(180,107,70,0.15)] border-2 border-[rgba(180,107,70,0.3)] flex items-center justify-center mx-auto mb-2">
              <Medal size={18} className="text-amber-600" />
            </div>
            <p className="text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">3rd</p>
            <p className="text-sm font-bold text-foreground truncate">{top3[2]?.name || "—"}</p>
            <p className="text-lg font-black text-[#a7ffeb] mt-1">{top3[2]?.profit}%</p>
            <p className="text-xs text-muted-foreground">profit</p>
          </div>
        </div>

        {/* Bar Chart & Full Table */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Bar Chart */}
          <div className="lg:col-span-2 glass-card p-5">
            <h3 className="font-bold text-foreground mb-1">Top 8 Traders</h3>
            <p className="text-xs text-muted-foreground mb-4">Profit % this period</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(167,255,235,0.06)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: "#7ab8ac" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#7ab8ac" }}
                  tickLine={false}
                  axisLine={false}
                  width={52}
                />
                <Tooltip
                  contentStyle={{ background: "#002b36", border: "1px solid rgba(167,255,235,0.15)", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(v: number) => [`${v}%`, "Profit"]}
                />
                <Bar dataKey="profit" radius={[0, 6, 6, 0]}>
                  {chartData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === 0 ? "#ffd166" : i === 1 ? "#a7ffeb" : i === 2 ? "#b87333" : "#14655b"}
                      opacity={i < 3 ? 1 : 0.7}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Full Leaderboard Table */}
          <div className="lg:col-span-3 glass-card overflow-hidden">
            <div className="px-5 py-4 border-b border-[rgba(167,255,235,0.08)] flex items-center gap-2">
              <Trophy size={16} className="text-[#ffd166]" />
              <h3 className="font-bold text-foreground">Full Rankings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(167,255,235,0.06)]">
                    {["Rank", "Trader", "Account Size", "Profit %", "Type", "Badge"].map((h) => (
                      <th
                        key={h}
                        className="text-left text-xs text-muted-foreground font-medium px-4 py-3 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry) => {
                    const isCurrentUser = entry.rank === CURRENT_USER_RANK
                    return (
                      <tr
                        key={entry.rank}
                        className={cn(
                          "border-b border-[rgba(167,255,235,0.04)] transition-colors",
                          isCurrentUser
                            ? "bg-[rgba(167,255,235,0.05)] border-l-2 border-l-[#a7ffeb]"
                            : "hover:bg-[rgba(167,255,235,0.02)]"
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs"
                            style={{
                              background: entry.rank === 1
                                ? "rgba(255,209,102,0.2)"
                                : entry.rank === 2
                                ? "rgba(148,163,184,0.15)"
                                : entry.rank === 3
                                ? "rgba(180,107,70,0.15)"
                                : "rgba(167,255,235,0.06)",
                              color: entry.rank === 1 ? "#ffd166" : entry.rank === 2 ? "#94a3b8" : entry.rank === 3 ? "#b87333" : "#7ab8ac",
                            }}
                          >
                            {entry.rank}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#14655b] flex items-center justify-center text-[10px] font-bold text-[#a7ffeb] shrink-0">
                              {entry.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <p className={cn("text-sm font-semibold", isCurrentUser ? "text-[#a7ffeb]" : "text-foreground")}>
                                {entry.name}
                                {isCurrentUser && <span className="ml-1 text-[10px] text-[#a7ffeb]/70">(You)</span>}
                              </p>
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Globe size={9} />
                                {entry.country}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-foreground whitespace-nowrap">
                          {formatCurrency(entry.accountSize, entry.currency)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-[#4ade80]">+{entry.profit}%</span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "text-xs font-semibold px-2 py-0.5 rounded-full",
                              entry.currency === "NGN" ? "badge-naira" : "badge-dollar"
                            )}
                          >
                            {entry.currency === "NGN" ? "₦ Naira" : "$ Dollar"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {entry.badge === "top" && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-[#ffd166] bg-[rgba(255,209,102,0.1)] px-2 py-0.5 rounded-full w-fit">
                              <Crown size={9} /> Top
                            </span>
                          )}
                          {entry.badge === "rising" && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-[#4ade80] bg-[rgba(74,222,128,0.1)] px-2 py-0.5 rounded-full w-fit">
                              <TrendingUp size={9} /> Rising
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CTA to get on the leaderboard */}
        <div
          className="glass-card p-6 border border-[rgba(167,255,235,0.15)] text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(0,43,54,0.8) 0%, rgba(20,101,91,0.2) 100%)" }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(167,255,235,0.06) 0%, transparent 60%)" }}
          />
          <div className="relative">
            <Trophy size={32} className="text-[#ffd166] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-foreground text-balance">Want to climb the leaderboard?</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Trade consistently, protect your drawdown, and hit your profit targets to rank higher.
            </p>
            <Link
              href="https://noble-frontend-lilac.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-[#001e28] bg-[#a7ffeb] hover:bg-[#7bf5d5] transition-all"
            >
              <ShoppingCart size={15} />
              Get a New Challenge
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
