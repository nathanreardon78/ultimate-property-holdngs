import PropertyCreateWizard from './PropertyCreateWizard';
import { styles } from '@/lib/constants';

export default function AdminCreatePage(){
  return (
    <div className={`${styles.container} space-y-6`}>
      <div className="space-y-2">
        <h1 className="font-montserrat text-2xl font-semibold text-gray-900">Create Property</h1>
        <p className="text-sm text-gray-600">
          Walk through the guided setup to add property details, media, and optional unit information.
        </p>
      </div>
      <PropertyCreateWizard />
    </div>
  );
}
