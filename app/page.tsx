import { properties } from '@/lib/data';
import PropertyCard from '@/components/PropertyCard';
import HeroSlider from '@/components/HeroSlider';
import { styles } from '@/lib/constants';

export default function HomePage(){
  return (
    <div className="space-y-16">
      <HeroSlider images={['/images/hero/howland-front.jpeg','/images/hero/pittsfield-front.jpeg','/images/hero/dexter-front.jpeg']} headline="Modern Living. Smart Investments." subtext="Premium residential apartments managed by Ultimate Property Holdings." />
      <section className={`${styles.container}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-montserrat text-xl font-semibold">Featured Properties</h2>
          <a href="/properties" className="text-sm font-semibold text-[#111827] underline-offset-4 hover:underline">
            View all
          </a>
        </div>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map(p => (<PropertyCard key={p.id} p={p} />))}
        </div>
      </section>
    </div>
  );
}
