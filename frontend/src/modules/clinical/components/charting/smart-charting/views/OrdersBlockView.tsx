'use client';

import { useMemo, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Trash2, GripVertical, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { OrderAutocomplete, type OrderSelection } from '@/components/autocomplete/catalog-autocomplete.order';
import {
  useEncounterChartOrders,
  useCreateClinicalOrder,
  useCreatePackageOrder,
  useCancelPackageOrder,
  useDeleteClinicalOrder,
} from '@/modules/clinical/hooks/use-charting';
import { useEncounter } from '@/modules/clinical/hooks/use-encounters';
import { OrderType, OrderPriority, CodeSystem } from '@/modules/clinical/types/charting';
import type { ChartPackageOrder, ClinicalOrder } from '@/modules/clinical/types/charting';
import { useToast } from '@/components/ui/use-toast';
import { useSmartChartingContext } from '../SmartChartingEditor';
import { BLOCK_COLORS } from '../types';

export function OrdersBlockView({ deleteNode }: NodeViewProps) {
  const { encounterId, patientId } = useSmartChartingContext();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [catalogType, setCatalogType] = useState<'lab' | 'imaging' | 'procedure' | 'package'>('lab');
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({});
  const toast = useToast();

  const { data: encounter } = useEncounter(encounterId);
  const { data: chartOrders } = useEncounterChartOrders(encounterId);
  const { mutateAsync: createOrder } = useCreateClinicalOrder();
  const { mutateAsync: createPackageOrder } = useCreatePackageOrder();
  const { mutateAsync: cancelPackageOrder } = useCancelPackageOrder();
  const { mutateAsync: deleteOrder } = useDeleteClinicalOrder();
  const standaloneOrders = chartOrders?.standaloneOrders ?? [];
  const packageOrders = chartOrders?.packageOrders ?? [];
  const allVisibleOrders = standaloneOrders.length + packageOrders.length;

  const existingCodes = useMemo(
    () =>
      new Set([
        ...standaloneOrders.map((order) => order.orderCode),
        ...packageOrders.flatMap((packageOrder) =>
          packageOrder.clinicalOrders.map((order) => order.orderCode),
        ),
      ]),
    [packageOrders, standaloneOrders]
  );
  const existingPackageOrderIds = useMemo(
    () => new Set(packageOrders.map((packageOrder) => packageOrder.packageId)),
    [packageOrders]
  );

  const handleSelectItem = async (selection: OrderSelection) => {
    if (!encounter) return;

    if (selection.type === 'package') {
      if (existingPackageOrderIds.has(selection.id)) {
        toast({
          variant: 'destructive',
          title: 'Package already added',
          description: `${selection.label} is already attached to this encounter.`,
        });
        return;
      }

      try {
        const packageOrder = await createPackageOrder({
          packageId: selection.id,
          encounterId,
          patientId,
          priority: OrderPriority.ROUTINE,
          orderedBy: encounter.primaryStaffId,
        });

        toast({
          title: 'Package added',
          description: `${selection.label} expanded into ${packageOrder.clinicalOrders.length} clinical orders.`,
        });
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Unable to add package',
          description: err instanceof Error ? err.message : 'Please try again.',
        });
      }
      return;
    }

    if (existingCodes.has(selection.code)) {
      toast({
        variant: 'destructive',
        title: 'Order already added',
        description: `${selection.code} is already attached to this encounter.`,
      });
      return;
    }

    try {
      const payload = {
        encounterId,
        patientId,
        orderType:
          selection.type === 'lab'
            ? OrderType.LAB
            : selection.type === 'imaging'
            ? OrderType.IMAGING
            : OrderType.PROCEDURE,
        orderCode: selection.code,
        codeSystem: selection.codeSystem as CodeSystem | string,
        orderName: selection.label,
        priority: OrderPriority.ROUTINE,
        orderedBy: encounter.primaryStaffId,
        ...(selection.type === 'lab'
          ? {
              labTests: [
                {
                  labTestMasterId: selection.id,
                  testCode: selection.code,
                  codeSystem: selection.codeSystem as CodeSystem | string,
                  testName: selection.label,
                  loincCode: selection.codeSystem === 'LOINC' ? selection.code : undefined,
                  cptCode: selection.codeSystem === 'CPT' ? selection.code : undefined,
                  quantity: 1,
                  sortOrder: 0,
                },
              ],
            }
          : selection.type === 'imaging'
          ? {
                  imagingDetails: [
                    {
                      imagingStudyMasterId: selection.id,
                      studyCode: selection.code,
                      codeSystem: selection.codeSystem as CodeSystem | string,
                      studyName: selection.label,
                      cptCode: selection.imagingMeta?.cptCode ?? undefined,
                      modality: selection.imagingMeta?.modality,
                      bodyPart: selection.imagingMeta?.bodyPart,
                      contrastRequired: selection.imagingMeta?.contrastRequired,
                      contrastType: selection.imagingMeta?.contrastType ?? undefined,
                      preparationInstructions:
                        selection.imagingMeta?.preparationInstructions ?? undefined,
                      quantity: 1,
                      sortOrder: 0,
                    },
              ],
            }
          : selection.type === 'procedure'
          ? {
                  procedureDetails: [
                    {
                      procedureMasterId: selection.id,
                      procedureCode: selection.code,
                      codeSystem: selection.codeSystem as CodeSystem | string,
                      procedureName: selection.label,
                      cptCode: selection.procedureMeta?.cptCode ?? undefined,
                      icd10PcsCode: selection.procedureMeta?.icd10PcsCode ?? undefined,
                      procedureCategory: selection.procedureMeta?.procedureCategory ?? undefined,
                      bodySystem: selection.procedureMeta?.bodySystem ?? undefined,
                      anesthesiaType: selection.procedureMeta?.anesthesiaType ?? undefined,
                      facilityRequired: selection.procedureMeta?.facilityRequired ?? undefined,
                      estimatedDurationMinutes: selection.procedureMeta?.estimatedDurationMinutes ?? undefined,
                      preparationInstructions:
                        selection.procedureMeta?.preparationInstructions ?? undefined,
                      consentRequired: selection.procedureMeta?.consentRequired,
                      quantity: 1,
                      sortOrder: 0,
                },
              ],
            }
          : {}),
      };

      await createOrder(payload);
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

  const handleCancelPackage = async (packageOrder: ChartPackageOrder) => {
    setRemovingId(packageOrder.id);
    try {
      await cancelPackageOrder({ id: packageOrder.id, encounterId });
      toast({
        title: 'Package cancelled',
        description: `${packageOrder.packageName} and its open child orders were cancelled.`,
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Unable to cancel package',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setRemovingId(null);
    }
  };

  const togglePackage = (packageOrderId: string) => {
    setExpandedPackages((current) => ({
      ...current,
      [packageOrderId]: !current[packageOrderId],
    }));
  };

  const renderChildOrderRow = (order: ClinicalOrder) => (
    <div key={order.id} className="ml-6 flex items-center gap-2 py-1 text-sm text-muted-foreground">
      <Badge variant="outline" className="capitalize text-[11px] font-normal">
        {order.orderType}
      </Badge>
      <span className="font-medium text-foreground">{order.orderName}</span>
      <span className="text-xs">{order.orderCode}</span>
      {(order.status === 'completed' || order.resultStatus) && (
        <Link
          href={`/${locale}/results/${order.orderType}/${order.id}`}
          className="ml-auto flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
        >
          <FileText className="h-3 w-3" />
          Results
        </Link>
      )}
    </div>
  );

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
          <div className="space-y-2">
            <ToggleGroup
              type="single"
              value={catalogType}
              onValueChange={(value) => value && setCatalogType(value as 'lab' | 'imaging' | 'procedure' | 'package')}
              className="flex flex-wrap justify-start gap-2 rounded-xl bg-muted/40 p-1"
            >
              <ToggleGroupItem
                value="lab"
                aria-label="Lab tests"
                variant="outline"
                className="rounded-full px-3 text-muted-foreground data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm data-[state=on]:ring-2 data-[state=on]:ring-primary/20"
              >
                Lab
              </ToggleGroupItem>
              <ToggleGroupItem
                value="imaging"
                aria-label="Imaging studies"
                variant="outline"
                className="rounded-full px-3 text-muted-foreground data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm data-[state=on]:ring-2 data-[state=on]:ring-primary/20"
              >
                Imaging
              </ToggleGroupItem>
              <ToggleGroupItem
                value="procedure"
                aria-label="Procedures"
                variant="outline"
                className="rounded-full px-3 text-muted-foreground data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm data-[state=on]:ring-2 data-[state=on]:ring-primary/20"
              >
                Procedure
              </ToggleGroupItem>
              <div className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
              <ToggleGroupItem
                value="package"
                aria-label="Packages"
                variant="outline"
                className="rounded-full px-3 text-muted-foreground data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm data-[state=on]:ring-2 data-[state=on]:ring-primary/20"
              >
                Package
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="flex-1">
              <OrderAutocomplete
                type={catalogType}
                disabledCodes={existingCodes}
                disabledIds={existingPackageOrderIds}
                onSelect={handleSelectItem}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {catalogType === 'package'
                ? 'Packages create grouped orders for the encounter.'
                : `Add ${catalogType === 'lab' ? 'lab tests' : catalogType === 'imaging' ? 'imaging studies' : 'procedures'} directly to the encounter.`}
            </p>
          </div>
          {allVisibleOrders === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="space-y-2">
              {packageOrders.map((packageOrder) => {
                const isExpanded = Boolean(expandedPackages[packageOrder.id]);
                return (
                  <div key={packageOrder.id} className="rounded-md border bg-muted/20 px-3 py-2">
                    <div className="flex items-center gap-2 text-sm">
                      <button
                        type="button"
                        onClick={() => togglePackage(packageOrder.id)}
                        className="flex items-center gap-2 text-left"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Badge variant="secondary" className="text-[11px] font-normal uppercase">
                          Package
                        </Badge>
                        <span className="font-medium">{packageOrder.packageName}</span>
                      </button>
                      <span className="text-xs text-muted-foreground">{packageOrder.packageCode}</span>
                      <span className="text-xs text-muted-foreground">
                        {packageOrder.childOrderCount} orders
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {packageOrder.childTypeSummary.lab > 0 ? `${packageOrder.childTypeSummary.lab} lab` : null}
                        {packageOrder.childTypeSummary.lab > 0 &&
                        (packageOrder.childTypeSummary.imaging > 0 ||
                          packageOrder.childTypeSummary.procedure > 0)
                          ? ' · '
                          : null}
                        {packageOrder.childTypeSummary.imaging > 0
                          ? `${packageOrder.childTypeSummary.imaging} imaging`
                          : null}
                        {packageOrder.childTypeSummary.imaging > 0 &&
                        packageOrder.childTypeSummary.procedure > 0
                          ? ' · '
                          : null}
                        {packageOrder.childTypeSummary.procedure > 0
                          ? `${packageOrder.childTypeSummary.procedure} procedure`
                          : null}
                      </span>
                      <Badge variant="outline" className="ml-auto capitalize text-xs font-normal">
                        {packageOrder.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleCancelPackage(packageOrder)}
                        disabled={removingId === packageOrder.id}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    {isExpanded && (
                      <div className="mt-2 space-y-1">
                        {packageOrder.clinicalOrders.map(renderChildOrderRow)}
                      </div>
                    )}
                  </div>
                );
              })}
              {standaloneOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-2 py-1.5 text-sm">
                  <Badge variant="outline" className="capitalize text-xs font-normal">
                    {order.orderType}
                  </Badge>
                  <span className="font-medium">{order.orderName}</span>
                  <span className="text-xs text-muted-foreground">{order.orderCode}</span>
                  {(order.status === 'completed' || order.resultStatus) && (
                    <Link
                      href={`/${locale}/results/${order.orderType}/${order.id}`}
                      className="ml-auto flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      <FileText className="h-3 w-3" />
                      Results
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 p-0 ${order.status === 'completed' || order.resultStatus ? '' : 'ml-auto'} text-muted-foreground hover:text-destructive`}
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
