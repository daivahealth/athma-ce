export let EncounterController: {
    new (encounterService: any): {
        encounterService: any;
        createEncounter(createEncounterDto: any): Promise<any>;
        getEncounters(query: any): Promise<any>;
        searchEncounters(searchDto: any): Promise<any>;
        getEncounterStats(query: any): Promise<any>;
        getEncounter(id: any): Promise<any>;
        updateEncounter(id: any, updateEncounterDto: any): Promise<any>;
        deleteEncounter(id: any): Promise<{
            message: string;
        }>;
        startEncounter(id: any): Promise<any>;
        completeEncounter(id: any): Promise<any>;
        cancelEncounter(id: any, body: any): Promise<any>;
        getClinicalNotes(id: any): Promise<any>;
        createClinicalNote(id: any, createNoteDto: any): Promise<any>;
        updateClinicalNote(noteId: any, updateNoteDto: any): Promise<any>;
        deleteClinicalNote(noteId: any): Promise<{
            message: string;
        }>;
        signClinicalNote(noteId: any, body: any): Promise<any>;
        getVitals(id: any): Promise<any>;
        recordVitals(id: any, createVitalsDto: any): Promise<any>;
        updateVitals(vitalId: any, updates: any): Promise<any>;
        getOrders(id: any): Promise<any>;
        createOrder(id: any, createOrderDto: any): Promise<any>;
        updateOrder(orderId: any, updates: any): Promise<any>;
        cancelOrder(orderId: any, body: any): Promise<any>;
    };
};
//# sourceMappingURL=encounter.controller.d.ts.map