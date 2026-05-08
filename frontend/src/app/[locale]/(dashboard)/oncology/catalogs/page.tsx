'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { LoadingState } from '@/plugins/oncology/components/shared';
import {
  useCancerTypes, useCreateCancerType, useUpdateCancerType,
  usePrimarySites, useCreatePrimarySite, useUpdatePrimarySite,
  useSiteMappings, useCreateSiteMapping, useDeleteSiteMapping, useUpdateSiteMapping,
  useHistologies, useCreateHistology, useUpdateHistology,
} from '@/plugins/oncology/hooks/use-oncology';
import type {
  OncologyCancerType, OncologyPrimarySite, OncologyCancerTypeSiteMapping, OncologyHistology,
} from '@/plugins/oncology/types';

// ── shared helpers ──────────────────────────────────────────────────────────

const BEHAVIOR_LABELS: Record<string, string> = {
  '/0': 'Benign',
  '/1': 'Borderline',
  '/2': 'In situ',
  '/3': 'Malignant',
};

const MAPPING_TYPES = ['EXACT', 'APPROXIMATE', 'MULTIPLE', 'UNKNOWN', 'SYSTEMIC'];
const CATEGORIES = ['Solid Tumor', 'Hematologic', 'CNS', 'Skin', 'Other'];
const BODY_SYSTEMS = [
  'Breast', 'Respiratory', 'Digestive', 'Urinary', 'Reproductive', 'Hematologic',
  'Nervous', 'Musculoskeletal', 'Skin', 'Endocrine', 'Head & Neck', 'Other',
];

function ActiveBadge({ active }: { active: boolean }) {
  return (
    <Badge variant={active ? 'default' : 'secondary'} className="text-xs">
      {active ? 'Active' : 'Inactive'}
    </Badge>
  );
}

// ── Cancer Types tab ────────────────────────────────────────────────────────

