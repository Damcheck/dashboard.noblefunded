"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { mockAffiliate, formatCurrency } from "@/lib/data"
import {
  Copy,
  CheckCircle2,
  Users,
  DollarSign,
  Link2,
  ExternalLink,
  Clock,
  Zap,
  Gift,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AffiliatePage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const activeReferrals = mockAffiliate.referrals.filter(r => r.status === "active")
  const pendingReferrals = mockAffiliate.referrals.filter(r => r.status === "pending")

  return (
    <DashboardShell title="Affiliate Program" subtitle="Refer traders and earn commissions on every challenge purchase">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Hero Banner */}
        <div className="glass-card p-6 border border-[rgba(167,255,235,0.15)] relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(20,101,91,0.3) 0%, transparent 60%)" }} />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-[#a7ffeb]" />
                <span className="text-xs font-semibold text-[#a7ffeb] uppercase tracking-wider">Affiliate Program</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground text-balance">Earn Up To ₦15,000 Per Referral</h2>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-md">Share your unique referral link. Earn a commission every time someone you refer purchases a trading challenge.</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-3xl font-black text-[#a7ffeb]">{formatCurrency(mockAffiliate.totalEarnings, "NGN")}</p>
              <p className="text-xs text-muted-foreground">Total Commissions Earned</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Referrals", value: mockAffiliate.totalReferrals, icon: Users, color: "text-foreground" },
            { label: "Active Referrals", value: activeReferrals.length, icon: Zap, color: "text-[#4ade80]" },
            { label: "Pending", value: pendingReferrals.length, icon: Clock, color: "text-[#fbbf24]" },
            { label: "Commission Rate", value: "10%", icon: DollarSign, color: "text-[#a7ffeb]" },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4">
              <div className="p-2 rounded-lg bg-[rgba(167,255,235,0.06)] w-fit mb-3">
                <s.icon className="w-4 h-4 text-muted-foreground" size={16} />
              </div>
              <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Referral details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Referral Code */}
            <div className="glass-card p-5">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Link2 size={16} className="text-[#a7ffeb]" />
                Your Referral Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Referral Code</p>
                  <div className="flex items-center gap-2 bg-[rgba(167,255,235,0.05)] border border-[rgba(167,255,235,0.12)] rounded-xl px-4 py-3">
                    <span className="font-mono font-bold text-[#a7ffeb] flex-1">{mockAffiliate.referralCode}</span>
                    <button onClick={() => copy(mockAffiliate.referralCode, "code")} className="text-muted-foreground hover:text-[#a7ffeb] transition-colors shrink-0">
                      {copied === "code" ? <CheckCircle2 size={15} className="text-[#4ade80]" /> : <Copy size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Referral Link</p>
                  <div className="flex items-center gap-2 bg-[rgba(167,255,235,0.05)] border border-[rgba(167,255,235,0.12)] rounded-xl px-4 py-3">
                    <span className="font-mono text-xs text-muted-foreground flex-1 truncate">{mockAffiliate.referralLink}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => copy(mockAffiliate.referralLink, "link")} className="text-muted-foreground hover:text-[#a7ffeb] transition-colors">
                        {copied === "link" ? <CheckCircle2 size={15} className="text-[#4ade80]" /> : <Copy size={15} />}
                      </button>
                      <a href={mockAffiliate.referralLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#a7ffeb] transition-colors">
                        <ExternalLink size={15} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2.5">Share via</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "WhatsApp", color: "bg-[rgba(37,211,102,0.12)] text-[#25d366] hover:bg-[rgba(37,211,102,0.2)]" },
                    { label: "Telegram", color: "bg-[rgba(0,136,204,0.12)] text-[#0088cc] hover:bg-[rgba(0,136,204,0.2)]" },
                    { label: "Twitter/X", color: "bg-[rgba(167,255,235,0.08)] text-[#a7ffeb] hover:bg-[rgba(167,255,235,0.15)]" },
                  ].map((s) => (
                    <button key={s.label} className={cn("py-2 rounded-lg text-xs font-medium transition-all border border-[rgba(167,255,235,0.08)]", s.color)}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="glass-card p-5">
              <h3 className="font-bold text-foreground mb-4">How It Works</h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Share Your Link", desc: "Share your referral link on WhatsApp, Telegram, Twitter or any platform." },
                  { step: "2", title: "They Purchase", desc: "Your referral buys any Noble Funded challenge using your link or code." },
                  { step: "3", title: "You Earn", desc: "You receive 10% commission (up to ₦15,000) within 24 hours of their purchase." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[rgba(167,255,235,0.12)] flex items-center justify-center text-xs font-bold text-[#a7ffeb] shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Commission tiers */}
            <div className="glass-card p-5">
              <h3 className="font-bold text-foreground mb-4">Commission Tiers</h3>
              <div className="space-y-2">
                {[
                  { tier: "₦10K Challenge", commission: "₦1,000" },
                  { tier: "₦25K Challenge", commission: "₦2,500" },
                  { tier: "₦50K Challenge", commission: "₦5,000" },
                  { tier: "₦100K Challenge", commission: "₦10,000" },
                  { tier: "₦500K+ Challenge", commission: "₦15,000" },
                ].map((t) => (
                  <div key={t.tier} className="flex justify-between items-center py-2 border-b border-[rgba(167,255,235,0.05)] last:border-0">
                    <span className="text-sm text-muted-foreground">{t.tier}</span>
                    <span className="text-sm font-bold text-[#a7ffeb]">{t.commission}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Referrals table */}
          <div className="lg:col-span-3">
            <div className="glass-card overflow-hidden">
              <div className="px-5 py-4 border-b border-[rgba(167,255,235,0.08)] flex items-center justify-between">
                <h3 className="font-bold text-foreground">My Referrals</h3>
                <span className="text-xs text-muted-foreground">{mockAffiliate.referrals.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[rgba(167,255,235,0.06)]">
                      {["Trader", "Email", "Joined", "Status", "Commission"].map((h) => (
                        <th key={h} className="text-left text-xs text-muted-foreground font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockAffiliate.referrals.map((r) => (
                      <tr key={r.id} className="border-b border-[rgba(167,255,235,0.04)] hover:bg-[rgba(167,255,235,0.02)] transition-colors">
                        <td className="px-4 py-3 font-semibold text-foreground">{r.name}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{r.email}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(r.joinedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full",
                            r.status === "active" ? "badge-active" :
                            r.status === "converted" ? "badge-dollar" :
                            "badge-challenge"
                          )}>
                            {r.status === "active" ? "Active" : r.status === "converted" ? "Purchased" : "Pending"}
                          </span>
                        </td>
                        <td className={cn("px-4 py-3 font-bold", r.commission > 0 ? "text-[#4ade80]" : "text-muted-foreground")}>
                          {r.commission > 0 ? formatCurrency(r.commission, r.currency) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Total */}
              <div className="px-5 py-3 border-t border-[rgba(167,255,235,0.08)] flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Earned</span>
                <span className="font-bold text-[#4ade80] text-lg">{formatCurrency(mockAffiliate.totalEarnings, "NGN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
