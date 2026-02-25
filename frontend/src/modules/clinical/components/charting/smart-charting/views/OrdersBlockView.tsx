'use client';

import { useMemo, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, GripVertical } from 'lucide-react';
import { OrderAutocomplete, type OrderSelection } from '@/components/autocomplete/catalog-autocomplete.order';
import {
  useClinicalOrdersByEncounter,
  useCreateClinicalOrder,
  useDeleteClinicalOrder,
} from '@/modules/clinical/hooks/use-charting';
import { useEncounter } from '@/modules/clinical/hooks/use-encounters';
import { OrderType, OrderPriority } from '@/modules/clinical/types/charting';
import { useToast } from '@/components/ui/use-toast';
import { useSmartChartingContext } from '../SmartChartingEditor';
import { BLOCK_COLORS } from '../types';

export function OrdersBlockView({ deleteNode }: NodeViewProps) {
  const { encounterId, patientId } = useSmartChartingContext();
  const [catalogType, setCatalogType] = useState<'lab' | 'imaging' | 'procedure'>('lab');
  const [removingId, setRemovingId] = useState<string | null>(null);
  const toast = useToast();

  const { data: encounter } = useEncounter(encounterId);
  const { data: orders = [] } = useClinicalOrdersByEncounter(encounterId);
  const { mutateAsync: createOrder } = useCreateClinicalOrder();
  const { mutateAsync: deleteOrder } = useDeleteClinicalOrder();

  const existingCodes = useMemo(
    () => new Set(orders.map((o) => o.orderCode)),
    [orders]
  );

  const handleAddOrder = async (selection: OrderSelection) => {
    if (!encounter) return;

    if (existingCodes.has(selection.code)) {
      toast({
        variant: 'destructive',
        title: 'Order already added',
        description: `${selection.code} is already attached to this encounter.`,
      });
      return;
    }

    try {
      await createOrder({
        encounterId,
        patientId,
        orderType:
          selection.type === 'lab'
            ? OrderType.LAB
            : selection.type === 'imaging'
            ? OrderType.IMAGING
            : OrderType.PROCEDURE,
        orderCode: selection.code,
        codeSystem: selection.codeSystem,
        orderName: selection.label,
        priority: OrderPriority.ROUTINE,
        orderedBy: encounter.primaryStaffId,
      });
      toast({
        title: 'Order added',
        description: `${selection.label} created.`,
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Unable to add order',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  };

  const handleRemoveOrder = async (orderId: string) => {
    setRemovingId(orderId);
    try {
      await deleteOrder({ id: orderId, encounterId });
      toast({
        title: 'Order removed',
        description: 'Order removed from encounter.',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Unable to remove order',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <NodeViewWrapper className="smart-charting-block my-3">
      <div className="group">
        <div
          contentEditable={false}
          className="flex items-center gap-2 mb-2"
          data-drag-handle
        >
          <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Orders
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={deleteNode}
            className="h-6 w-6 p-0 ml-auto text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div contentEditable={false} className={`pl-6 space-y-3 border-l-2 ${BLOCK_COLORS.orders}`}>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="flex-1">
              <OrderAutocomplete
                type={catalogType}
                disabledCodes={existingCodes}
                onSelect={handleAddOrder}
              />
            </div>
            <Select value={catalogType} onValueChange={(value) => setCatalogType(value as 'lab' | 'imaging' | 'procedure')}>
              <SelectTrigger className="md:w-40 h-9">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lab">Lab Tests</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="procedure">Procedures</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="space-y-2">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center gap-2 py-1.5 text-sm">
                  <Badge variant="outline" className="capitalize text-xs font-normal">
                    {order.orderType}
                  </Badge>
                  <span className="font-medium">{order.orderName}</span>
                  <span className="text-xs text-muted-foreground">{order.orderCode}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-auto text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveOrder(order.id)}
                    disabled={removingId === order.id}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
}
