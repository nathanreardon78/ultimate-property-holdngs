'use client';

import { useRouter } from 'next/navigation';
import { styles } from '@/lib/constants';
import { useState } from 'react';

export default function SignOutButton(){
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut(){
    setPending(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <button
      type="button"
      className={`${styles.btn} ${styles.btnGhost}`}
      onClick={handleSignOut}
      disabled={pending}
    >
      {pending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
