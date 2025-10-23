'use client';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { properties } from '@/lib/data';
import React, { useMemo, useState, use } from 'react';
import { styles } from '@/lib/constants';

export default function PropertyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const p = properties.find((x) => x.id === id);
  if (!p) return notFound();
  return <ClientDetail id={p.id} />;
}

function ClientDetail({ id }: { id: string }) {
  const p = useMemo(() => properties.find(x => x.id === id)!, [id]);
  const [mainIdx, setMainIdx] = useState(0);
  const images = p.gallery.length ? [p.heroImg, ...p.gallery] : [p.heroImg];
  const prev = () => setMainIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setMainIdx(i => (i + 1) % images.length);

  return (
    <div className={`${styles.container} space-y-6 pb-12`}>
      <a href="/properties" className="text-sm underline">← Back to Properties</a>

      <div className="relative mt-4 overflow-hidden rounded-2xl border" style={{ height: '60vh' }}>
        <Image src={images[mainIdx]} alt={p.name} fill className="object-cover" />
        {images.length > 1 && (<>
          <button aria-label="Previous image" onClick={prev} className={`${styles.btn} ${styles.btnGhost}`} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}>‹</button>
          <button aria-label="Next image" onClick={next} className={`${styles.btn} ${styles.btnGhost}`} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>›</button>
        </>)}
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
          {images.map((src, i) => (
            <button key={src} className={`relative h-20 w-full rounded-xl overflow-hidden border ${i === mainIdx ? 'ring-2 ring-gray-900' : ''}`} onClick={() => setMainIdx(i)}>
              <Image src={src} alt={`${p.name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="font-montserrat text-2xl font-bold">{p.name}</h1>
          <div className="text-sm text-gray-600">{p.address}</div>
          <p className={`${styles.muted} mt-3`}>{p.description}</p>
          <div className="mt-4 text-sm text-gray-700">Approx. {p.sqftApprox} • {p.bathsSummary}</div>

          <div className="mt-6">
            <h3 className="font-montserrat text-lg font-semibold">Units</h3>
            <div className="mt-3 grid gap-3">
              {p.units.map(u => (
                <div key={u.id} className="rounded-xl border p-4 flex items-center justify-between gap-3 flex-col sm:flex-row">
                  <div className="flex items-center gap-3 flex-1">
                    {u.image && <div className="relative h-14 w-20 rounded-md overflow-hidden border"><Image src={u.image} alt={u.label} fill className="object-cover" /></div>}
                    <div>
                      <div className="font-medium">{u.label}</div>
                      <div className="text-sm text-gray-600">{u.bedrooms} BR • {u.bathrooms} BA • {u.sqft} sqft</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={styles.badgeDark}>{u.available ? 'Available' : 'Waitlist'}</span>
                    <div className="text-sm font-semibold">${u.rent.toLocaleString()}</div>
                    <a className={`${styles.btn} ${styles.btnPrimary}`} href={`/contact?property=${encodeURIComponent(p.id)}&unit=${encodeURIComponent(u.label)}`}>Send Message</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className={`${styles.card} ${styles.cardPad}`}>
          <div className="font-montserrat text-lg font-semibold">Amenities</div>
          <ul className="mt-2 list-disc pl-6 text-sm text-gray-700">
            {p.amenities.map(a => <li key={a}>{a}</li>)}
          </ul>
          <div className="mt-6 font-montserrat text-lg font-semibold">Interested?</div>
          <a className={`${styles.btn} ${styles.btnPrimary} mt-2 inline-flex`} href={`/contact?property=${encodeURIComponent(p.id)}`}>Send a Message</a>
          <div className="mt-6 text-sm text-gray-600">
            Office: PO Box 52, Detroit, ME 04929<br />
            Phone: <a className="underline" href="tel:12079471999">207-947-1999</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
