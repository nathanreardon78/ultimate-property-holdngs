'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { styles } from '@/lib/constants';

export default function LoginForm(){
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    setPending(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || ''),
    };

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok){
        const data = await response.json().catch(()=> null);
        throw new Error(data?.message || 'Unable to sign in.');
      }
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed. Try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-semibold text-gray-700">
          Admin Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className={styles.inputBase}
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-semibold text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={styles.inputBase}
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        className={`${styles.btn} ${styles.btnPrimary} w-full`}
        disabled={pending}
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
