'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { styles } from '@/lib/constants';
import type { Unit } from '@/lib/types';

type Props = {
  propertyId: string;
  propertySlug: string;
  units: Unit[];
};

type UnitDraft = {
  id: string;
  label: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  rent: string;
  available: boolean;
  isHidden: boolean;
  galleryDetails: Array<{ id: string; url: string }>;
};

export default function UnitsManager({ propertyId, units }: Props){
  const router = useRouter();
  const [_isRefreshing, startTransition] = useTransition();
  const [drafts, setDrafts] = useState<UnitDraft[]>(() =>
    units.map((unit)=> ({
      id: unit.id,
      label: unit.label,
      bedrooms: String(unit.bedrooms ?? ''),
      bathrooms: String(unit.bathrooms ?? ''),
      sqft: String(unit.sqft ?? ''),
      rent: unit.rent ? String(unit.rent) : '',
      available: unit.available,
      isHidden: unit.isHidden,
      galleryDetails: unit.galleryDetails?.map((image)=> ({ id: image.id, url: image.url })) ?? [],
    })),
  );
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>(() => {
    if (!units.length) return {};
    return units.reduce((acc, unit, index)=> ({ ...acc, [unit.id]: index === 0 }), {} as Record<string, boolean>);
  });

  const [newUnitVisible, setNewUnitVisible] = useState(false);
  const [newUnit, setNewUnit] = useState({
    label: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    rent: '',
    available: true,
    isHidden: false,
    cover: null as File | null,
    gallery: [] as File[],
  });
  const [isCreating, setIsCreating] = useState(false);
  const [pendingUnitId, setPendingUnitId] = useState<string | null>(null);
  const [deletingUnitId, setDeletingUnitId] = useState<string | null>(null);

  function updateDraft(id: string, updates: Partial<UnitDraft>){
    setDrafts((current)=> current.map((unit)=> unit.id === id ? { ...unit, ...updates } : unit));
  }

  function toggleUnit(id: string){
    setExpandedUnits((current)=> ({ ...current, [id]: !current[id] }));
  }

  async function saveUnit(id: string){
    const draft = drafts.find((unit)=> unit.id === id);
    if (!draft) return;
    setPendingUnitId(id);
    const response = await fetch(`/api/admin/properties/${propertyId}/units/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label: draft.label,
        bedrooms: draft.bedrooms,
        bathrooms: draft.bathrooms,
        sqft: draft.sqft,
        rent: draft.rent,
        available: draft.available,
        isHidden: draft.isHidden,
      }),
    });
    if (!response.ok){
      const data = await response.json().catch(()=> null);
      alert(data?.message || 'Failed to update unit.');
      setPendingUnitId(null);
      return;
    }
    startTransition(()=> router.refresh());
    setPendingUnitId(null);
  }

  async function deleteUnit(id: string){
    if (!confirm('Remove this unit?')) return;
    setDeletingUnitId(id);
    const response = await fetch(`/api/admin/properties/${propertyId}/units/${id}`, { method: 'DELETE' });
    if (!response.ok){
      const data = await response.json().catch(()=> null);
      alert(data?.message || 'Failed to delete unit.');
      setDeletingUnitId(null);
      return;
    }
    startTransition(()=> router.refresh());
    setDeletingUnitId(null);
  }

  async function uploadCover(id: string, file: File | null){
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`/api/admin/properties/${propertyId}/units/${id}/cover`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok){
      const data = await response.json().catch(()=> null);
      alert(data?.message || 'Failed to upload cover image.');
      return;
    }
    startTransition(()=> router.refresh());
  }

  async function uploadGallery(id: string, files: File[]){
    if (!files.length) return;
    const formData = new FormData();
    files.forEach((file)=> formData.append('files', file));
    const response = await fetch(`/api/admin/properties/${propertyId}/units/${id}/gallery`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok){
      const data = await response.json().catch(()=> null);
      alert(data?.message || 'Failed to upload gallery images.');
      return;
    }
    startTransition(()=> router.refresh());
  }

  async function deleteGalleryImage(id: string, imageId: string){
    const response = await fetch(`/api/admin/properties/${propertyId}/units/${id}/gallery/${imageId}`, {
      method: 'DELETE',
    });
    if (!response.ok){
      const data = await response.json().catch(()=> null);
      alert(data?.message || 'Failed to remove image.');
      return;
    }
    startTransition(()=> router.refresh());
  }

  async function createUnit(event: React.FormEvent){
    event.preventDefault();
    if (!newUnit.label || !newUnit.bedrooms || !newUnit.bathrooms || !newUnit.sqft){
      alert('Fill in label, bedrooms, bathrooms, and square feet.');
      return;
    }
    setIsCreating(true);
    const formData = new FormData();
    const payload = {
      label: newUnit.label,
      bedrooms: newUnit.bedrooms,
      bathrooms: newUnit.bathrooms,
      sqft: newUnit.sqft,
      rent: newUnit.rent,
      available: newUnit.available,
      isHidden: newUnit.isHidden,
      coverImageField: newUnit.cover ? 'cover' : null,
      galleryFields: newUnit.gallery.map((_, index)=> `gallery-${index}`),
    };
    formData.append('payload', JSON.stringify(payload));
    if (newUnit.cover) formData.append('cover', newUnit.cover);
    newUnit.gallery.forEach((file, index)=> formData.append(`gallery-${index}`, file));
    const response = await fetch(`/api/admin/properties/${propertyId}/units`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok){
      const data = await response.json().catch(()=> null);
      alert(data?.message || 'Failed to add unit.');
      setIsCreating(false);
      return;
    }
    setNewUnitVisible(false);
    setNewUnit({ label: '', bedrooms: '', bathrooms: '', sqft: '', rent: '', available: true, isHidden: false, cover: null, gallery: [] });
    startTransition(()=> router.refresh());
    setIsCreating(false);
  }

  return (
    <section className={`${styles.card} ${styles.cardPad} space-y-5`}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-montserrat text-lg font-semibold text-gray-900">Units</h2>
          <p className="text-sm text-gray-600">Configure availability, pricing, and imagery for each unit.</p>
        </div>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={()=> setNewUnitVisible((current)=> !current)}
        >
          {newUnitVisible ? 'Close new unit' : 'Add unit'}
        </button>
      </div>

      {newUnitVisible && (
        <form onSubmit={createUnit} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Label" value={newUnit.label} onChange={(value)=> setNewUnit((current)=> ({ ...current, label: value }))} placeholder="e.g., Unit 3A" />
            <Field label="Rent" value={newUnit.rent} onChange={(value)=> setNewUnit((current)=> ({ ...current, rent: value }))} placeholder="Optional e.g., 1250" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Bedrooms" value={newUnit.bedrooms} onChange={(value)=> setNewUnit((current)=> ({ ...current, bedrooms: value }))} placeholder="e.g., 2" />
            <Field label="Bathrooms" value={newUnit.bathrooms} onChange={(value)=> setNewUnit((current)=> ({ ...current, bathrooms: value }))} placeholder="e.g., 1" />
            <Field label="Square feet" value={newUnit.sqft} onChange={(value)=> setNewUnit((current)=> ({ ...current, sqft: value }))} placeholder="e.g., 850" />
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-600">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={newUnit.available} onChange={(event)=> setNewUnit((current)=> ({ ...current, available: event.target.checked }))} />
              Available
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={newUnit.isHidden} onChange={(event)=> setNewUnit((current)=> ({ ...current, isHidden: event.target.checked }))} />
              Hide
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700" title="Use a wide cover image to highlight the unit.">
                Cover image
              </label>
              <input
                type="file"
                accept="image/*"
                className={styles.inputBase}
                onChange={(event)=> setNewUnit((current)=> ({ ...current, cover: event.target.files?.[0] ?? null }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700" title="Upload multiple interior shots to build the unit gallery.">
                Gallery images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                className={styles.inputBase}
                onChange={(event)=> setNewUnit((current)=> ({ ...current, gallery: event.target.files ? Array.from(event.target.files) : [] }))}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={isCreating}>
              {isCreating ? 'Creating…' : 'Create unit'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {drafts.map((unit)=> {
          const isExpanded = expandedUnits[unit.id] ?? false;
          return (
            <div key={unit.id} className="rounded-2xl border border-gray-200 p-4 space-y-4">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 text-left"
                onClick={()=> toggleUnit(unit.id)}
                aria-expanded={isExpanded}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                    <span className="font-semibold text-gray-900">{unit.label}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {unit.bedrooms || '—'} BR • {unit.bathrooms || '—'} BA • {unit.sqft || '—'} sqft
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <span className={`rounded-full px-2 py-0.5 ${unit.available ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
                    {unit.available ? 'Available' : 'Waitlist'}
                  </span>
                  {unit.isHidden && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-600">Hidden</span>}
                  {unit.rent && <span className="text-gray-900">${unit.rent}</span>}
                </div>
              </button>

              {isExpanded && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3 text-xs font-semibold text-gray-600">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={unit.available} onChange={(event)=> updateDraft(unit.id, { available: event.target.checked })} />
                      Available
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={unit.isHidden} onChange={(event)=> updateDraft(unit.id, { isHidden: event.target.checked })} />
                      Hidden
                    </label>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-4">
                    <Field label="Label" value={unit.label} onChange={(value)=> updateDraft(unit.id, { label: value })} />
                    <Field label="Bedrooms" value={unit.bedrooms} onChange={(value)=> updateDraft(unit.id, { bedrooms: value })} />
                    <Field label="Bathrooms" value={unit.bathrooms} onChange={(value)=> updateDraft(unit.id, { bathrooms: value })} />
                    <Field label="Square feet" value={unit.sqft} onChange={(value)=> updateDraft(unit.id, { sqft: value })} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field label="Rent" value={unit.rent} onChange={(value)=> updateDraft(unit.id, { rent: value })} />
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Update cover</label>
                      <input type="file" accept="image/*" className={styles.inputBase} onChange={(event)=> uploadCover(unit.id, event.target.files?.[0] ?? null)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Add gallery images</label>
                      <input type="file" accept="image/*" multiple className={styles.inputBase} onChange={(event)=> uploadGallery(unit.id, event.target.files ? Array.from(event.target.files) : [])} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {unit.galleryDetails.map((image)=> (
                      <div key={image.id} className="relative h-20 w-28 overflow-hidden rounded-lg border">
                        <img src={image.url} alt="Unit gallery" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={()=> deleteGalleryImage(unit.id, image.id)}
                          className="absolute right-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnGhost}`}
                    onClick={()=> deleteUnit(unit.id)}
                    disabled={deletingUnitId === unit.id}
                  >
                    {deletingUnitId === unit.id ? 'Removing…' : 'Remove'}
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={()=> saveUnit(unit.id)}
                    disabled={pendingUnitId === unit.id}
                  >
                    {pendingUnitId === unit.id ? 'Saving…' : 'Save unit'}
                  </button>
                </div>
              </div>
            )}
            </div>
          );
        })}
        {drafts.length === 0 && !newUnitVisible && (
          <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600">
            No units configured yet.
          </div>
        )}
      </div>
    </section>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string)=> void;
  placeholder?: string;
};

function Field({ label, value, onChange, placeholder }: FieldProps){
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        className={styles.inputBase}
        value={value}
        onChange={(event)=> onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
