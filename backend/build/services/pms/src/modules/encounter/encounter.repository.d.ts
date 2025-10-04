import { PrismaService } from '@zeal/shared-database';
import { CreateEncounterDto, UpdateEncounterDto, EncounterQueryDto, EncounterSearchDto, CreateClinicalNoteDto, UpdateClinicalNoteDto, CreateVitalsDto, CreateOrderDto } from './dto/encounter.dto';
export declare class EncounterRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateEncounterDto): Promise<any>;
    findById(id: string): Promise<any>;
    findByIdWithDetails(id: string): Promise<any>;
    findPatient(patientId: string): Promise<any>;
    findStaff(staffId: string): Promise<any>;
    findAppointment(appointmentId: string): Promise<any>;
    findByAppointmentId(appointmentId: string): Promise<any>;
    findMany(query: EncounterQueryDto): Promise<any>;
    search(searchDto: EncounterSearchDto): Promise<any[]>;
    update(id: string, data: UpdateEncounterDto): Promise<any>;
    delete(id: string): Promise<any>;
    updateAppointmentStatus(appointmentId: string, status: string): Promise<any>;
    getClinicalNotes(encounterId: string): Promise<any[]>;
    createClinicalNote(data: CreateClinicalNoteDto): Promise<any>;
    findClinicalNote(noteId: string): Promise<any>;
    updateClinicalNote(noteId: string, data: UpdateClinicalNoteDto): Promise<any>;
    deleteClinicalNote(noteId: string): Promise<any>;
    getVitals(encounterId: string): Promise<any[]>;
    createVitals(data: CreateVitalsDto): Promise<any>;
    findVital(vitalId: string): Promise<any>;
    updateVitals(vitalId: string, updates: any): Promise<any>;
    getOrders(encounterId: string): Promise<any[]>;
    createOrder(data: CreateOrderDto): Promise<any>;
    findOrder(orderId: string): Promise<any>;
    updateOrder(orderId: string, updates: any): Promise<any>;
    getEncounterStats(query: any): Promise<any>;
    private groupByToRecord;
}
//# sourceMappingURL=encounter.repository.d.ts.map