import PropertyCard from '@/components/PropertyCard';
import HeroSlider from '@/components/HeroSlider';
import { styles } from '@/lib/constants';
import { Building2, MapPin, Wrench } from 'lucide-react';
import { listProperties } from '@/lib/properties';

export const dynamic = 'force-dynamic';

export default async function HomePage(){
  const properties = await listProperties();
  return (
    <div className="space-y-16">
      <HeroSlider images={['/images/hero/howland-front.jpeg','/images/hero/pittsfield-front.jpeg','/images/hero/dexter-front.jpeg']} headline="Modern Living. Smart Investments." subtext="Premium residential apartments managed by Ultimate Property Holdings." />
      <section className={`${styles.container} space-y-8`}>
        <div>
          <h2 className="font-montserrat text-2xl font-semibold text-gray-900">Why Choose Us</h2>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl">We pair modern amenities with attentive service so residents feel at home from day one.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: Building2, title: 'Modern, Managed Apartments', copy: 'Renovated interiors and thoughtful upgrades across every building.' },
            { icon: Wrench, title: 'Responsive Maintenance', copy: 'Dedicated team keeps everything running smoothly with quick turnarounds.' },
            { icon: MapPin, title: 'Prime Locations Across Maine', copy: 'Well-situated communities close to major employers and amenities.' },
          ].map(({ icon: Icon, title, copy })=>(
            <div key={title} className={`${styles.card} ${styles.cardPad} h-full text-center sm:text-left`}>
              <div className="flex justify-center sm:justify-start">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#111827] text-white">
                  <Icon className="h-6 w-6" />
                </span>
              </div>
              <h3 className="mt-4 font-montserrat text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>
      <section className={`${styles.container}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-montserrat text-xl font-semibold">Featured Properties</h2>
          <a href="/properties" className="text-sm font-semibold text-[#111827] underline-offset-4 hover:underline">
            View all
          </a>
        </div>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.length === 0 ? (
            <div className={`${styles.card} ${styles.cardPad} text-sm text-gray-600`}>
              New listings will appear here soon. Check back shortly.
            </div>
          ) : (
            properties.map(p => (<PropertyCard key={p.id} p={p} />))
          )}
        </div>
      </section>
    </div>
  );
}