function CancerTypesTab() {
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<OncologyCancerType | null>(null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const { data, isLoading } = useCancerTypes();
  const createMutation = useCreateCancerType();
  const updateMutation = useUpdateCancerType();

  const all: OncologyCancerType[] = data?.data ?? [];
  const filtered = all.filter((r) => {
    if (!showInactive && !r.active) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q);
  });

  function openCreate() {
    setEditing(null);
    setCode(''); setName(''); setCategory(''); setDescription('');
    setDialogOpen(true);
  }

  function openEdit(row: OncologyCancerType) {
    setEditing(row);
    setCode(row.code); setName(row.name);
    setCategory(row.category ?? ''); setDescription(row.description ?? '');
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!name || (!editing && !code)) return;
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: { name, category: category || undefined, description: description || undefined } });
    } else {
      await createMutation.mutateAsync({ code, name, category: category || undefined, description: description || undefined });
    }
    setDialogOpen(false);
  }

  async function toggleActive(row: OncologyCancerType) {
    await updateMutation.mutateAsync({ id: row.id, data: { active: !row.active } });
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by code or name..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} className="rounded border-gray-300" />
          Show inactive
        </label>
        <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add Cancer Type</Button>
      </div>

      {isLoading ? <LoadingState /> : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Code</th>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Category</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="p-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No cancer types found</td></tr>
              ) : filtered.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono text-xs font-semibold">{row.code}</td>
                  <td className="p-3 font-medium">{row.name}</td>
                  <td className="p-3 text-xs text-muted-foreground">{row.category ?? '—'}</td>
                  <td className="p-3"><ActiveBadge active={row.active} /></td>
                  <td className="p-3 flex gap-1 justify-end">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(row)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground"
                      onClick={() => toggleActive(row)} disabled={updateMutation.isPending}
                    >
                      {row.active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-3 py-2 bg-muted/20 border-t text-xs text-muted-foreground">
            {filtered.length} of {all.length} entries
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Cancer Type' : 'Add Cancer Type'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {!editing && (
              <div className="space-y-1">
                <Label>Code <span className="text-destructive">*</span></Label>
                <Input placeholder="e.g. BREAST_CA" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
                <p className="text-xs text-muted-foreground">Unique identifier per hospital. Use UPPER_SNAKE_CASE.</p>
              </div>
            )}
            <div className="space-y-1">
              <Label>Name <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. Breast Cancer" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Category</Label>
              <Select value={category || '__none__'} onValueChange={(v) => setCategory(v === '__none__' ? '' : v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— None —</SelectItem>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Input placeholder="Optional description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isPending || !name || (!editing && !code)}>
              {isPending ? 'Saving…' : editing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Primary Sites tab ───────────────────────────────────────────────────────

function PrimarySitesTab() {
  const [search, setSearch] = useState('');
  const [bodySystemFilter, setBodySystemFilter] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<OncologyPrimarySite | null>(null);

  const [icdoCode, setIcdoCode] = useState('');
  const [icdoName, setIcdoName] = useState('');
  const [bodySystem, setBodySystem] = useState('');
  const [laterality, setLaterality] = useState(false);
  const [mappingType, setMappingType] = useState('');

  const { data, isLoading } = usePrimarySites();
  const createMutation = useCreatePrimarySite();
  const updateMutation = useUpdatePrimarySite();

  const all: OncologyPrimarySite[] = data?.data ?? [];
  const filtered = all.filter((r) => {
    if (!showInactive && !r.active) return false;
    if (bodySystemFilter && r.body_system !== bodySystemFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return r.icdo_site_name.toLowerCase().includes(q) || r.icdo_site_code.toLowerCase().includes(q);
  });

  function openCreate() {
    setEditing(null);
    setIcdoCode(''); setIcdoName(''); setBodySystem(''); setLaterality(false); setMappingType('');
    setDialogOpen(true);
  }

  function openEdit(row: OncologyPrimarySite) {
    setEditing(row);
    setIcdoCode(row.icdo_site_code); setIcdoName(row.icdo_site_name);
    setBodySystem(row.body_system ?? ''); setLaterality(row.laterality_applicable);
    setMappingType(row.mapping_type ?? '');
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!icdoName || (!editing && !icdoCode)) return;
    if (editing) {
      await updateMutation.mutateAsync({
        id: editing.id,
        data: { icdo_site_name: icdoName, body_system: bodySystem || undefined, laterality_applicable: laterality, mapping_type: mappingType || undefined },
      });
    } else {
      await createMutation.mutateAsync({
        icdo_site_code: icdoCode, icdo_site_name: icdoName,
        body_system: bodySystem || undefined, laterality_applicable: laterality,
        mapping_type: mappingType || undefined,
      });
    }
    setDialogOpen(false);
  }

  async function toggleActive(row: OncologyPrimarySite) {
    await updateMutation.mutateAsync({ id: row.id, data: { active: !row.active } });
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by code or site name..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={bodySystemFilter || '__all__'} onValueChange={(v) => setBodySystemFilter(v === '__all__' ? '' : v)}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All body systems</SelectItem>
            {BODY_SYSTEMS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} className="rounded border-gray-300" />
          Show inactive
        </label>
        <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add Site</Button>
      </div>

      {isLoading ? <LoadingState /> : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">ICD-O Code</th>
                <th className="text-left p-3 font-medium">Site Name</th>
                <th className="text-left p-3 font-medium">Body System</th>
                <th className="text-left p-3 font-medium">Laterality</th>
                <th className="text-left p-3 font-medium">Mapping</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="p-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No primary sites found</td></tr>
              ) : filtered.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono text-xs font-semibold">{row.icdo_site_code}</td>
                  <td className="p-3 font-medium">{row.icdo_site_name}</td>
                  <td className="p-3 text-xs text-muted-foreground">{row.body_system ?? '—'}</td>
                  <td className="p-3 text-xs">{row.laterality_applicable ? 'Yes' : 'No'}</td>
                  <td className="p-3 text-xs text-muted-foreground">{row.mapping_type ?? '—'}</td>
                  <td className="p-3"><ActiveBadge active={row.active} /></td>
                  <td className="p-3 flex gap-1 justify-end">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(row)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground"
                      onClick={() => toggleActive(row)} disabled={updateMutation.isPending}
                    >
                      {row.active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-3 py-2 bg-muted/20 border-t text-xs text-muted-foreground">
            {filtered.length} of {all.length} entries
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Primary Site' : 'Add Primary Site'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {!editing && (
              <div className="space-y-1">
                <Label>ICD-O Site Code <span className="text-destructive">*</span></Label>
                <Input placeholder="e.g. C50.9" value={icdoCode} onChange={(e) => setIcdoCode(e.target.value)} />
              </div>
            )}
            <div className="space-y-1">
              <Label>Site Name <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. Breast NOS" value={icdoName} onChange={(e) => setIcdoName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Body System</Label>
              <Select value={bodySystem || '__none__'} onValueChange={(v) => setBodySystem(v === '__none__' ? '' : v)}>
                <SelectTrigger><SelectValue placeholder="Select body system" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— None —</SelectItem>
                  {BODY_SYSTEMS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Mapping Type</Label>
              <Select value={mappingType || '__none__'} onValueChange={(v) => setMappingType(v === '__none__' ? '' : v)}>
                <SelectTrigger><SelectValue placeholder="Select mapping type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— None —</SelectItem>
                  {MAPPING_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox" checked={laterality}
                onChange={(e) => setLaterality(e.target.checked)}
                className="rounded border-gray-300"
              />
              Laterality applicable (left / right / bilateral)
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isPending || !icdoName || (!editing && !icdoCode)}>
              {isPending ? 'Saving…' : editing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Site Mappings tab ───────────────────────────────────────────────────────

function SiteMappingsTab() {
  const [cancerTypeFilter, setCancerTypeFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCancerType, setSelectedCancerType] = useState('');
  const [selectedSite, setSelectedSite] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const { data, isLoading } = useSiteMappings();
  const { data: ctData } = useCancerTypes({ active: 'true' });
  const { data: psData } = usePrimarySites({ active: 'true' });
  const createMutation = useCreateSiteMapping();
  const updateMutation = useUpdateSiteMapping();
  const deleteMutation = useDeleteSiteMapping();

  const allMappings: OncologyCancerTypeSiteMapping[] = data?.data ?? [];
  const cancerTypes: OncologyCancerType[] = ctData?.data ?? [];
  const primarySites: OncologyPrimarySite[] = psData?.data ?? [];

  const filtered = cancerTypeFilter
    ? allMappings.filter((m) => m.cancer_type_id === cancerTypeFilter)
    : allMappings;

  async function handleCreate() {
    if (!selectedCancerType || !selectedSite) return;
    await createMutation.mutateAsync({ cancerTypeId: selectedCancerType, primarySiteId: selectedSite, isDefault });
    setDialogOpen(false);
    setSelectedCancerType(''); setSelectedSite(''); setIsDefault(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap items-center">
        <Select value={cancerTypeFilter || '__all__'} onValueChange={(v) => setCancerTypeFilter(v === '__all__' ? '' : v)}>
          <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All cancer types</SelectItem>
            {cancerTypes.map((ct) => (
              <SelectItem key={ct.id} value={ct.id}>{ct.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-1" />Add Mapping</Button>
      </div>

      {isLoading ? <LoadingState /> : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Cancer Type</th>
                <th className="text-left p-3 font-medium">Primary Site</th>
                <th className="text-left p-3 font-medium">ICD-O Code</th>
                <th className="text-left p-3 font-medium">Default</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="p-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No site mappings found</td></tr>
              ) : filtered.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium text-sm">{row.cancer_type_name ?? row.cancer_type_id}</td>
                  <td className="p-3 text-sm">{row.icdo_site_name ?? row.primary_site_id}</td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{row.icdo_site_code ?? '—'}</td>
                  <td className="p-3">
                    {row.is_default && <Badge variant="outline" className="text-xs">Default</Badge>}
                  </td>
                  <td className="p-3"><ActiveBadge active={row.active} /></td>
                  <td className="p-3 flex gap-1 justify-end">
                    {!row.is_default && (
                      <Button
                        variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground"
                        onClick={() => updateMutation.mutate({ id: row.id, data: { isDefault: true } })}
                        disabled={updateMutation.isPending}
                      >
                        Set default
                      </Button>
                    )}
                    <Button
                      variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteMutation.mutate(row.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-3 py-2 bg-muted/20 border-t text-xs text-muted-foreground">
            {filtered.length} mapping{filtered.length !== 1 ? 's' : ''}
            {filtered.length !== allMappings.length && ` (filtered from ${allMappings.length})`}
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Cancer Type → Site Mapping</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Cancer Type <span className="text-destructive">*</span></Label>
              <Select value={selectedCancerType} onValueChange={setSelectedCancerType}>
                <SelectTrigger><SelectValue placeholder="Select cancer type" /></SelectTrigger>
                <SelectContent>
                  {cancerTypes.map((ct) => <SelectItem key={ct.id} value={ct.id}>{ct.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Primary Site <span className="text-destructive">*</span></Label>
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger><SelectValue placeholder="Select primary site" /></SelectTrigger>
                <SelectContent>
                  {primarySites.map((ps) => (
                    <SelectItem key={ps.id} value={ps.id}>
                      {ps.icdo_site_code} — {ps.icdo_site_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox" checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="rounded border-gray-300"
              />
              Mark as default site for this cancer type
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending || !selectedCancerType || !selectedSite}>
              {createMutation.isPending ? 'Saving…' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Histologies tab ─────────────────────────────────────────────────────────

function HistologiesTab() {
  const [search, setSearch] = useState('');
  const [behaviorFilter, setBehaviorFilter] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<OncologyHistology | null>(null);

  const [morphCode, setMorphCode] = useState('');
  const [morphName, setMorphName] = useState('');
  const [behaviorCode, setBehaviorCode] = useState('');
  const [behaviorName, setBehaviorName] = useState('');
  const [description, setDescription] = useState('');

  const { data, isLoading } = useHistologies();
  const createMutation = useCreateHistology();
  const updateMutation = useUpdateHistology();

  const all: OncologyHistology[] = data?.data ?? [];
  const filtered = all.filter((r) => {
    if (!showInactive && !r.active) return false;
    if (behaviorFilter && r.behavior_code !== behaviorFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return r.morphology_name.toLowerCase().includes(q) || r.morphology_code.toLowerCase().includes(q);
  });

  function openCreate() {
    setEditing(null);
    setMorphCode(''); setMorphName(''); setBehaviorCode(''); setBehaviorName(''); setDescription('');
    setDialogOpen(true);
  }

  function openEdit(row: OncologyHistology) {
    setEditing(row);
    setMorphCode(row.morphology_code); setMorphName(row.morphology_name);
    setBehaviorCode(row.behavior_code ?? ''); setBehaviorName(row.behavior_name ?? '');
    setDescription(row.description ?? '');
    setDialogOpen(true);
  }

  function handleBehaviorCodeChange(val: string) {
    setBehaviorCode(val);
    if (BEHAVIOR_LABELS[val]) setBehaviorName(BEHAVIOR_LABELS[val]);
  }

  async function handleSave() {
    if (!morphName || (!editing && !morphCode)) return;
    if (editing) {
      await updateMutation.mutateAsync({
        id: editing.id,
        data: {
          morphology_name: morphName,
          behavior_code: behaviorCode || undefined,
          behavior_name: behaviorName || undefined,
          description: description || undefined,
        },
      });
    } else {
      await createMutation.mutateAsync({
        morphology_code: morphCode, morphology_name: morphName,
        behavior_code: behaviorCode || undefined,
        behavior_name: behaviorName || undefined,
        description: description || undefined,
      });
    }
    setDialogOpen(false);
  }

  async function toggleActive(row: OncologyHistology) {
    await updateMutation.mutateAsync({ id: row.id, data: { active: !row.active } });
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by code or name..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={behaviorFilter || '__all__'} onValueChange={(v) => setBehaviorFilter(v === '__all__' ? '' : v)}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All behaviors</SelectItem>
            {Object.entries(BEHAVIOR_LABELS).map(([code, label]) => (
              <SelectItem key={code} value={code}>{code} — {label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} className="rounded border-gray-300" />
          Show inactive
        </label>
        <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add Histology</Button>
      </div>

      {isLoading ? <LoadingState /> : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Morphology Code</th>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Behavior</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="p-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No histologies found</td></tr>
              ) : filtered.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono text-xs font-semibold">{row.morphology_code}</td>
                  <td className="p-3 font-medium">{row.morphology_name}</td>
                  <td className="p-3 text-xs">
                    {row.behavior_code ? (
                      <span className="text-muted-foreground">
                        <span className="font-mono">{row.behavior_code}</span> — {row.behavior_name ?? BEHAVIOR_LABELS[row.behavior_code] ?? ''}
                      </span>
                    ) : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="p-3"><ActiveBadge active={row.active} /></td>
                  <td className="p-3 flex gap-1 justify-end">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(row)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground"
                      onClick={() => toggleActive(row)} disabled={updateMutation.isPending}
                    >
                      {row.active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-3 py-2 bg-muted/20 border-t text-xs text-muted-foreground">
            {filtered.length} of {all.length} entries
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Histology' : 'Add Histology'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {!editing && (
              <div className="space-y-1">
                <Label>Morphology Code <span className="text-destructive">*</span></Label>
                <Input placeholder="e.g. 8500/3" value={morphCode} onChange={(e) => setMorphCode(e.target.value)} />
                <p className="text-xs text-muted-foreground">ICD-O-3 morphology code (e.g. 8500/3 for IDC of breast).</p>
              </div>
            )}
            <div className="space-y-1">
              <Label>Morphology Name <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. Infiltrating duct carcinoma NOS" value={morphName} onChange={(e) => setMorphName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Behavior Code</Label>
                <Select value={behaviorCode || '__none__'} onValueChange={(v) => handleBehaviorCodeChange(v === '__none__' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">— None —</SelectItem>
                    {Object.entries(BEHAVIOR_LABELS).map(([code, label]) => (
                      <SelectItem key={code} value={code}>{code} — {label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Behavior Name</Label>
                <Input placeholder="Auto-filled" value={behaviorName} onChange={(e) => setBehaviorName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Input placeholder="Optional description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isPending || !morphName || (!editing && !morphCode)}>
              {isPending ? 'Saving…' : editing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function OncologyCatalogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Oncology Catalogs</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Master reference data — cancer types, primary sites, site mappings, and histologies
        </p>
      </div>

      <Tabs defaultValue="cancer-types">
        <TabsList>
          <TabsTrigger value="cancer-types">Cancer Types</TabsTrigger>
          <TabsTrigger value="primary-sites">Primary Sites</TabsTrigger>
          <TabsTrigger value="site-mappings">Site Mappings</TabsTrigger>
          <TabsTrigger value="histologies">Histologies</TabsTrigger>
        </TabsList>

        <TabsContent value="cancer-types" className="mt-4">
          <CancerTypesTab />
        </TabsContent>
        <TabsContent value="primary-sites" className="mt-4">
          <PrimarySitesTab />
        </TabsContent>
        <TabsContent value="site-mappings" className="mt-4">
          <SiteMappingsTab />
        </TabsContent>
        <TabsContent value="histologies" className="mt-4">
          <HistologiesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
