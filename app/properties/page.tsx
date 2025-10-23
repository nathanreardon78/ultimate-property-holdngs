import { properties } from '@/lib/data';
import PropertyCard from '@/components/PropertyCard';
import HeroSlider from '@/components/HeroSlider';
import { styles } from '@/lib/constants';

export default function PropertiesPage(){
  return (
    <div className="space-y-12">
      <HeroSlider images={[]} headline="Our Properties" subtext="Browse available units and neighborhoods." />
      <div className={`${styles.container} grid gap-6 sm:grid-cols-2 lg:grid-cols-3`}>
        {properties.map(p => (<PropertyCard key={p.id} p={p} />))}
      </div>
    </div>
  );
}
