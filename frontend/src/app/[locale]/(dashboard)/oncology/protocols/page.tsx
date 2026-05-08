'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Pencil, Plus, PowerOff, Search } from 'lucide-react';
import { useProtocols, useDeactivateProtocol } from '@/plugins/oncology/hooks/use-oncology';
import { LoadingState } from '@/plugins/oncology/components/shared';
import type { ChemoProtocol } from '@/plugins/oncology/types';

const EMETOGENIC_COLORS: Record<string, string> = {
  minimal: 'bg-green-100 text-green-700',
  low: 'bg-blue-100 text-blue-700',
  moderate: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

export default function ProtocolsPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [cancerTypeFilter, setCancerTypeFilter] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  const { data, isLoading } = useProtocols();
  const deactivate = useDeactivateProtocol();

  const allProtocols: ChemoProtocol[] = data?.data ?? [];

  const protocols = allProtocols.filter((p) => {
    if (!showInactive && !p.is_active) return false;
    if (cancerTypeFilter && !p.cancer_type.toLowerCase().includes(cancerTypeFilter.toLowerCase())) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.cancer_type.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chemo Protocols</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Standardised chemotherapy regimen library
          </p>
        </div>
        <Button onClick={() => router.push(`/${params.locale}/oncology/protocols/new`)}>
          <Plus className="h-4 w-4 mr-2" />Create Protocol
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by code, name, or cancer type..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Input
          placeholder="Filter by cancer type..."
          className="w-[200px]"
          value={cancerTypeFilter}
          onChange={(e) => setCancerTypeFilter(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="rounded border-gray-300"
          />
          Show inactive
        </label>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : protocols.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 border rounded-lg bg-muted/20 space-y-4">
          <FlaskConical className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            {allProtocols.length === 0 ? 'No protocols yet' : 'No protocols match the current filters'}
          </p>
          {allProtocols.length === 0 && (
            <Button variant="outline" onClick={() => router.push(`/${params.locale}/oncology/protocols/new`)}>
              <Plus className="h-4 w-4 mr-2" />Create First Protocol
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Code</th>
                <th className="text-left p-3 font-medium">Protocol Name</th>
                <th className="text-left p-3 font-medium">Cancer Type</th>
                <th className="text-left p-3 font-medium">Intent</th>
                <th className="text-left p-3 font-medium">Cycles</th>
                <th className="text-left p-3 font-medium">Emetogenic Risk</th>
                <th className="text-left p-3 font-medium">Drugs</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="p-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {protocols.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono text-xs font-semibold">{p.code}</td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-muted-foreground text-xs">{p.cancer_type}</td>
                  <td className="p-3 capitalize text-xs">{p.intent}</td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {p.total_cycles} × {p.cycle_duration_days}d
                  </td>
                  <td className="p-3">
                    {p.emetogenic_risk ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${EMETOGENIC_COLORS[p.emetogenic_risk] ?? 'bg-muted text-muted-foreground'}`}>
                        {p.emetogenic_risk}
                      </span>
                    ) : <span className="text-muted-foreground text-xs">—</span>}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {p.regimen?.length ?? 0} drug{(p.regimen?.length ?? 0) !== 1 ? 's' : ''}
                  </td>
                  <td className="p-3">
                    <Badge variant={p.is_active ? 'default' : 'secondary'} className="text-xs">
                      {p.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="p-3 flex gap-1 justify-end">
                    <Button
                      variant="ghost" size="sm" className="h-7 w-7 p-0"
                      onClick={() => router.push(`/${params.locale}/oncology/protocols/${p.id}/edit`)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    {p.is_active && (
                      <Button
                        variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => deactivate.mutate(p.id)}
                        disabled={deactivate.isPending}
                      >
                        <PowerOff className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-3 py-2 bg-muted/20 border-t text-xs text-muted-foreground">
            {protocols.length} protocol{protocols.length !== 1 ? 's' : ''}
            {protocols.length !== allProtocols.length && ` (filtered from ${allProtocols.length})`}
          </div>
        </div>
      )}
    </div>
  );
}
