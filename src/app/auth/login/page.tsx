'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Shield, User, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('demo-password');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // In dev / demo mode, redirect directly to dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-tight">Staff Portal</h1>
          <p className="text-xs text-zinc-400 mt-2">
            Secure authentication for front desk, kitchen, cashier & management
          </p>
        </div>

        <Card className="p-8 border-zinc-800 shadow-2xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Staff Email"
              type="email"
              placeholder="staff@auragrandresort.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
              Sign In to Portal <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick Demo Role Logins */}
          <div className="pt-6 border-t border-zinc-800 space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block text-center">
              Quick Role Demo Selectors
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleRoleSelect('admin@auragrandresort.com')}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-left hover:border-amber-400/50 transition-colors"
              >
                <span className="font-bold text-white block">General Manager</span>
                <span className="text-[10px] text-zinc-400">Full platform admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('frontdesk@auragrandresort.com')}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-left hover:border-amber-400/50 transition-colors"
              >
                <span className="font-bold text-white block">Front Desk</span>
                <span className="text-[10px] text-zinc-400">Rooms & check-in</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('kitchen@auragrandresort.com')}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-left hover:border-amber-400/50 transition-colors"
              >
                <span className="font-bold text-white block">Kitchen Chef</span>
                <span className="text-[10px] text-zinc-400">Order board & KDS</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('cashier@auragrandresort.com')}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-left hover:border-amber-400/50 transition-colors"
              >
                <span className="font-bold text-white block">POS Cashier</span>
                <span className="text-[10px] text-zinc-400">Billing & receipts</span>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
