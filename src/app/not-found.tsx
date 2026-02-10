import Link from 'next/link'
import { Pill, Home, Search, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center">
        {/* Animated Icon Section */}
        <div className="relative flex justify-center mb-8">
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150" />
          <div className="relative bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800">
            <Pill className="h-20 w-20 text-emerald-500 animate-bounce" />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg">
              <AlertCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-8xl font-black text-slate-200 dark:text-slate-800 mb-2">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Oops! Prescription Missing
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-10 text-lg">
          We couldn't find the page you're looking for. It might have been moved, 
          deleted, or perhaps it never existed in our pharmacy records.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-xl shadow-emerald-500/20">
              <Home className="h-5 w-5" />
              Back to Home
            </button>
          </Link>
          
        </div>

        {/* Support Link */}
        <p className="mt-12 text-sm text-slate-400">
          Need help? <Link href="/contact" className="text-emerald-500 hover:underline">Contact our pharmacists</Link>
        </p>
      </div>
    </div>
  )
}