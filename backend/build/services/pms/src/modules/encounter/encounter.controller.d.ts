import { EncounterService } from './encounter.service';
import { CreateEncounterDto, UpdateEncounterDto, EncounterQueryDto, EncounterSearchDto, CreateClinicalNoteDto, UpdateClinicalNoteDto, CreateVitalsDto, CreateOrderDto } from './dto/encounter.dto';
export declare class EncounterController {
    private readonly encounterService;
    constructor(encounterService: EncounterService);
    createEncounter(createEncounterDto: CreateEncounterDto): Promise<any>;
    getEncounters(query: EncounterQueryDto): Promise<any>;
    searchEncounters(searchDto: EncounterSearchDto): Promise<any[]>;
    getEncounterStats(query: Record<string, string>): Promise<any>;
    getEncounter(id: string): Promise<any>;
    updateEncounter(id: string, updateEncounterDto: UpdateEncounterDto): Promise<any>;
    deleteEncounter(id: string): Promise<{
        message: string;
    }>;
    startEncounter(id: string): Promise<any>;
    completeEncounter(id: string): Promise<any>;
    cancelEncounter(id: string, body: {
        reason: string;
    }): Promise<any>;
    getClinicalNotes(id: string): Promise<any[]>;
    createClinicalNote(id: string, createNoteDto: Omit<CreateClinicalNoteDto, 'encounterId'>): Promise<any>;
    updateClinicalNote(noteId: string, updateNoteDto: UpdateClinicalNoteDto): Promise<any>;
    deleteClinicalNote(noteId: string): Promise<{
        message: string;
    }>;
    signClinicalNote(noteId: string, body: {
        signedBy: string;
    }): Promise<any>;
    getVitals(id: string): Promise<any[]>;
    recordVitals(id: string, createVitalsDto: Omit<CreateVitalsDto, 'encounterId'>): Promise<any>;
    updateVitals(vitalId: string, updates: any): Promise<any>;
    getOrders(id: string): Promise<any[]>;
    createOrder(id: string, createOrderDto: Omit<CreateOrderDto, 'encounterId'>): Promise<any>;
    updateOrder(orderId: string, updates: any): Promise<any>;
    cancelOrder(orderId: string, body: {
        reason: string;
    }): Promise<any>;
}
//# sourceMappingURL=encounter.controller.d.ts.map