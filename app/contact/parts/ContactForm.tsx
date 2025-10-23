'use client';
import { useEffect, useState } from 'react';
import { styles } from '@/lib/constants';

export default function ContactForm(){
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [property, setProperty] = useState<string | null>(null);
  const [unit, setUnit] = useState<string | null>(null);

  useEffect(()=>{
    const params = new URLSearchParams(location.search);
    const p = params.get('property'); const u = params.get('unit');
    if(p) setProperty(p); if(u) setUnit(u);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    setOk(null); setErr(null);
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try{
      const res = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(Object.fromEntries(fd)) });
      const j = await res.json();
      if(!res.ok) throw new Error(j.error || 'Failed');
      setOk('Thanks! Your message has been sent.');
      (e.currentTarget as HTMLFormElement).reset();
    }catch(e:any){ setErr(e.message); }
    finally{ setLoading(false); }
  }

  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      {property && <input type="hidden" name="aboutProperty" value={property} />}
      {unit && <input type="hidden" name="aboutUnit" value={unit} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <input className={styles.inputBase} name="name" placeholder="Full Name" required />
        <input className={styles.inputBase} name="email" placeholder="Email" type="email" required />
      </div>
      <input className={styles.inputBase} name="phone" placeholder="Phone (optional)" />
      <textarea className={styles.textarea} name="message" placeholder="How can we help?" rows={5} required />
      <button className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>{loading ? 'Sending…' : 'Send Message'}</button>
      {ok && <div className="text-sm text-green-600">{ok}</div>}
      {err && <div className="text-sm text-red-600">{err}</div>}
    </form>
  );
}
