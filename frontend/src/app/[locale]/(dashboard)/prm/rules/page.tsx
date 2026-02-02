'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRules } from '@/modules/prm/hooks/use-rules';

export default function PrmRulesPage({ params }: { params: { locale: string } }) {
  const [category, setCategory] = useState('');
  const [isActive, setIsActive] = useState('all');

  const filters = useMemo(() => {
    const next: { category?: string; isActive?: boolean } = {};
    if (category.trim()) next.category = category.trim();
    if (isActive === 'true') next.isActive = true;
    if (isActive === 'false') next.isActive = false;
    return next;
  }, [category, isActive]);

  const { data, isLoading } = useRules(filters);
  const rules = Array.isArray(data) ? data : [];

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
          <CardTitle>Rules</CardTitle>
          <Button asChild>
            <Link href={`/${params.locale}/prm/rules/new`}>Create Rule</Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
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
          <CardTitle>Rule Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <p className="text-sm text-muted-foreground">Loading rules...</p>}
          {!isLoading && rules.length === 0 && (
            <p className="text-sm text-muted-foreground">No rules found.</p>
          )}
          {!isLoading && rules.length > 0 && (
            <div className="divide-y rounded-md border">
              {rules.map((rule: any, index: number) => {
                const id = rule.id || rule.rule_id || rule.code || String(index);
                return (
                  <div key={id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{rule.category ?? 'Uncategorized'}</p>
                      <p className="text-base font-semibold">{rule.name ?? rule.code ?? 'Untitled rule'}</p>
                      <p className="text-xs text-muted-foreground">
                        Trigger: {rule.trigger_event_type ?? 'Unknown'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {rule.is_active === false ? 'Inactive' : 'Active'}
                      </span>
                      {rule.id && (
                        <Button variant="outline" asChild>
                          <Link href={`/${params.locale}/prm/rules/${rule.id}`}>View</Link>
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
