import { motion } from 'framer-motion';
import { Activity, BarChart3, BellRing, Compass, Layers3, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import SectionHeading from '../components/SectionHeading';
import PremiumCard from '../components/PremiumCard';

const featureCards = [
  {
    title: 'Signal Alerts',
    description: 'Receive fast signal updates and structured market notes through a premium feed.',
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: 'Market Analysis',
    description: 'Review focused analysis, market context, and clean trading insights in one view.',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: 'Secure Dashboard',
    description: 'Access premium tools through a protected dashboard built for clarity and speed.',
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: '24/7 Support',
    description: 'Stay connected with responsive support and activation guidance around the clock.',
    icon: <BellRing className="h-5 w-5" />,
  },
];

const whyChooseUs = [
  {
    title: 'Premium signal access',
    description: 'Structured updates and a professional experience designed for Deriv synthetic indices traders.',
    icon: <Compass className="h-5 w-5" />,
  },
  {
    title: 'Members dashboard',
    description: 'Track live signal history, market status, and premium insights from one modern workspace.',
    icon: <Layers3 className="h-5 w-5" />,
  },
];

const howItWorks = [
  {
    title: 'Subscribe',
    description: 'Unlock Premium Access for $150 and join the private members dashboard.',
  },
  {
    title: 'Activate',
    description: 'Send your payment confirmation via WhatsApp and receive instant activation support.',
  },
  {
    title: 'Trade with clarity',
    description: 'Review signal updates, market context, and analysis in a polished dashboard.',
  },
];

const faqItems = [
  {
    question: 'What does Premium Access include?',
    answer: 'It includes premium signal access, market analysis, members dashboard access, 24/7 support, and instant activation after payment.',
  },
  {
    question: 'How do I activate my account?',
    answer: 'After completing your payment, send your payment confirmation via WhatsApp and your Premium account will be activated.',
  },
  {
    question: 'Is this a guaranteed profit service?',
    answer: 'No. The service is designed to provide premium signal information and analysis tools, not guaranteed profits or outcomes.',
  },
];

const signalCards = [
  { label: 'Boom 1000', value: 'Bullish bias', status: 'Live' },
  { label: 'Crash 500', value: 'Momentum watch', status: 'Monitor' },
  { label: 'Step Index', value: 'Range setup', status: 'Watch' },
];

const previewMatches = [
  { title: 'Volatility 10 (1s) Index', time: '01:00' },
  { title: 'Volatility 25 (1s) Index', time: '01:15' },
  { title: 'Volatility 50 (1s) Index', time: '01:30' },
  { title: 'Volatility 75 (1s) Index', time: '01:45' },
  { title: 'Volatility 100 (1s) Index', time: '02:00' },
  { title: 'Volatility 10 Index', time: '02:15' },
  { title: 'Volatility 25 Index', time: '02:30' },
  { title: 'Volatility 50 Index', time: '02:45' },
  { title: 'Volatility 75 Index', time: '03:00' },
  { title: 'Volatility 100 Index', time: '03:15' },
  { title: 'Boom 500', time: '03:30' },
  { title: 'Boom 1000', time: '03:45' },
  { title: 'Crash 500', time: '04:00' },
  { title: 'Crash 1000', time: '04:15' },
  { title: 'Step Index', time: '04:30' },
];

function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060B14] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.16),_transparent_28%),linear-gradient(135deg,_#060B14_0%,_#0B1220_40%,_#090D16_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(circle,_rgba(56,189,248,0.18),_transparent_55%)] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
        <header className="sticky top-4 z-20 mb-8 rounded-full border border-white/10 bg-[#0B1220]/80 px-4 py-3 shadow-[0_20px_70px_rgba(2,6,23,0.35)] backdrop-blur-xl sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-400/30 bg-sky-500/10 text-sm font-semibold text-sky-200">
                MT
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Matches Tool</p>
                <p className="text-xs text-slate-400">Premium match intelligence</p>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <a href="#features" className="transition hover:text-white">Features</a>
              <a href="#pricing" className="transition hover:text-white">Pricing</a>
              <a href="#how-it-works" className="transition hover:text-white">How It Works</a>
              <a href="#faq" className="transition hover:text-white">FAQ</a>
              <a href="#contact" className="transition hover:text-white">Contact</a>
              <Link to="/login" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10">Login</Link>
            </nav>
          </div>
        </header>

        <section id="top" className="grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-2 text-sm text-sky-200">
              Premium Deriv synthetic index access
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Premium Deriv Synthetic Index Signals
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Get fast signal updates, detailed market analysis, and premium trading tools through one secure dashboard.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#pricing" className="inline-flex items-center justify-center rounded-full bg-sky-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(56,189,248,0.25)] transition hover:-translate-y-0.5 hover:bg-sky-400">
                Unlock Premium Access – $150
              </a>
              <a href="#features" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/10">
                View Features
              </a>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { value: '30s', label: 'Refresh cadence' },
                { value: '24/7', label: 'Live access' },
                { value: '100%', label: 'Private dashboard' },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                  <p className="text-xl font-semibold text-white">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="rounded-[2rem] border border-white/10 bg-[#0D1424]/90 p-5 shadow-[0_30px_100px_rgba(2,6,23,0.45)] backdrop-blur-xl">
            <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-slate-900 via-[#0F172A] to-[#111827] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Premium preview</p>
                  <p className="mt-2 text-xl font-semibold text-white">Upcoming match board</p>
                </div>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">Live</span>
              </div>
              <div className="mt-6 max-h-[24rem] space-y-3 overflow-y-auto pr-1">
                {previewMatches.map((match) => (
                  <div key={match.title} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-white/10">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                          <p className="text-sm font-semibold text-white">{match.title}</p>
                        </div>
                        <p className="mt-1 text-sm text-slate-400">Synthetic Index</p>
                      </div>
                      <div className="rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-sm text-sky-200">
                        {match.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-[1.25rem] border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                Premium signal content remains locked until an active subscription is confirmed.
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="py-16">
          <SectionHeading
            eyebrow="Features"
            title="A focused experience for premium trading signals."
            description="Every part of the interface is designed to feel calm, modern, and trustworthy."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((card) => (
              <PremiumCard key={card.title} title={card.title} description={card.description} icon={card.icon} />
            ))}
          </div>
        </section>

        <section id="dashboard-preview" className="py-16">
          <SectionHeading eyebrow="Dashboard Preview" title="A premium workspace for signal review and monitoring." description="The dashboard blends modern charts, signal cards, and protected premium content into a clean workspace." />
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-white/10 bg-[#0D1424]/85 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Signal hub</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Live market overview</h3>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200">
                  Online
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {signalCards.map((card) => (
                  <div key={card.label} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-white">{card.label}</p>
                    <p className="mt-2 text-sm text-slate-400">{card.value}</p>
                    <div className="mt-3 inline-flex rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-xs text-sky-200">{card.status}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-gradient-to-br from-sky-500/10 to-violet-500/10 p-5">
                <div className="flex items-center gap-2 text-sky-200">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-semibold">Market status</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">Momentum remains active across major synthetic index windows with fresh updates arriving in short intervals.</p>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-[#0D1424]/85 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Members view</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Protected premium content</h3>
                </div>
                <div className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-sm text-amber-200">Locked</div>
              </div>
              <div className="mt-6 space-y-3">
                {[{ title: 'Daily analysis', detail: 'Private market breakdown for premium subscribers' }, { title: 'Signal history', detail: 'Historical context for recent synthetic index setups' }].map((item) => (
                  <div key={item.title} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10 text-amber-200">
                        <Lock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <SectionHeading eyebrow="Why Choose Us" title="Built for traders who value clarity, speed, and structure." description="Premium access is delivered as a calm, premium experience rather than a noisy feed." />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-[#0D1424]/80 p-7 backdrop-blur-xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-500/10 text-sky-200">
                  {item.icon}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="py-16">
          <SectionHeading eyebrow="How It Works" title="Simple access, premium delivery." description="From subscription to dashboard access, the flow stays streamlined and clear." />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {howItWorks.map((step, index) => (
              <motion.div key={step.title} whileHover={{ y: -6 }} className="rounded-[1.75rem] border border-white/10 bg-[#0D1424]/80 p-7 backdrop-blur-xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-500/10 text-sm font-semibold text-sky-200">
                  0{index + 1}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="pricing" className="py-16">
          <SectionHeading eyebrow="Pricing" title="One premium plan built for serious Deriv traders." description="Get direct access to the private signal experience with a single subscription." />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div whileHover={{ y: -4 }} className="rounded-[2rem] border border-sky-400/20 bg-gradient-to-br from-sky-500/15 via-[#0C1527] to-violet-500/10 p-8 shadow-[0_25px_90px_rgba(39,87,255,0.16)]">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-200">Premium</p>
              <div className="mt-6 flex items-end gap-3">
                <span className="text-5xl font-semibold text-white">$150</span>
                <span className="pb-2 text-slate-400">USD</span>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                Unlock premium signal access, market analysis, members dashboard access, and activation support through one streamlined subscription.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-slate-200">
                <li>• Premium signal access</li>
                <li>• Market analysis and members dashboard</li>
                <li>• 24/7 support and instant activation after payment</li>
              </ul>
            </motion.div>

            <div className="rounded-[2rem] border border-white/10 bg-[#0D1424]/85 p-8 backdrop-blur-xl">
              <h3 className="text-2xl font-semibold text-white">Payment</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Send your payment via WhatsApp and follow the activation steps below to gain access.
              </p>
              <div className="mt-6 space-y-4">
                <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">WhatsApp</p>
                  <a href="https://wa.me/254781766193" className="mt-2 block text-lg font-semibold text-sky-200">+254 781 766 193</a>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">After payment</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">Send your receipt via WhatsApp to activate your account.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-16">
          <SectionHeading eyebrow="FAQ" title="Everything you need to know before subscribing." />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-[1.5rem] border border-white/10 bg-[#0D1424]/80 p-6 backdrop-blur-xl">
                <p className="font-semibold text-white">{item.question}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="py-16">
          <div className="rounded-[2rem] border border-white/10 bg-[#0D1424]/90 p-8 shadow-[0_25px_90px_rgba(2,6,23,0.35)] backdrop-blur-xl">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Contact</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Questions before you subscribe?</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Use WhatsApp for quick support and account activation follow-up.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-400">Direct contact</p>
                <a href="https://wa.me/254781766193" className="mt-2 block text-xl font-semibold text-sky-200">+254 781 766 193</a>
                <p className="mt-4 text-sm leading-7 text-slate-300">Send your payment confirmation and preferred account email to activate your premium access.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="pb-10 pt-6 text-center text-sm text-slate-500">
          <p>© 2026 Matches Tool. Premium access for Deriv synthetic index trading communities.</p>
        </footer>
      </div>
    </main>
  );
}

export default HomePage;
