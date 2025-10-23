import HeroSlider from '@/components/HeroSlider';
import { styles } from '@/lib/constants';

export default function AboutPage(){
  return (
    <div className="space-y-12">
      <HeroSlider images={['/logo/uph.jpeg']} headline="About Us" subtext="Who we are and what we do." />
      <div className={styles.container}>
        <div className="max-w-3xl">
          <h1 className="font-montserrat text-2xl font-bold">Our Story</h1>
          <p className={`text-base ${styles.muted}`}>Ultimate Property Holdings acquires and manages quality residential assets across Maine with a focus on consistent upkeep, resident satisfaction, and long-term community value.</p>
          <h2 className="font-montserrat text-xl font-semibold mt-8">Leadership</h2>
          <div className={`${styles.card} ${styles.cardPad} mt-4`}>
            <div className="font-semibold">Nathan Reardon</div>
            <div className="text-sm text-gray-600">Founder & CEO</div>
            <p className={`mt-2 text-sm ${styles.muted}`}>Entrepreneur and operator focused on modern, well-managed housing.</p>
          </div>
          <h2 className="font-montserrat text-xl font-semibold mt-8">Community Commitment</h2>
          <ul className="mt-2 text-sm text-gray-700 list-disc pl-6">
            <li>Sustainable upgrades where feasible (insulation, efficient heating).</li>
            <li>Responsive maintenance and clear resident communication.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
