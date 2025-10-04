export let EncounterRepository: {
    new (prisma: any): {
        prisma: any;
        create(data: any): Promise<any>;
        findById(id: any): Promise<any>;
        findByIdWithDetails(id: any): Promise<any>;
        findPatient(patientId: any): Promise<any>;
        findStaff(staffId: any): Promise<any>;
        findAppointment(appointmentId: any): Promise<any>;
        findByAppointmentId(appointmentId: any): Promise<any>;
        findMany(query: any): Promise<{
            data: any;
            pagination: {
                page: any;
                limit: any;
                total: any;
                totalPages: number;
                hasNext: boolean;
                hasPrev: boolean;
            };
        }>;
        search(searchDto: any): Promise<any>;
        update(id: any, data: any): Promise<any>;
        delete(id: any): Promise<any>;
        updateAppointmentStatus(appointmentId: any, status: any): Promise<any>;
        getClinicalNotes(encounterId: any): Promise<any>;
        createClinicalNote(data: any): Promise<any>;
        findClinicalNote(noteId: any): Promise<any>;
        updateClinicalNote(noteId: any, data: any): Promise<any>;
        deleteClinicalNote(noteId: any): Promise<any>;
        getVitals(encounterId: any): Promise<any>;
        createVitals(data: any): Promise<any>;
        findVital(vitalId: any): Promise<any>;
        updateVitals(vitalId: any, updates: any): Promise<any>;
        getOrders(encounterId: any): Promise<any>;
        createOrder(data: any): Promise<any>;
        findOrder(orderId: any): Promise<any>;
        updateOrder(orderId: any, updates: any): Promise<any>;
        getEncounterStats(query: any): Promise<{
            total: any;
            byStatus: any;
            byClass: any;
            bySource: any;
            byStaff: any;
            byFacility: any;
            averageDuration: number;
            averageWaitTime: number;
            walkInRate: number;
        }>;
        groupByToRecord(groupByResult: any): any;
    };
};
//# sourceMappingURL=encounter.repository.d.ts.map