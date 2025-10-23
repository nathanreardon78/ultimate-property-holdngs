import { Property } from '@/lib/types';
import { styles } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';

export default function PropertyCard({ p }:{ p: Property }){
  const availableCount = p.units.filter(u=>u.available).length;
  return (
    <Link className={`${styles.card} overflow-hidden`} href={`/properties/${p.id}`}>
      <div className="relative h-56 w-full">
        <Image src={p.heroImg} alt={p.name} fill className="object-cover" />
      </div>
      <div className={styles.cardPad}>
        <div className="flex items-center justify-between">
          <h3 className="font-montserrat font-semibold">{p.name}</h3>
          <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium text-gray-700">{p.status}</span>
        </div>
        <div className="mt-1 text-sm text-gray-600">{p.address}</div>
        <div className="mt-3 flex items-center gap-2">
          <span className={styles.badgeDark}>
            {availableCount > 0 ? `${availableCount} Available` : 'Join Waitlist'}
          </span>
          <span className="text-xs text-gray-500">From ${p.rentFrom.toLocaleString()}</span>
        </div>
        <span className={`${styles.btn} ${styles.btnPrimary} mt-4`}>View Details</span>
      </div>
    </Link>
  );
}
