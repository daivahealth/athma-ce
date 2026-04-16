'use client';

import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { AlertTriangle, Clock, Eye } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useLowStockAlerts, useExpiringStockAlerts } from '@/modules/pharmacy/hooks/use-pharmacy-stock';

export default function PharmacyAlertsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const { data: lowStock = [], isLoading: isLoadingLow } = useLowStockAlerts();
  const { data: expiring = [], isLoading: isLoadingExpiry } = useExpiringStockAlerts(30);

  const totalAlerts = lowStock.length + expiring.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold">Pharmacy Alerts</h2>
        {totalAlerts > 0 && (
          <Badge variant="destructive">{totalAlerts}</Badge>
        )}
      </div>

      <Tabs defaultValue="low-stock">
        <TabsList>
          <TabsTrigger value="low-stock" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Low Stock
            {lowStock.length > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">{lowStock.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="expiring" className="gap-2">
            <Clock className="h-4 w-4" />
            Expiring Soon
            {expiring.length > 0 && (
              <Badge variant="outline" className="ml-1 text-xs text-amber-600 border-amber-400">
                {expiring.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="low-stock" className="mt-4">
          {isLoadingLow ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : lowStock.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>No low stock alerts</p>
            </div>
          ) : (
            <div className="space-y-2">
              {lowStock.map((stock) => (
                <Card key={stock.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{stock.drugName}</div>
                      <div className="text-sm text-muted-foreground">
                        Batch: {stock.batchNumber} · On hand:{' '}
                        <span className="text-destructive font-medium">
                          {Number(stock.quantityOnHand).toFixed(0)} {stock.unit}
                        </span>
                        {stock.reorderLevel != null && (
                          <> (reorder at {Number(stock.reorderLevel).toFixed(0)})</>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => router.push(`/${locale}/pharmacy/stock/${stock.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="expiring" className="mt-4">
          {isLoadingExpiry ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : expiring.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>No batches expiring in the next 30 days</p>
            </div>
          ) : (
            <div className="space-y-2">
              {expiring.map((stock) => {
                const daysUntilExpiry = Math.ceil(
                  (new Date(stock.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
                );
                return (
                  <Card key={stock.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{stock.drugName}</div>
                        <div className="text-sm text-muted-foreground">
                          Batch: {stock.batchNumber} · On hand: {Number(stock.quantityOnHand).toFixed(0)} {stock.unit} ·{' '}
                          <span className={daysUntilExpiry <= 7 ? 'text-destructive font-medium' : 'text-amber-600 font-medium'}>
                            Expires {format(new Date(stock.expiryDate), 'dd MMM yyyy')}
                            {' '}({daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''})
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => router.push(`/${locale}/pharmacy/stock/${stock.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
