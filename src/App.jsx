import { useEffect, useMemo, useRef, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Droplets, Shield, Clock, Check, Car, Menu, X } from 'lucide-react'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const [mobileOpen, setMobileOpen] = useState(false)
  const [plans, setPlans] = useState([])
  const [billing, setBilling] = useState('monthly') // 'monthly' | 'yearly'
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [leadLoading, setLeadLoading] = useState(false)
  const [leadSuccess, setLeadSuccess] = useState(null)

  const [subscribeOpen, setSubscribeOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)

  const heroRef = useRef(null)
  const plansRef = useRef(null)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true)
        const res = await fetch(`${baseUrl}/plans`)
        const data = await res.json()
        setPlans(data)
      } catch (e) {
        console.error('Failed to load plans', e)
      } finally {
        setLoadingPlans(false)
      }
    }
    fetchPlans()
  }, [baseUrl])

  const openSubscribe = (plan) => {
    setSelectedPlan(plan)
    setSubscribeOpen(true)
  }

  const features = useMemo(
    () => [
      {
        title: 'Touchless Shine',
        desc: 'Modern tunnels with foam cannons and microfiber finish.',
        icon: Sparkles,
      },
      {
        title: 'Eco Smart',
        desc: '80% less water with recycled systems and safe soaps.',
        icon: Droplets,
      },
      {
        title: 'Protected',
        desc: 'Ceramic coat and UV protection in premium tiers.',
        icon: Shield,
      },
      {
        title: 'Anytime Access',
        desc: 'Scan-and-wash in under 5 minutes at any location.',
        icon: Clock,
      },
    ],
    []
  )

  const handleLeadSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      name: form.get('name'),
      email: form.get('email'),
      phone: form.get('phone'),
      message: form.get('message'),
    }
    try {
      setLeadLoading(true)
      setLeadSuccess(null)
      const res = await fetch(`${baseUrl}/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to submit lead')
      setLeadSuccess('Thanks! We\'ll be in touch shortly.')
      e.currentTarget.reset()
    } catch (err) {
      setLeadSuccess('We\'re sorry, something went wrong. Please try again.')
    } finally {
      setLeadLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-semibold tracking-tight">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 grid place-items-center">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span>Mintly Wash</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-200">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#plans" className="hover:text-white">Plans</a>
            <a href="#contact" className="hover:text-white">Contact</a>
            <button onClick={() => plansRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/10">
              Get Started
            </button>
          </nav>
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-lg bg-white/10 border border-white/10">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-950/80">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="mx-4 mt-24 rounded-2xl bg-slate-900 border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg bg-white/10 border border-white/10">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid gap-2">
                <a href="#features" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/5">Features</a>
                <a href="#plans" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/5">Plans</a>
                <a href="#contact" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/5">Contact</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero with Spline */}
      <section ref={heroRef} className="relative min-h-[90vh] pt-16 overflow-hidden">
        <div className="absolute inset-0">
          <Spline
            scene="https://prod.spline.design/8fw9Z-c-rqW3nWBN/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        {/* Gradient overlays that don't block interaction */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/40 to-slate-950" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center py-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
          >
            Unlimited car washes. One membership.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="mt-6 max-w-2xl text-slate-200"
          >
            Join Mintly Wash and cruise through our modern, touchless tunnels. Scan, wash, and go at any of our franchise locations.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1 }} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => plansRef.current?.scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30">
              View Plans
            </button>
            <a href="#contact" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10">
              Contact Sales
            </a>
          </motion.div>
        </div>
      </section>

      {/* Feature grid */}
      <section id="features" className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 grid place-items-center mb-4">
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{f.title}</h3>
                <p className="text-slate-300 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Plans */}
      <section id="plans" ref={plansRef} className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">Membership Plans</h2>
              <p className="text-slate-300 mt-2">Pay monthly or save with yearly billing.</p>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
              <button onClick={() => setBilling('monthly')} className={`px-3 py-1.5 rounded-lg text-sm ${billing==='monthly' ? 'bg-cyan-500 text-slate-900' : 'text-white/80'}`}>Monthly</button>
              <button onClick={() => setBilling('yearly')} className={`px-3 py-1.5 rounded-lg text-sm ${billing==='yearly' ? 'bg-cyan-500 text-slate-900' : 'text-white/80'}`}>Yearly</button>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {loadingPlans ? (
              [0,1,2].map(i => (
                <div key={i} className="h-64 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
              ))
            ) : (
              plans.map((plan) => (
                <div key={plan.name} className={`relative rounded-2xl border ${plan.popular ? 'border-cyan-400/40' : 'border-white/10'} bg-white/5 p-6 flex flex-col`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500 text-slate-900 border border-cyan-300">Popular</div>
                  )}
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-slate-300 text-sm mt-1">{plan.description}</p>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold tracking-tight">${billing==='monthly' ? plan.price_monthly : plan.price_yearly}</span>
                    <span className="text-slate-400">/{billing==='monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  <ul className="mt-6 space-y-2 text-sm text-slate-200">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" />Up to {plan.washes_per_month} washes / month</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" />Access to all franchise locations</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" />Member-only fast lanes</li>
                  </ul>
                  <div className="mt-6">
                    <button onClick={() => openSubscribe(plan)} className="w-full px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold">Choose {plan.name}</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Lead capture */}
      <section id="contact" className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold">Become a member or franchise partner</h3>
              <p className="text-slate-300 mt-3">Tell us a bit about you and we\'ll reach out with next steps. No spam—just clean cars.</p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-300">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-semibold">200k+</div>
                  Happy Members
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-semibold">120+</div>
                  Locations
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-semibold">5 min</div>
                  Avg. Wash Time
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-semibold">24/7</div>
                  Access
                </div>
              </div>
            </div>

            <form onSubmit={handleLeadSubmit} className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300">Name</label>
                  <input required name="name" className="mt-1 w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Alex Johnson" />
                </div>
                <div>
                  <label className="text-sm text-slate-300">Email</label>
                  <input required type="email" name="email" className="mt-1 w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500" placeholder="alex@email.com" />
                </div>
                <div>
                  <label className="text-sm text-slate-300">Phone</label>
                  <input name="phone" className="mt-1 w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500" placeholder="(555) 555-5555" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-slate-300">Message</label>
                  <textarea name="message" rows={3} className="mt-1 w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500" placeholder="I\'m interested in a franchise location in..." />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-slate-400">We\'ll get back within 24 hours.</p>
                <button disabled={leadLoading} className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold disabled:opacity-60">
                  {leadLoading ? 'Submitting...' : 'Send'}
                </button>
              </div>
              {leadSuccess && (
                <p className="mt-3 text-sm text-cyan-300">{leadSuccess}</p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-sm text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 grid place-items-center">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span>© {new Date().getFullYear()} Mintly Wash</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#plans" className="hover:text-white">Plans</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>

      {/* Subscribe Modal */}
      <SubscribeModal
        open={subscribeOpen}
        onClose={() => setSubscribeOpen(false)}
        baseUrl={baseUrl}
        plan={selectedPlan}
        billing={billing}
        submitting={submitting}
        setSubmitting={setSubmitting}
        submitResult={submitResult}
        setSubmitResult={setSubmitResult}
      />
    </div>
  )
}

function SubscribeModal({ open, onClose, baseUrl, plan, billing, submitting, setSubmitting, submitResult, setSubmitResult }) {
  useEffect(() => {
    if (!open) setSubmitResult(null)
  }, [open, setSubmitResult])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!plan) return
    const form = new FormData(e.currentTarget)
    const payload = {
      customer_name: form.get('name'),
      email: form.get('email'),
      phone: form.get('phone'),
      vehicle: form.get('vehicle'),
      plan_name: plan.name,
      billing_cycle: billing,
      status: 'pending',
    }
    try {
      setSubmitting(true)
      const res = await fetch(`${baseUrl}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Subscription failed')
      setSubmitResult({ ok: true, message: 'Subscription created! Check your email to activate.' })
      e.currentTarget.reset()
    } catch (err) {
      setSubmitResult({ ok: false, message: 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-950/80">
          <div className="min-h-full w-full flex items-center justify-center p-4">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="w-full max-w-lg rounded-2xl bg-slate-900 border border-white/10 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xl font-semibold">{plan ? `Join ${plan.name}` : 'Join Plan'}</h4>
                  {plan && (
                    <p className="text-slate-300 text-sm mt-1">{plan.description}</p>
                  )}
                </div>
                <button onClick={onClose} className="p-2 rounded-lg bg-white/10 border border-white/10"><X className="h-5 w-5" /></button>
              </div>

              {plan && (
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold">${billing==='monthly' ? plan.price_monthly : plan.price_yearly}</span>
                  <span className="text-slate-400">/{billing==='monthly' ? 'mo' : 'yr'}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-300">Full name</label>
                    <input required name="name" className="mt-1 w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Alex Johnson" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300">Email</label>
                    <input required type="email" name="email" className="mt-1 w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500" placeholder="alex@email.com" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-300">Phone</label>
                    <input name="phone" className="mt-1 w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500" placeholder="(555) 555-5555" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300">Vehicle</label>
                    <input name="vehicle" className="mt-1 w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Tesla Model 3" />
                  </div>
                </div>
                <button disabled={submitting} className="mt-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold disabled:opacity-60">
                  {submitting ? 'Processing…' : 'Start Membership'}
                </button>

                {submitResult && (
                  <div className={`text-sm mt-2 ${submitResult.ok ? 'text-cyan-300' : 'text-red-300'}`}>{submitResult.message}</div>
                )}
              </form>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App
