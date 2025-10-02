import { EncounterRepository } from './encounter.repository';
import { CreateEncounterDto, UpdateEncounterDto, EncounterQueryDto, EncounterSearchDto, CreateClinicalNoteDto, UpdateClinicalNoteDto, CreateVitalsDto, CreateOrderDto } from './dto/encounter.dto';
export declare class EncounterService {
    private readonly encounterRepository;
    constructor(encounterRepository: EncounterRepository);
    createEncounter(createEncounterDto: CreateEncounterDto): Promise<any>;
    getEncounters(query: EncounterQueryDto): Promise<any>;
    searchEncounters(searchDto: EncounterSearchDto): Promise<any[]>;
    getEncounterById(id: string): Promise<any>;
    updateEncounter(id: string, updateEncounterDto: UpdateEncounterDto): Promise<any>;
    deleteEncounter(id: string): Promise<void>;
    startEncounter(id: string): Promise<any>;
    completeEncounter(id: string): Promise<any>;
    cancelEncounter(id: string, reason: string): Promise<any>;
    getClinicalNotes(encounterId: string): Promise<any[]>;
    createClinicalNote(createNoteDto: CreateClinicalNoteDto): Promise<any>;
    updateClinicalNote(noteId: string, updateNoteDto: UpdateClinicalNoteDto): Promise<any>;
    deleteClinicalNote(noteId: string): Promise<void>;
    signClinicalNote(noteId: string, signedBy: string): Promise<any>;
    getVitals(encounterId: string): Promise<any[]>;
    recordVitals(createVitalsDto: CreateVitalsDto): Promise<any>;
    updateVitals(vitalId: string, updates: any): Promise<any>;
    getOrders(encounterId: string): Promise<any[]>;
    createOrder(createOrderDto: CreateOrderDto): Promise<any>;
    updateOrder(orderId: string, updates: any): Promise<any>;
    cancelOrder(orderId: string, reason: string): Promise<any>;
    getEncounterStats(query: any): Promise<any>;
    private validateEncounterData;
    private validateVitalSigns;
}
//# sourceMappingURL=encounter.service.d.ts.map