'use client';

import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { OrderAutocomplete, type OrderSelection } from '@/components/autocomplete/catalog-autocomplete.order';
import {
  useClinicalOrdersByEncounter,
  useCreateClinicalOrder,
  useDeleteClinicalOrder,
  useUpdateClinicalOrder,
} from '@/modules/clinical/hooks/use-charting';
import { OrderPriority, OrderType } from '@/modules/clinical/types/charting';
import type { ClinicalOrder } from '@/modules/clinical/types/charting';

type OrderFormState = {
  clinicalIndication: string;
  specialInstructions: string;
};

interface WardOrdersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  encounterId: string;
  patientId: string;
  patientName: string;
  orderedBy: string;
}

export function WardOrdersDialog({
  open,
  onOpenChange,
  encounterId,
  patientId,
  patientName,
  orderedBy,
}: WardOrdersDialogProps) {
  const { data: encounterOrders = [] } = useClinicalOrdersByEncounter(encounterId);
  const { mutateAsync: createOrder } = useCreateClinicalOrder();
  const { mutateAsync: updateClinicalOrder, isPending: isUpdatingOrder } = useUpdateClinicalOrder();
  const { mutateAsync: deleteOrder } = useDeleteClinicalOrder();
  const [orderCatalogType, setOrderCatalogType] = useState<'lab' | 'imaging' | 'procedure'>('lab');
  const [removingOrderId, setRemovingOrderId] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<ClinicalOrder | null>(null);
  const [orderForm, setOrderForm] = useState<OrderFormState>({ clinicalIndication: '', specialInstructions: '' });
  const toast = useToast();

  const existingOrderCodes = useMemo(
    () => new Set(encounterOrders.map((order) => order.orderCode)),
    [encounterOrders]
  );

  const handleAddOrder = async (selection: OrderSelection) => {
    if (existingOrderCodes.has(selection.code)) {
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
        orderedBy,
      });
      toast({ title: 'Order added', description: `${selection.label} created.` });
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Unable to add order',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  };

  const handleRemoveOrder = async (orderId: string) => {
    setRemovingOrderId(orderId);
    try {
      await deleteOrder({ id: orderId, encounterId });
      toast({ title: 'Order removed', description: 'Order removed from encounter.' });
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Unable to remove order',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setRemovingOrderId(null);
    }
  };

  const openEditOrder = (order: ClinicalOrder) => {
    setEditingOrder(order);
    setOrderForm({
      clinicalIndication: order.clinicalIndication ?? '',
      specialInstructions: order.specialInstructions ?? '',
    });
  };

  const closeEditOrder = () => {
    setEditingOrder(null);
    setOrderForm({ clinicalIndication: '', specialInstructions: '' });
  };

  const handleOrderFieldChange =
    (field: keyof OrderFormState) =>
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;
      setOrderForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;
    const payload = {
      clinicalIndication: orderForm.clinicalIndication.trim() || undefined,
      specialInstructions: orderForm.specialInstructions.trim() || undefined,
    };

    if (!payload.clinicalIndication && !payload.specialInstructions) {
      toast({
        variant: 'destructive',
        title: 'No updates provided',
        description: 'Add clinical indications or special instructions before saving.',
      });
      return;
    }

    try {
      await updateClinicalOrder({
        id: editingOrder.id,
        encounterId,
        data: payload,
      });
      toast({ title: 'Order updated', description: `${editingOrder.orderName} updated.` });
      closeEditOrder();
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Unable to update order',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Orders</DialogTitle>
            <DialogDescription>Manage clinical orders for {patientName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex-1">
                <OrderAutocomplete
                  type={orderCatalogType}
                  disabledCodes={existingOrderCodes}
                  onSelect={handleAddOrder}
                />
              </div>
              <Select value={orderCatalogType} onValueChange={(value) => setOrderCatalogType(value as 'lab' | 'imaging' | 'procedure')}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Catalog type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lab">Lab Tests</SelectItem>
                  <SelectItem value="imaging">Imaging Studies</SelectItem>
                  <SelectItem value="procedure">Procedures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {encounterOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <div className="space-y-2">
                {encounterOrders.map((order) => (
                  <Card key={order.id} className="p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {order.orderType}
                      </Badge>
                      <span className="font-semibold">{order.orderName}</span>
                      <span className="font-mono text-xs text-muted-foreground">{order.orderCode}</span>
                      <div className="ml-auto flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditOrder(order)} aria-label="Edit order">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleRemoveOrder(order.id)}
                          disabled={removingOrderId === order.id}
                          aria-label="Remove order"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Priority: {order.priority}</p>
                    {(order.clinicalIndication || order.specialInstructions) && (
                      <p className="text-xs text-muted-foreground">
                        {order.clinicalIndication && <span>Clinical indications: {order.clinicalIndication}</span>}
                        {order.clinicalIndication && order.specialInstructions ? ' · ' : ''}
                        {order.specialInstructions && <span>Special instructions: {order.specialInstructions}</span>}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editingOrder)} onOpenChange={(open) => !open && closeEditOrder()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit clinical order</DialogTitle>
            <DialogDescription>
              Provide context for why this order is needed and any handling notes for the care team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="order-clinical-info">Clinical indications</Label>
              <p className="text-xs text-muted-foreground">
                Summarize symptoms, differential diagnosis, or the clinical reasoning for requesting this order.
              </p>
              <Textarea
                id="order-clinical-info"
                value={orderForm.clinicalIndication}
                onChange={handleOrderFieldChange('clinicalIndication')}
                placeholder="e.g., Persistent chest pain with elevated troponin"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order-instructions">Special instructions</Label>
              <p className="text-xs text-muted-foreground">
                Call out patient prep, specimen handling, or coordination notes the lab/radiology team should follow.
              </p>
              <Textarea
                id="order-instructions"
                value={orderForm.specialInstructions}
                onChange={handleOrderFieldChange('specialInstructions')}
                placeholder="e.g., Fasting sample; call results to cardiology on completion"
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={closeEditOrder}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOrder} disabled={isUpdatingOrder}>
              {isUpdatingOrder ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
