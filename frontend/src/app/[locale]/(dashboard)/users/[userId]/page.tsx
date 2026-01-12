'use client';

import Link from 'next/link';
import { ArrowLeft, Building2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useUserFacilities } from '@/modules/foundation/hooks/use-user';

export default function UserDetailPage({
  params,
}: {
  params: { locale: string; userId: string };
}) {
  const { data: user, isLoading: userLoading } = useUser(params.userId);
  const { data: facilityAccess, isLoading: facilitiesLoading } = useUserFacilities(params.userId, {
    enabled: !!user,
  });

  const displayName =
    user?.displayName || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.email || 'User';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/${params.locale}/users`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{displayName}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email ?? 'User details'}</p>
      </div>

      {userLoading && <p className="text-sm text-slate-500 dark:text-slate-400">Loading user...</p>}

      {user && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-wide text-slate-500">Role</p>
            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              <ShieldCheck className="h-4 w-4 text-slate-400" />
              {user.role ?? 'User'}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
            <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              {user.status ?? 'active'}
            </p>
          </div>
        </div>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Mapped Facilities</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Facilities assigned to this user and their access level.
            </p>
          </div>
        </div>

        {facilitiesLoading && (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading facilities...</p>
        )}

        {!facilitiesLoading && (!facilityAccess?.facilities?.length) && (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            No facilities mapped to this user.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {facilityAccess?.facilities?.map((facility) => (
            <div
              key={facility.id}
              className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {facility.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {[facility.city, facility.emirate].filter(Boolean).join(', ')}
                  </p>
                </div>
                {facility.isDefault && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    Default
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Building2 className="h-4 w-4 text-slate-400" />
                {facility.facilityType ?? 'Facility'}
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Access level: {facility.accessLevel ?? 'standard'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
