'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTemplates } from '@/modules/prm/hooks/use-templates';

export default function PrmTemplatesPage({ params }: { params: { locale: string } }) {
  const [channel, setChannel] = useState('all');
  const [language, setLanguage] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setIsActive] = useState('all');

  const filters = useMemo(() => {
    const next: { channel?: string; language?: string; category?: string; isActive?: boolean } = {};
    if (channel !== 'all' && channel.trim()) next.channel = channel.trim();
    if (language.trim()) next.language = language.trim();
    if (category.trim()) next.category = category.trim();
    if (isActive === 'true') next.isActive = true;
    if (isActive === 'false') next.isActive = false;
    return next;
  }, [channel, language, category, isActive]);

  const { data, isLoading } = useTemplates(filters);
  const templates = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${params.locale}/pe-setup`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Templates</CardTitle>
          <Button asChild>
            <Link href={`/${params.locale}/prm/templates/new`}>Create Template</Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Channel</Label>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="in_app">In App</SelectItem>
                <SelectItem value="push">Push</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input id="language" value={language} onChange={(event) => setLanguage(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={category} onChange={(event) => setCategory(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Active</Label>
            <Select value={isActive} onValueChange={setIsActive}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <p className="text-sm text-muted-foreground">Loading templates...</p>}
          {!isLoading && templates.length === 0 && (
            <p className="text-sm text-muted-foreground">No templates found.</p>
          )}
          {!isLoading && templates.length > 0 && (
            <div className="divide-y rounded-md border">
              {templates.map((template: any, index: number) => {
                const id = template.id || template.template_id || template.code || String(index);
                return (
                  <div key={id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{template.channel ?? 'Unknown channel'}</p>
                      <p className="text-base font-semibold">{template.name ?? template.code ?? 'Untitled template'}</p>
                      <p className="text-xs text-muted-foreground">
                        Category: {template.category ?? 'Uncategorized'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {template.is_active === false ? 'Inactive' : 'Active'}
                      </span>
                      {template.id && (
                        <Button variant="outline" asChild>
                          <Link href={`/${params.locale}/prm/templates/${template.id}`}>View</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
