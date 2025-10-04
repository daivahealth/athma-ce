export let EncounterService: {
    new (encounterRepository: any): {
        encounterRepository: any;
        createEncounter(createEncounterDto: any): Promise<any>;
        getEncounters(query: any): Promise<any>;
        searchEncounters(searchDto: any): Promise<any>;
        getEncounterById(id: any): Promise<any>;
        updateEncounter(id: any, updateEncounterDto: any): Promise<any>;
        deleteEncounter(id: any): Promise<void>;
        startEncounter(id: any): Promise<any>;
        completeEncounter(id: any): Promise<any>;
        cancelEncounter(id: any, reason: any): Promise<any>;
        getClinicalNotes(encounterId: any): Promise<any>;
        createClinicalNote(createNoteDto: any): Promise<any>;
        updateClinicalNote(noteId: any, updateNoteDto: any): Promise<any>;
        deleteClinicalNote(noteId: any): Promise<void>;
        signClinicalNote(noteId: any, signedBy: any): Promise<any>;
        getVitals(encounterId: any): Promise<any>;
        recordVitals(createVitalsDto: any): Promise<any>;
        updateVitals(vitalId: any, updates: any): Promise<any>;
        getOrders(encounterId: any): Promise<any>;
        createOrder(createOrderDto: any): Promise<any>;
        updateOrder(orderId: any, updates: any): Promise<any>;
        cancelOrder(orderId: any, reason: any): Promise<any>;
        getEncounterStats(query: any): Promise<any>;
        validateEncounterData(data: any): void;
        validateVitalSigns(vitals: any): void;
    };
};
//# sourceMappingURL=encounter.service.d.ts.map