'use client';

import { useState } from 'react';
import type { PluginPageProps } from '@/lib/plugins/types';
import { useStagings, useProtocols, useChemoOrders, useTumorBoardCases } from '../hooks/use-oncology';

const tabs = [
  { id: 'staging', label: 'Tumor Staging' },
  { id: 'protocols', label: 'Chemo Protocols' },
  { id: 'orders', label: 'Chemo Orders' },
  { id: 'tumor-board', label: 'Tumor Board' },
] as const;

type TabId = (typeof tabs)[number]['id'];

export function OncologyPage({ subPath }: PluginPageProps) {
  const initialTab = (subPath[0] as TabId) || 'staging';
  const [activeTab, setActiveTab] = useState<TabId>(
    tabs.some((t) => t.id === initialTab) ? initialTab : 'staging',
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Oncology</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage tumor staging, chemotherapy protocols, and tumor board cases
        </p>
      </div>

      <div className="flex gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'staging' && <StagingTab />}
      {activeTab === 'protocols' && <ProtocolsTab />}
      {activeTab === 'orders' && <OrdersTab />}
      {activeTab === 'tumor-board' && <TumorBoardTab />}
    </div>
  );
}

function StagingTab() {
  const { data, isLoading } = useStagings();

  if (isLoading) return <LoadingState />;

  const stagings = data?.data ?? [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Tumor Staging Records</h2>
      </div>
      {stagings.length === 0 ? (
        <EmptyState message="No tumor staging records found" />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Cancer Type</th>
                <th className="text-left p-3 font-medium">Stage</th>
                <th className="text-left p-3 font-medium">System</th>
                <th className="text-left p-3 font-medium">TNM</th>
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-left p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stagings.map((s: Record<string, unknown>) => (
                <tr key={s.id as string} className="hover:bg-muted/30">
                  <td className="p-3">{s.cancer_type as string}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                      {(s.stage_group as string) || '-'}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{s.staging_system as string}</td>
                  <td className="p-3 text-muted-foreground">
                    T{(s.t_category as string) || '?'} N{(s.n_category as string) || '?'} M{(s.m_category as string) || '?'}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(s.staging_date as string).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {s.status as string}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ProtocolsTab() {
  const { data, isLoading } = useProtocols();

  if (isLoading) return <LoadingState />;

  const protocols = data?.data ?? [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Chemotherapy Protocols</h2>
      </div>
      {protocols.length === 0 ? (
        <EmptyState message="No chemotherapy protocols configured" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {protocols.map((p: Record<string, unknown>) => (
            <div key={p.id as string} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{p.name as string}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                  {p.code as string}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{p.cancer_type as string}</p>
              <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
                <span>{p.total_cycles as number} cycles</span>
                <span>{p.cycle_duration_days as number} days/cycle</span>
                <span className="capitalize">{p.intent as string}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersTab() {
  const { data, isLoading } = useChemoOrders();

  if (isLoading) return <LoadingState />;

  const orders = data?.data ?? [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Chemotherapy Orders</h2>
      </div>
      {orders.length === 0 ? (
        <EmptyState message="No chemotherapy orders found" />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Protocol</th>
                <th className="text-left p-3 font-medium">Cycle</th>
                <th className="text-left p-3 font-medium">Scheduled</th>
                <th className="text-left p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o: Record<string, unknown>) => (
                <tr key={o.id as string} className="hover:bg-muted/30">
                  <td className="p-3">{(o.protocol_name as string) || (o.protocol_code as string)}</td>
                  <td className="p-3">C{o.cycle_number as number}D{o.day_number as number}</td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(o.scheduled_date as string).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={o.status as string} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TumorBoardTab() {
  const { data, isLoading } = useTumorBoardCases();

  if (isLoading) return <LoadingState />;

  const cases = data?.data ?? [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Tumor Board Cases</h2>
      </div>
      {cases.length === 0 ? (
        <EmptyState message="No tumor board cases found" />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Meeting Date</th>
                <th className="text-left p-3 font-medium">Decision</th>
                <th className="text-left p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {cases.map((c: Record<string, unknown>) => (
                <tr key={c.id as string} className="hover:bg-muted/30">
                  <td className="p-3">
                    {new Date(c.meeting_date as string).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {(c.decision as string) || 'Pending'}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={c.status as string} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    held: 'bg-orange-100 text-orange-700',
    scheduled: 'bg-blue-100 text-blue-700',
    in_review: 'bg-purple-100 text-purple-700',
    deferred: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-40">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-40 border rounded-lg bg-muted/20">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
