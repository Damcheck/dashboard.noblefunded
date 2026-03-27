"use client"

import Link from "next/link"
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Trophy,
  Zap,
  ShoppingCart,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts"
import {
  mockAccounts,
  mockUser,
  mockPayouts,
  formatCurrency,
  getStatusLabel,
  getStatusClass,
  generateEquityCurve,
  weeklyProfitData,
  monthlyProfitData,
} from "@/lib/data"
import { cn } from "@/lib/utils"

const equityData = generateEquityCurve(30, 100000, 0.025)

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  color = "mint",
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  trend?: "up" | "down" | "neutral"
  color?: "mint" | "naira" | "danger" | "warning"
}) {
  const colorMap = {
    mint: { icon: "text-[#a7ffeb]", bg: "bg-[rgba(167,255,235,0.08)]", border: "border-[rgba(167,255,235,0.12)]" },
    naira: { icon: "text-[#ffd166]", bg: "bg-[rgba(255,209,102,0.08)]", border: "border-[rgba(255,209,102,0.15)]" },
    danger: { icon: "text-[#f87171]", bg: "bg-[rgba(248,113,113,0.08)]", border: "border-[rgba(248,113,113,0.15)]" },
    warning: { icon: "text-[#fbbf24]", bg: "bg-[rgba(251,191,36,0.08)]", border: "border-[rgba(251,191,36,0.15)]" },
  }
  const c = colorMap[color]

  return (
    <div className={cn("glass-card p-5 stat-card transition-all duration-200 hover:translate-y-[-2px]", c.border)}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2 rounded-lg", c.bg)}>
          <Icon className={cn("w-4.5 h-4.5", c.icon)} size={18} />
        </div>
        {trend && (
          <span className={cn("flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded",
            trend === "up" ? "text-[#4ade80] bg-[rgba(74,222,128,0.1)]" :
            trend === "down" ? "text-[#f87171] bg-[rgba(248,113,113,0.1)]" :
            "text-muted-foreground bg-[rgba(167,255,235,0.06)]"
          )}>
            {trend === "up" ? <TrendingUp size={11} /> : trend === "down" ? <TrendingDown size={11} /> : null}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  )
}

function AccountCard({ account }: { account: typeof mockAccounts[0] }) {
  const progressPct = Math.min(100, (account.currentProfit / account.profitTarget) * 100)
  const drawdownPct = Math.min(100, (account.currentOverallDrawdown / account.maxOverallDrawdown) * 100)
  const isNaira = account.currency === "NGN"

  return (
    <div className="glass-card p-5 hover:border-[rgba(167,255,235,0.2)] transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", isNaira ? "badge-naira" : "badge-dollar")}>
              {isNaira ? "₦ NAIRA" : "$ DOLLAR"}
            </span>
            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", getStatusClass(account.status))}>
              {account.status === "challenge_phase1" ? "Phase 1" : account.status === "challenge_phase2" ? "Phase 2" : getStatusLabel(account.status)}
            </span>
          </div>
          <p className="font-bold text-foreground">{account.accountNumber}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{account.platform} · {account.server}</p>
        </div>
        <p className="text-right">
          <span className="text-lg font-bold text-foreground">{formatCurrency(account.balance, account.currency)}</span>
          <br />
          <span className={cn("text-xs font-medium", account.currentProfit >= 0 ? "text-[#4ade80]" : "text-[#f87171]")}>
            {account.currentProfit >= 0 ? "+" : ""}{account.currentProfit.toFixed(2)}%
          </span>
        </p>
      </div>

      {account.status !== "failed" && (
        <div className="space-y-2.5">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Profit Target</span>
              <span className="font-medium text-foreground">{account.currentProfit.toFixed(2)}% / {account.profitTarget}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.max(0, progressPct)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Drawdown Used</span>
              <span className={cn("font-medium", drawdownPct > 70 ? "text-[#f87171]" : drawdownPct > 40 ? "text-[#fbbf24]" : "text-foreground")}>
                {account.currentOverallDrawdown.toFixed(2)}% / {account.maxOverallDrawdown}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className={cn("progress-bar-fill", drawdownPct > 70 ? "progress-bar-danger" : drawdownPct > 40 ? "progress-bar-warning" : "")}
                style={{ width: `${drawdownPct}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {account.status === "failed" && (
        <div className="flex items-center gap-2 text-xs text-[#f87171] bg-[rgba(248,113,113,0.08)] rounded-lg px-3 py-2 mt-2">
          <AlertTriangle size={14} />
          <span>Account failed — Max drawdown exceeded. Consider purchasing a new challenge.</span>
        </div>
      )}

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[rgba(167,255,235,0.06)]">
        <Link
          href={`/dashboard/accounts/${account.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-[#a7ffeb] bg-[rgba(167,255,235,0.08)] hover:bg-[rgba(167,255,235,0.14)] py-2 rounded-lg transition-colors"
        >
          View Details <ChevronRight size={13} />
        </Link>
        {account.status === "funded" && (
          <Link
            href="/dashboard/payouts"
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-[#001e28] bg-[#a7ffeb] hover:bg-[#7bf5d5] py-2 rounded-lg transition-colors"
          >
            Request Payout
          </Link>
        )}
      </div>
    </div>
  )
}

export function OverviewContent() {
  const totalPaidNGN = mockPayouts.filter(p => p.status === "paid" && p.currency === "NGN").reduce((s, p) => s + p.amount, 0)
  const activeAccounts = mockAccounts.filter(a => a.status !== "failed")
  const fundedAccounts = mockAccounts.filter(a => a.status === "funded")

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="glass-card p-5 border border-[rgba(167,255,235,0.15)] bg-gradient-to-r from-[rgba(20,101,91,0.25)] to-[rgba(0,43,54,0.6)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #a7ffeb 0%, transparent 60%)" }} />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#a7ffeb] font-semibold uppercase tracking-wider mb-1">Welcome back</p>
            <h2 className="text-xl font-bold text-foreground text-balance">Good morning, {mockUser.name.split(" ")[0]}</h2>
            <p className="text-sm text-muted-foreground mt-1">You have <span className="text-foreground font-semibold">{activeAccounts.length} active accounts</span> and <span className="text-[#4ade80] font-semibold">{fundedAccounts.length} funded account</span>.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="https://noble-frontend-lilac.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#001e28] bg-[#a7ffeb] hover:bg-[#7bf5d5] transition-all duration-200 shadow-lg"
            >
              <ShoppingCart size={15} />
              Buy New Challenge
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Payouts"
          value={formatCurrency(totalPaidNGN, "NGN")}
          sub="Across all accounts"
          icon={DollarSign}
          trend="up"
          color="mint"
        />
        <StatCard
          label="Active Accounts"
          value={String(activeAccounts.length)}
          sub={`${mockAccounts.length} total accounts`}
          icon={Wallet}
          trend="neutral"
          color="naira"
        />
        <StatCard
          label="Best Profit"
          value="+7.5%"
          sub="NF-NG-100K (Funded)"
          icon={TrendingUp}
          trend="up"
          color="mint"
        />
        <StatCard
          label="Profit Split"
          value="80%"
          sub="Your take from profits"
          icon={Trophy}
          trend="up"
          color="naira"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Equity Curve */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Equity Curve</h3>
              <p className="text-xs text-muted-foreground">NF-NG-100K (Funded) · Last 30 days</p>
            </div>
            <span className="text-xs font-medium text-[#4ade80] bg-[rgba(74,222,128,0.1)] px-2 py-1 rounded-lg">+7.5%</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={equityData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a7ffeb" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#a7ffeb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(167,255,235,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#7ab8ac" }} tickLine={false} axisLine={false} interval={6} />
              <YAxis tick={{ fontSize: 10, fill: "#7ab8ac" }} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#002b36", border: "1px solid rgba(167,255,235,0.15)", borderRadius: "8px", fontSize: "12px" }}
                labelStyle={{ color: "#a7ffeb" }}
                formatter={(value: number) => [`₦${value.toLocaleString()}`, "Balance"]}
              />
              <Area type="monotone" dataKey="balance" stroke="#a7ffeb" strokeWidth={2} fill="url(#equityGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly P&L */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Monthly P&L</h3>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyProfitData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(167,255,235,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#7ab8ac" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#7ab8ac" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ background: "#002b36", border: "1px solid rgba(167,255,235,0.15)", borderRadius: "8px", fontSize: "12px" }}
                formatter={(value: number) => [`${value}%`, "P&L"]}
              />
              <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                {monthlyProfitData.map((entry, index) => (
                  <Cell key={index} fill={entry.profit >= 0 ? "#14655b" : "#b91c1c"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accounts Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">My Accounts</h3>
          <Link href="/dashboard/accounts" className="text-xs text-[#a7ffeb] hover:text-[#7bf5d5] flex items-center gap-1">
            View All <ChevronRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
          {mockAccounts.slice(0, 4).map((acc) => (
            <AccountCard key={acc.id} account={acc} />
          ))}
        </div>
      </div>

      {/* Bottom Row: Recent Payouts + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Payouts */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Payouts</h3>
            <Link href="/dashboard/payouts" className="text-xs text-[#a7ffeb] flex items-center gap-1">
              View All <ChevronRight size={13} />
            </Link>
          </div>
          <div className="space-y-3">
            {mockPayouts.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-[rgba(167,255,235,0.06)] last:border-0">
                <div className="flex items-center gap-3">
                  <div className={cn("p-1.5 rounded-lg", p.status === "paid" ? "bg-[rgba(74,222,128,0.1)]" : p.status === "processing" ? "bg-[rgba(251,191,36,0.1)]" : "bg-[rgba(167,255,235,0.08)]")}>
                    {p.status === "paid" ? <CheckCircle2 size={16} className="text-[#4ade80]" /> : p.status === "processing" ? <Clock size={16} className="text-[#fbbf24]" /> : <ArrowUpRight size={16} className="text-[#a7ffeb]" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{formatCurrency(p.amount, p.currency)}</p>
                    <p className="text-xs text-muted-foreground">{p.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", p.status === "paid" ? "badge-active" : p.status === "processing" ? "badge-challenge" : "badge-dollar")}>
                    {p.status === "paid" ? "Paid" : p.status === "processing" ? "Processing" : "Pending"}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">{new Date(p.requestedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: "/dashboard/payouts", icon: DollarSign, label: "Request Payout", desc: "Withdraw your profits", color: "text-[#a7ffeb]", bg: "bg-[rgba(167,255,235,0.08)]" },
              { href: "https://noble-frontend-lilac.vercel.app", icon: ShoppingCart, label: "Buy Challenge", desc: "Start a new account", color: "text-[#ffd166]", bg: "bg-[rgba(255,209,102,0.08)]", external: true },
              { href: "/dashboard/affiliate", icon: Zap, label: "Refer & Earn", desc: "Share your code", color: "text-[#4ade80]", bg: "bg-[rgba(74,222,128,0.08)]" },
              { href: "/dashboard/statistics", icon: TrendingUp, label: "View Stats", desc: "Analyse your trades", color: "text-[#fbbf24]", bg: "bg-[rgba(251,191,36,0.08)]" },
            ].map((action, i) => (
              <Link
                key={i}
                href={action.href}
                target={action.external ? "_blank" : undefined}
                rel={action.external ? "noopener noreferrer" : undefined}
                className="glass p-4 rounded-xl hover:border-[rgba(167,255,235,0.2)] transition-all duration-200 hover:translate-y-[-2px] group"
              >
                <div className={cn("p-2 rounded-lg w-fit mb-2", action.bg)}>
                  <action.icon className={cn("w-4.5 h-4.5", action.color)} size={18} />
                </div>
                <p className="text-sm font-semibold text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
