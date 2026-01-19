'use client';

import { useState, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useMedications } from '@/modules/foundation/hooks/use-catalogs';
import {
    usePrescriptionsByEncounter,
    useCreatePrescription,
    useDeletePrescription,
} from '@/modules/clinical/hooks/use-charting';
import type { Medication } from '@/modules/foundation/types/catalog';
import { DrugCodeSystem } from '@/modules/clinical/types/charting';

type MedicationSelection = {
    id: string;
    label: string;
    code: string;
    codeSystem: DrugCodeSystem;
    dosage: string;
    route: string;
    frequency: string;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value?: string) {
    return typeof value === 'string' && uuidPattern.test(value);
}

interface WardPrescriptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    encounterId: string;
    patientId: string;
    patientName: string;
    prescribedBy: string;
    onPrescriptionAdded?: (message: string) => void;
}

export function WardPrescriptionDialog({
    open,
    onOpenChange,
    encounterId,
    patientId,
    patientName,
    prescribedBy,
    onPrescriptionAdded,
}: WardPrescriptionDialogProps) {
    const [medicationSearch, setMedicationSearch] = useState('');
    const debouncedMedicationSearch = useDebouncedValue(medicationSearch.trim(), 200);
    const [isMedicationPopoverOpen, setIsMedicationPopoverOpen] = useState(false);
    const [removingPrescriptionId, setRemovingPrescriptionId] = useState<string | null>(null);
    const toast = useToast();

    const { data: prescriptions = [], isLoading: isPrescriptionsLoading } =
        usePrescriptionsByEncounter(encounterId);
    const { mutateAsync: createPrescription } = useCreatePrescription();
    const { mutateAsync: deletePrescription } = useDeletePrescription();
    const { data: medications } = useMedications({ search: debouncedMedicationSearch || undefined });

    const existingPrescriptionCodes = useMemo(
        () => new Set(prescriptions.map((p) => p.drugCode)),
        [prescriptions]
    );

    const mapMedicationToSelection = (medication: Medication): MedicationSelection => ({
        id: medication.id,
        label: medication.medicationName,
        code: medication.ndcCode || medication.localCode || medication.id,
        codeSystem:
            medication.ndcCode != null && medication.ndcCode !== ''
                ? DrugCodeSystem.NDC
                : medication.localCode
                    ? DrugCodeSystem.LOCAL
                    : DrugCodeSystem.RXNORM,
        dosage: medication.strength || 'As directed',
        route: medication.route || 'oral',
        frequency: medication.defaultFrequency || 'once daily',
    });

    const handleAddMedication = async (selection: MedicationSelection) => {
        if (!isUuid(prescribedBy)) {
            toast({
                variant: 'destructive',
                title: 'Unable to add prescription',
                description: 'Prescriber identity is missing or invalid.',
            });
            return;
        }
        console.log('WardPrescriptionDialog createPrescription payload', {
            encounterId,
            patientId,
            prescribedBy,
            drugCode: selection.code,
            codeSystem: selection.codeSystem,
            drugName: selection.label,
            dosage: selection.dosage,
            route: selection.route,
            frequency: selection.frequency,
        });
        if (existingPrescriptionCodes.has(selection.code)) {
            toast({
                variant: 'destructive',
                title: 'Prescription already exists',
                description: `${selection.code} is already prescribed for this encounter.`,
            });
            return;
        }

        try {
            await createPrescription({
                encounterId,
                patientId,
                drugCode: selection.code,
                codeSystem: selection.codeSystem,
                drugName: selection.label,
                dosage: selection.dosage,
                route: selection.route,
                frequency: selection.frequency,
                prescribedBy,
            });
            toast({ title: 'Prescription added', description: `${selection.label} created.` });
            onPrescriptionAdded?.(
                `Prescription added: ${selection.label} · ${selection.dosage} · ${selection.route} · ${selection.frequency}.`
            );
            setMedicationSearch('');
            setIsMedicationPopoverOpen(false);
        } catch (err) {
            console.error(err);
            toast({
                variant: 'destructive',
                title: 'Unable to add prescription',
                description: err instanceof Error ? err.message : 'Please try again.',
            });
        }
    };

    const handleRemovePrescription = async (prescriptionId: string, drugName: string) => {
        setRemovingPrescriptionId(prescriptionId);
        try {
            await deletePrescription({ id: prescriptionId, encounterId });
            toast({ title: 'Prescription removed', description: `${drugName} removed.` });
        } catch (err) {
            console.error(err);
            toast({
                variant: 'destructive',
                title: 'Unable to remove prescription',
                description: err instanceof Error ? err.message : 'Please try again.',
            });
        } finally {
            setRemovingPrescriptionId(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Medications</DialogTitle>
                    <DialogDescription>Manage prescriptions for {patientName}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <Popover open={isMedicationPopoverOpen} onOpenChange={setIsMedicationPopoverOpen}>
                            <PopoverTrigger asChild>
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search medications to prescribe..."
                                        value={medicationSearch}
                                        onChange={(event) => {
                                            setMedicationSearch(event.target.value);
                                            setIsMedicationPopoverOpen(true);
                                        }}
                                        className="pl-9"
                                    />
                                </div>
                            </PopoverTrigger>
                            <PopoverContent align="start" className="w-[min(480px,90vw)] p-0">
                                <div className="max-h-72 overflow-y-auto divide-y">
                                    {!medications || medications.length === 0 ? (
                                        <p className="p-3 text-sm text-muted-foreground">No medications found.</p>
                                    ) : (
                                        medications.map((medication) => {
                                            const selection = mapMedicationToSelection(medication);
                                            const disabled = existingPrescriptionCodes.has(selection.code);
                                            return (
                                                <button
                                                    type="button"
                                                    key={selection.id}
                                                    className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm ${disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-muted'
                                                        }`}
                                                    onClick={() => !disabled && handleAddMedication(selection)}
                                                    disabled={disabled}
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-medium">{selection.label}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {selection.codeSystem} · {selection.code}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {selection.dosage} · {selection.route} · {selection.frequency}
                                                        </p>
                                                        {disabled && (
                                                            <p className="text-xs text-amber-600">Already prescribed</p>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {isPrescriptionsLoading ? (
                        <p className="text-sm text-muted-foreground">Loading prescriptions...</p>
                    ) : prescriptions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No active prescriptions.</p>
                    ) : (
                        <div className="space-y-2">
                            {prescriptions.map((prescription) => (
                                <Card key={prescription.id} className="p-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="secondary" className="capitalize">
                                            {prescription.status}
                                        </Badge>
                                        <span className="font-semibold">{prescription.drugName}</span>
                                        <span className="font-mono text-xs text-muted-foreground">
                                            {prescription.drugCode}
                                        </span>
                                        <div className="ml-auto flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive"
                                                onClick={() => handleRemovePrescription(prescription.id, prescription.drugName)}
                                                disabled={removingPrescriptionId === prescription.id}
                                                aria-label="Remove prescription"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {prescription.dosage} · {prescription.route} · {prescription.frequency}
                                        {prescription.duration ? ` · Duration: ${prescription.duration}` : ''}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
