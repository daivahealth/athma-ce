'use client';

import { useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  useCreateVitalSignsTemplate,
  useVitalAgeGroups,
  useVitalCareSettings,
} from '@/modules/clinical/hooks/use-vital-signs-templates';
import type { CareSetting, AgeGroup } from '@/modules/clinical/types/vital-signs-template';

type ItemForm = {
  id: string;
  code: string;
  type: 'number' | 'text' | 'select' | 'multiselect' | 'boolean' | 'calculated';
  labelEn: string;
  labelAr: string;
  defaultUnit?: string;
  sortOrder: number;
  required: boolean;
  optionsText?: string;
};

type GroupForm = {
  id: string;
  labelEn: string;
  labelAr: string;
  sortOrder: number;
  items: ItemForm[];
};

const careSettingLabels: Record<string, string> = {
  OPD: 'OPD',
  ER: 'ER',
  IPD: 'IPD',
  ICU: 'ICU',
  DAYCARE: 'Daycare',
  ANY: 'Any',
};

const ageGroupLabels: Record<string, string> = {
  newborn: 'Newborn',
  infant: 'Infant',
  child: 'Child',
  adolescent: 'Adolescent',
  adult: 'Adult',
  elderly: 'Elderly',
  all: 'All',
};

export default function NewVitalSignsTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { toast } = useToast();

  const { data: careSettings } = useVitalCareSettings();
  const { data: ageGroups } = useVitalAgeGroups();
  const { mutateAsync: createTemplate, isPending } = useCreateVitalSignsTemplate();

  const [templateCode, setTemplateCode] = useState('');
  const [version, setVersion] = useState<number>(1);
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [selectedCareSettings, setSelectedCareSettings] = useState<CareSetting[]>([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<AgeGroup[]>([]);
  const [specialties, setSpecialties] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isDefault, setIsDefault] = useState(false);
  const [groups, setGroups] = useState<GroupForm[]>([
    {
      id: 'basic_vitals',
      labelEn: 'Basic Vitals',
      labelAr: 'العلامات الحيوية الأساسية',
      sortOrder: 1,
      items: [
        {
          id: 'heart_rate',
          code: 'HR',
          type: 'number',
          labelEn: 'Heart Rate',
          labelAr: 'معدل ضربات القلب',
          defaultUnit: 'bpm',
          sortOrder: 1,
          required: true,
        },
      ],
    },
  ]);

  const toggleCareSetting = (setting: CareSetting) => {
    setSelectedCareSettings((prev) =>
      prev.includes(setting) ? prev.filter((s) => s !== setting) : [...prev, setting],
    );
  };

  const toggleAgeGroup = (age: AgeGroup) => {
    setSelectedAgeGroups((prev) =>
      prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age],
    );
  };

  const addGroup = () => {
    const nextIndex = groups.length + 1;
    setGroups([
      ...groups,
      {
        id: `group_${nextIndex}`,
        labelEn: `Group ${nextIndex}`,
        labelAr: `مجموعة ${nextIndex}`,
        sortOrder: nextIndex,
        items: [],
      },
    ]);
  };

  const removeGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const updateGroup = (groupId: string, updater: (group: GroupForm) => GroupForm) => {
    setGroups((prev) => prev.map((group) => (group.id === groupId ? updater(group) : group)));
  };

  const addItem = (groupId: string) => {
    updateGroup(groupId, (group) => {
      const nextIndex = group.items.length + 1;
      return {
        ...group,
        items: [
          ...group.items,
          {
            id: `${groupId}_item_${nextIndex}`,
            code: `${groupId.toUpperCase()}_${nextIndex}`,
            type: 'number',
            labelEn: `Item ${nextIndex}`,
            labelAr: `عنصر ${nextIndex}`,
            sortOrder: nextIndex,
            required: false,
          },
        ],
      };
    });
  };

  const removeItem = (groupId: string, itemId: string) => {
    updateGroup(groupId, (group) => ({
      ...group,
      items: group.items.filter((item) => item.id !== itemId),
    }));
  };

  const updateItem = (groupId: string, itemId: string, updater: (item: ItemForm) => ItemForm) => {
    updateGroup(groupId, (group) => ({
      ...group,
      items: group.items.map((item) => (item.id === itemId ? updater(item) : item)),
    }));
  };

  const validate = () => {
    if (!templateCode.trim()) return 'Template code is required.';
    if (!nameEn.trim()) return 'Template name (EN) is required.';
    if (!selectedCareSettings.length) return 'Select at least one care setting.';
    if (!selectedAgeGroups.length) return 'Select at least one age group.';
    if (!groups.length) return 'Add at least one group.';
    if (groups.some((g) => !g.items.length)) return 'Each group must have at least one item.';
    return null;
  };

  const handleSubmit = async () => {
    const errorMsg = validate();
    if (errorMsg) {
      toast({ variant: 'destructive', title: 'Cannot create template', description: errorMsg });
      return;
    }

    try {
      const payload = {
        templateCode: templateCode.trim(),
        version: version || 1,
        name: { en: nameEn.trim(), ar: nameAr.trim() || nameEn.trim() },
        description:
          descriptionEn || descriptionAr
            ? { en: descriptionEn.trim(), ar: descriptionAr.trim() || descriptionEn.trim() }
            : undefined,
        careSetting: selectedCareSettings,
        ageGroup: selectedAgeGroups,
        specialties: specialties
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        groups: groups.map((group, groupIndex) => ({
          id: group.id,
          label: {
            en: group.labelEn.trim() || `Group ${groupIndex + 1}`,
            ar: group.labelAr.trim() || group.labelEn.trim() || `Group ${groupIndex + 1}`,
          },
          sortOrder: group.sortOrder || groupIndex + 1,
          items: group.items.map((item, itemIndex) => ({
            id: item.id,
            code: item.code,
            type: item.type,
            label: {
              en: item.labelEn.trim() || `Item ${itemIndex + 1}`,
              ar: item.labelAr.trim() || item.labelEn.trim() || `Item ${itemIndex + 1}`,
            },
            defaultUnit: item.defaultUnit || undefined,
            unitOptions: item.defaultUnit ? [item.defaultUnit] : undefined,
            normalRange: undefined,
            sortOrder: item.sortOrder || itemIndex + 1,
            required: item.required,
            options: item.optionsText
              ? item.optionsText
                  .split(',')
                  .map((opt) => opt.trim())
                  .filter(Boolean)
                  .map((value) => ({ value, label: { en: value, ar: value } }))
              : undefined,
          })),
        })),
        isActive,
        isDefault,
      };

      const created = await createTemplate(payload);
      toast({ title: 'Template created', description: `${created.templateCode} added successfully.` });
      router.push(`/${locale}/catalogs/vital-signs-templates/${created.id}`);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Failed to create template',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">New Vital Signs Template</h1>
          <p className="text-muted-foreground">
            Define care setting, age groups, specialties, and vital groups/items.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/${locale}/catalogs/vital-signs-templates`}>
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Saving...' : 'Create template'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Template code</Label>
            <Input value={templateCode} onChange={(e) => setTemplateCode(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Version</Label>
            <Input
              type="number"
              min={1}
              value={version}
              onChange={(e) => setVersion(Number(e.target.value) || 1)}
            />
          </div>
          <div className="space-y-2">
            <Label>Name (EN)</Label>
            <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Name (AR)</Label>
            <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description (EN)</Label>
            <Textarea value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description (AR)</Label>
            <Textarea value={descriptionAr} onChange={(e) => setDescriptionAr(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Specialties (comma separated)</Label>
            <Input
              placeholder="GEN_MED, CARDIO"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch id="is-active" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="is-active">Active</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="is-default" checked={isDefault} onCheckedChange={setIsDefault} />
              <Label htmlFor="is-default">Default for context</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Context</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium">Care settings</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(careSettings || []).map((setting) => {
                const selected = selectedCareSettings.includes(setting as CareSetting);
                return (
                  <Button
                    key={setting}
                    type="button"
                    variant={selected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleCareSetting(setting as CareSetting)}
                  >
                    {careSettingLabels[setting] || setting}
                  </Button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Age groups</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(ageGroups || []).map((age) => {
                const selected = selectedAgeGroups.includes(age as AgeGroup);
                return (
                  <Button
                    key={age}
                    type="button"
                    variant={selected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleAgeGroup(age as AgeGroup)}
                  >
                    {ageGroupLabels[age] || age}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Groups & Items</CardTitle>
            <p className="text-sm text-muted-foreground">Add groups and vital items within each group.</p>
          </div>
          <Button variant="outline" size="sm" onClick={addGroup}>
            <Plus className="mr-2 h-4 w-4" />
            Add group
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {groups.map((group) => (
            <div key={group.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 grid gap-3 md:grid-cols-3">
                  <div className="space-y-1">
                    <Label>Group ID</Label>
                    <Input
                      value={group.id}
                      onChange={(e) =>
                        updateGroup(group.id, (g) => ({ ...g, id: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Label (EN)</Label>
                    <Input
                      value={group.labelEn}
                      onChange={(e) =>
                        updateGroup(group.id, (g) => ({ ...g, labelEn: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Label (AR)</Label>
                    <Input
                      value={group.labelAr}
                      onChange={(e) =>
                        updateGroup(group.id, (g) => ({ ...g, labelAr: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Sort order</Label>
                    <Input
                      type="number"
                      value={group.sortOrder}
                      onChange={(e) =>
                        updateGroup(group.id, (g) => ({ ...g, sortOrder: Number(e.target.value) || 1 }))
                      }
                    />
                  </div>
                </div>
                {groups.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => removeGroup(group.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Items</p>
                <Button variant="outline" size="sm" onClick={() => addItem(group.id)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add item
                </Button>
              </div>

              <div className="space-y-3">
                {group.items.map((item) => (
                  <div key={item.id} className="rounded border p-3">
                    <div className="flex items-start gap-3">
                      <div className="grid flex-1 gap-2 md:grid-cols-3">
                        <div className="space-y-1">
                          <Label>Item ID</Label>
                          <Input
                            value={item.id}
                            onChange={(e) =>
                              updateItem(group.id, item.id, (it) => ({ ...it, id: e.target.value }))
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Code</Label>
                          <Input
                            value={item.code}
                            onChange={(e) =>
                              updateItem(group.id, item.id, (it) => ({ ...it, code: e.target.value }))
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Type</Label>
                          <select
                            className="w-full rounded border border-input bg-transparent p-2 text-sm"
                            value={item.type}
                            onChange={(e) =>
                              updateItem(group.id, item.id, (it) => ({
                                ...it,
                                type: e.target.value as ItemForm['type'],
                              }))
                            }
                          >
                            <option value="number">Number</option>
                            <option value="text">Text</option>
                            <option value="select">Select</option>
                            <option value="multiselect">Multiselect</option>
                            <option value="boolean">Boolean</option>
                            <option value="calculated">Calculated</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <Label>Label (EN)</Label>
                          <Input
                            value={item.labelEn}
                            onChange={(e) =>
                              updateItem(group.id, item.id, (it) => ({ ...it, labelEn: e.target.value }))
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Label (AR)</Label>
                          <Input
                            value={item.labelAr}
                            onChange={(e) =>
                              updateItem(group.id, item.id, (it) => ({ ...it, labelAr: e.target.value }))
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Default unit</Label>
                          <Input
                            value={item.defaultUnit || ''}
                            onChange={(e) =>
                              updateItem(group.id, item.id, (it) => ({ ...it, defaultUnit: e.target.value }))
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Options (comma separated)</Label>
                          <Input
                            value={item.optionsText || ''}
                            onChange={(e) =>
                              updateItem(group.id, item.id, (it) => ({ ...it, optionsText: e.target.value }))
                            }
                            placeholder="High, Normal, Low"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Sort order</Label>
                          <Input
                            type="number"
                            value={item.sortOrder}
                            onChange={(e) =>
                              updateItem(group.id, item.id, (it) => ({
                                ...it,
                                sortOrder: Number(e.target.value) || 1,
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                          <Switch
                            id={`${item.id}-required`}
                            checked={item.required}
                            onCheckedChange={(checked) =>
                              updateItem(group.id, item.id, (it) => ({ ...it, required: checked }))
                            }
                          />
                          <Label htmlFor={`${item.id}-required`}>Required</Label>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeItem(group.id, item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {group.items.length === 0 && (
                  <p className="text-sm text-muted-foreground">Add at least one item to this group.</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
