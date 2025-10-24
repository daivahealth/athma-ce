/**
 * Patient History Controller
 *
 * REST API endpoints for patient history tracking
 */
import { PatientHistoryService } from './patient-history.service';
declare class HistoryQueryDto {
    limit?: number;
    offset?: number;
}
export declare class PatientHistoryController {
    private readonly historyService;
    constructor(historyService: PatientHistoryService);
    /**
     * GET /patients/:patientId/history - Get patient history
     */
    getHistory(patientId: string, query: HistoryQueryDto, req: any): Promise<{
        fieldName: string;
        changeType: string;
        id: string;
        tenantId: string;
        patientId: string;
        oldValue: string | null;
        newValue: string | null;
        changeReason: string | null;
        supportingDocUrl: string | null;
        changedBy: string;
        approvedBy: string | null;
        changedAtFacility: string | null;
        changedAt: Date;
        patientConsent: boolean;
        consentDocUrl: string | null;
        ipAddress: string | null;
        userAgent: string | null;
    }[]>;
    /**
     * GET /patients/:patientId/history/field/:fieldName - Get field history
     */
    getFieldHistory(patientId: string, fieldName: string, req: any): Promise<{
        fieldName: string;
        changeType: string;
        id: string;
        tenantId: string;
        patientId: string;
        oldValue: string | null;
        newValue: string | null;
        changeReason: string | null;
        supportingDocUrl: string | null;
        changedBy: string;
        approvedBy: string | null;
        changedAtFacility: string | null;
        changedAt: Date;
        patientConsent: boolean;
        consentDocUrl: string | null;
        ipAddress: string | null;
        userAgent: string | null;
    }[]>;
    /**
     * GET /patients/:patientId/history/pending-approvals - Get pending approvals
     */
    getPendingApprovals(req: any): Promise<{
        fieldName: string;
        changeType: string;
        id: string;
        tenantId: string;
        patientId: string;
        oldValue: string | null;
        newValue: string | null;
        changeReason: string | null;
        supportingDocUrl: string | null;
        changedBy: string;
        approvedBy: string | null;
        changedAtFacility: string | null;
        changedAt: Date;
        patientConsent: boolean;
        consentDocUrl: string | null;
        ipAddress: string | null;
        userAgent: string | null;
    }[]>;
    /**
     * GET /patients/:patientId/history/stats - Get change statistics
     */
    getStats(req: any): Promise<(import("@zeal/database-clinical").Prisma.PickEnumerable<import("@zeal/database-clinical").Prisma.PatientHistoryGroupByOutputType, any[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
export {};
//# sourceMappingURL=patient-history.controller.d.ts.map