"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!form.email || !form.password) {
      setError("Please enter your email and password.")
      return
    }
    setLoading(true)
    // Simulate auth — in production this calls your backend
    setTimeout(() => {
      setLoading(false)
      window.location.href = "/dashboard"
    }, 1200)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(20,101,91,0.2) 0%, #001e28 50%)" }}
    >
      {/* Background grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(167,255,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,255,235,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Noble-OEj3GEQadTCZw2V91d7wOoVnrqoBG3.svg"
              alt="Noble Funded"
              width={160}
              height={36}
              className="h-9 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
          <h1 className="text-2xl font-black text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your Noble Funded dashboard</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 noble-glow-strong">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 text-sm text-[#f87171] bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.2)] rounded-xl px-4 py-3">
                <AlertCircle size={15} className="shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="trader@example.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full bg-[rgba(167,255,235,0.05)] border border-[rgba(167,255,235,0.12)] rounded-xl pl-10 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[rgba(167,255,235,0.4)] focus:bg-[rgba(167,255,235,0.07)] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-muted-foreground">Password</label>
                <Link href="#" className="text-xs text-[#a7ffeb] hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full bg-[rgba(167,255,235,0.05)] border border-[rgba(167,255,235,0.12)] rounded-xl pl-10 pr-11 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[rgba(167,255,235,0.4)] focus:bg-[rgba(167,255,235,0.07)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all",
                loading
                  ? "bg-[rgba(167,255,235,0.3)] text-[#001e28] cursor-not-allowed"
                  : "bg-[#a7ffeb] text-[#001e28] hover:bg-[#7bf5d5] hover:shadow-lg hover:shadow-[rgba(167,255,235,0.2)] active:scale-[0.98]"
              )}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[rgba(167,255,235,0.08)] text-center">
            <p className="text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link
                href="https://noble-frontend-lilac.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#a7ffeb] font-semibold hover:underline"
              >
                Get Funded Today
              </Link>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to Noble Funded&apos;s{" "}
          <Link href="https://noble-frontend-lilac.vercel.app" className="text-[#a7ffeb] hover:underline">Terms of Service</Link>
          {" & "}
          <Link href="https://noble-frontend-lilac.vercel.app" className="text-[#a7ffeb] hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
