export const CreateEncounterDto: z.ZodObject<{
    patientId: z.ZodString;
    facilityId: z.ZodString;
    appointmentId: z.ZodOptional<z.ZodString>;
    primaryStaffId: z.ZodString;
    encounterClass: z.ZodDefault<z.ZodEnum<["AMB", "EMER", "FLD", "HH", "IMP", "ACUTE", "NONAC", "PRENC", "SS", "VR", "OBSENC", "AMB"]>>;
    status: z.ZodDefault<z.ZodEnum<["planned", "arrived", "in_progress", "onleave", "finished", "cancelled", "entered_in_error", "unknown"]>>;
    priority: z.ZodDefault<z.ZodEnum<["immediate", "urgent", "asap", "routine"]>>;
    startTime: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    endTime: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    encounterSource: z.ZodDefault<z.ZodEnum<["appointment", "walk_in", "emergency", "telemedicine"]>>;
    walkInDetails: z.ZodOptional<z.ZodObject<{
        reason: z.ZodString;
        urgency: z.ZodEnum<["low", "medium", "high", "critical"]>;
        referredBy: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        reason: string;
        urgency: "low" | "medium" | "high" | "critical";
        referredBy?: string | undefined;
    }, {
        reason: string;
        urgency: "low" | "medium" | "high" | "critical";
        referredBy?: string | undefined;
    }>>;
    chiefComplaint: z.ZodOptional<z.ZodString>;
    presentingSymptoms: z.ZodOptional<z.ZodString>;
    vitalSigns: z.ZodOptional<z.ZodObject<{
        height: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
        temperature: z.ZodOptional<z.ZodNumber>;
        bloodPressure: z.ZodOptional<z.ZodObject<{
            systolic: z.ZodNumber;
            diastolic: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            systolic: number;
            diastolic: number;
        }, {
            systolic: number;
            diastolic: number;
        }>>;
        heartRate: z.ZodOptional<z.ZodNumber>;
        respiratoryRate: z.ZodOptional<z.ZodNumber>;
        oxygenSaturation: z.ZodOptional<z.ZodNumber>;
        painScore: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        height?: number | undefined;
        weight?: number | undefined;
        temperature?: number | undefined;
        bloodPressure?: {
            systolic: number;
            diastolic: number;
        } | undefined;
        heartRate?: number | undefined;
        respiratoryRate?: number | undefined;
        oxygenSaturation?: number | undefined;
        painScore?: number | undefined;
    }, {
        height?: number | undefined;
        weight?: number | undefined;
        temperature?: number | undefined;
        bloodPressure?: {
            systolic: number;
            diastolic: number;
        } | undefined;
        heartRate?: number | undefined;
        respiratoryRate?: number | undefined;
        oxygenSaturation?: number | undefined;
        painScore?: number | undefined;
    }>>;
    allergies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    currentMedications: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    medicalHistory: z.ZodOptional<z.ZodString>;
    socialHistory: z.ZodOptional<z.ZodString>;
    familyHistory: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "unknown" | "planned" | "arrived" | "in_progress" | "onleave" | "finished" | "cancelled" | "entered_in_error";
    patientId: string;
    facilityId: string;
    startTime: string | Date;
    primaryStaffId: string;
    encounterClass: "AMB" | "EMER" | "FLD" | "HH" | "IMP" | "ACUTE" | "NONAC" | "PRENC" | "SS" | "VR" | "OBSENC";
    priority: "immediate" | "urgent" | "asap" | "routine";
    encounterSource: "appointment" | "walk_in" | "emergency" | "telemedicine";
    notes?: string | undefined;
    allergies?: string[] | undefined;
    currentMedications?: string[] | undefined;
    endTime?: string | Date | undefined;
    appointmentId?: string | undefined;
    walkInDetails?: {
        reason: string;
        urgency: "low" | "medium" | "high" | "critical";
        referredBy?: string | undefined;
    } | undefined;
    chiefComplaint?: string | undefined;
    presentingSymptoms?: string | undefined;
    vitalSigns?: {
        height?: number | undefined;
        weight?: number | undefined;
        temperature?: number | undefined;
        bloodPressure?: {
            systolic: number;
            diastolic: number;
        } | undefined;
        heartRate?: number | undefined;
        respiratoryRate?: number | undefined;
        oxygenSaturation?: number | undefined;
        painScore?: number | undefined;
    } | undefined;
    medicalHistory?: string | undefined;
    socialHistory?: string | undefined;
    familyHistory?: string | undefined;
}, {
    patientId: string;
    facilityId: string;
    startTime: string | Date;
    primaryStaffId: string;
    status?: "unknown" | "planned" | "arrived" | "in_progress" | "onleave" | "finished" | "cancelled" | "entered_in_error" | undefined;
    notes?: string | undefined;
    allergies?: string[] | undefined;
    currentMedications?: string[] | undefined;
    endTime?: string | Date | undefined;
    appointmentId?: string | undefined;
    encounterClass?: "AMB" | "EMER" | "FLD" | "HH" | "IMP" | "ACUTE" | "NONAC" | "PRENC" | "SS" | "VR" | "OBSENC" | undefined;
    priority?: "immediate" | "urgent" | "asap" | "routine" | undefined;
    encounterSource?: "appointment" | "walk_in" | "emergency" | "telemedicine" | undefined;
    walkInDetails?: {
        reason: string;
        urgency: "low" | "medium" | "high" | "critical";
        referredBy?: string | undefined;
    } | undefined;
    chiefComplaint?: string | undefined;
    presentingSymptoms?: string | undefined;
    vitalSigns?: {
        height?: number | undefined;
        weight?: number | undefined;
        temperature?: number | undefined;
        bloodPressure?: {
            systolic: number;
            diastolic: number;
        } | undefined;
        heartRate?: number | undefined;
        respiratoryRate?: number | undefined;
        oxygenSaturation?: number | undefined;
        painScore?: number | undefined;
    } | undefined;
    medicalHistory?: string | undefined;
    socialHistory?: string | undefined;
    familyHistory?: string | undefined;
}>;
export const UpdateEncounterDto: z.ZodObject<{
    primaryStaffId: z.ZodOptional<z.ZodString>;
    encounterClass: z.ZodOptional<z.ZodEnum<["AMB", "EMER", "FLD", "HH", "IMP", "ACUTE", "NONAC", "PRENC", "SS", "VR", "OBSENC", "AMB"]>>;
    status: z.ZodOptional<z.ZodEnum<["planned", "arrived", "in_progress", "onleave", "finished", "cancelled", "entered_in_error", "unknown"]>>;
    priority: z.ZodOptional<z.ZodEnum<["immediate", "urgent", "asap", "routine"]>>;
    startTime: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    endTime: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    chiefComplaint: z.ZodOptional<z.ZodString>;
    presentingSymptoms: z.ZodOptional<z.ZodString>;
    vitalSigns: z.ZodOptional<z.ZodObject<{
        height: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
        temperature: z.ZodOptional<z.ZodNumber>;
        bloodPressure: z.ZodOptional<z.ZodObject<{
            systolic: z.ZodNumber;
            diastolic: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            systolic: number;
            diastolic: number;
        }, {
            systolic: number;
            diastolic: number;
        }>>;
        heartRate: z.ZodOptional<z.ZodNumber>;
        respiratoryRate: z.ZodOptional<z.ZodNumber>;
        oxygenSaturation: z.ZodOptional<z.ZodNumber>;
        painScore: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        height?: number | undefined;
        weight?: number | undefined;
        temperature?: number | undefined;
        bloodPressure?: {
            systolic: number;
            diastolic: number;
        } | undefined;
        heartRate?: number | undefined;
        respiratoryRate?: number | undefined;
        oxygenSaturation?: number | undefined;
        painScore?: number | undefined;
    }, {
        height?: number | undefined;
        weight?: number | undefined;
        temperature?: number | undefined;
        bloodPressure?: {
            systolic: number;
            diastolic: number;
        } | undefined;
        heartRate?: number | undefined;
        respiratoryRate?: number | undefined;
        oxygenSaturation?: number | undefined;
        painScore?: number | undefined;
    }>>;
    allergies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    currentMedications: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    medicalHistory: z.ZodOptional<z.ZodString>;
    socialHistory: z.ZodOptional<z.ZodString>;
    familyHistory: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    dischargeDisposition: z.ZodOptional<z.ZodString>;
    followUpInstructions: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "unknown" | "planned" | "arrived" | "in_progress" | "onleave" | "finished" | "cancelled" | "entered_in_error" | undefined;
    notes?: string | undefined;
    allergies?: string[] | undefined;
    currentMedications?: string[] | undefined;
    startTime?: string | Date | undefined;
    endTime?: string | Date | undefined;
    primaryStaffId?: string | undefined;
    encounterClass?: "AMB" | "EMER" | "FLD" | "HH" | "IMP" | "ACUTE" | "NONAC" | "PRENC" | "SS" | "VR" | "OBSENC" | undefined;
    priority?: "immediate" | "urgent" | "asap" | "routine" | undefined;
    chiefComplaint?: string | undefined;
    presentingSymptoms?: string | undefined;
    vitalSigns?: {
        height?: number | undefined;
        weight?: number | undefined;
        temperature?: number | undefined;
        bloodPressure?: {
            systolic: number;
            diastolic: number;
        } | undefined;
        heartRate?: number | undefined;
        respiratoryRate?: number | undefined;
        oxygenSaturation?: number | undefined;
        painScore?: number | undefined;
    } | undefined;
    medicalHistory?: string | undefined;
    socialHistory?: string | undefined;
    familyHistory?: string | undefined;
    dischargeDisposition?: string | undefined;
    followUpInstructions?: string | undefined;
}, {
    status?: "unknown" | "planned" | "arrived" | "in_progress" | "onleave" | "finished" | "cancelled" | "entered_in_error" | undefined;
    notes?: string | undefined;
    allergies?: string[] | undefined;
    currentMedications?: string[] | undefined;
    startTime?: string | Date | undefined;
    endTime?: string | Date | undefined;
    primaryStaffId?: string | undefined;
    encounterClass?: "AMB" | "EMER" | "FLD" | "HH" | "IMP" | "ACUTE" | "NONAC" | "PRENC" | "SS" | "VR" | "OBSENC" | undefined;
    priority?: "immediate" | "urgent" | "asap" | "routine" | undefined;
    chiefComplaint?: string | undefined;
    presentingSymptoms?: string | undefined;
    vitalSigns?: {
        height?: number | undefined;
        weight?: number | undefined;
        temperature?: number | undefined;
        bloodPressure?: {
            systolic: number;
            diastolic: number;
        } | undefined;
        heartRate?: number | undefined;
        respiratoryRate?: number | undefined;
        oxygenSaturation?: number | undefined;
        painScore?: number | undefined;
    } | undefined;
    medicalHistory?: string | undefined;
    socialHistory?: string | undefined;
    familyHistory?: string | undefined;
    dischargeDisposition?: string | undefined;
    followUpInstructions?: string | undefined;
}>;
export const EncounterQueryDto: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    patientId: z.ZodOptional<z.ZodString>;
    facilityId: z.ZodOptional<z.ZodString>;
    primaryStaffId: z.ZodOptional<z.ZodString>;
    appointmentId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["planned", "arrived", "in_progress", "onleave", "finished", "cancelled", "entered_in_error", "unknown"]>>;
    encounterClass: z.ZodOptional<z.ZodEnum<["AMB", "EMER", "FLD", "HH", "IMP", "ACUTE", "NONAC", "PRENC", "SS", "VR", "OBSENC", "AMB"]>>;
    priority: z.ZodOptional<z.ZodEnum<["immediate", "urgent", "asap", "routine"]>>;
    encounterSource: z.ZodOptional<z.ZodEnum<["appointment", "walk_in", "emergency", "telemedicine"]>>;
    dateRange: z.ZodOptional<z.ZodObject<{
        from: z.ZodUnion<[z.ZodString, z.ZodDate]>;
        to: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    }, "strip", z.ZodTypeAny, {
        from: string | Date;
        to: string | Date;
    }, {
        from: string | Date;
        to: string | Date;
    }>>;
    sortBy: z.ZodDefault<z.ZodEnum<["startTime", "endTime", "createdAt", "patientName", "staffName"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortBy: "createdAt" | "startTime" | "endTime" | "patientName" | "staffName";
    sortOrder: "asc" | "desc";
    status?: "unknown" | "planned" | "arrived" | "in_progress" | "onleave" | "finished" | "cancelled" | "entered_in_error" | undefined;
    dateRange?: {
        from: string | Date;
        to: string | Date;
    } | undefined;
    patientId?: string | undefined;
    facilityId?: string | undefined;
    appointmentId?: string | undefined;
    primaryStaffId?: string | undefined;
    encounterClass?: "AMB" | "EMER" | "FLD" | "HH" | "IMP" | "ACUTE" | "NONAC" | "PRENC" | "SS" | "VR" | "OBSENC" | undefined;
    priority?: "immediate" | "urgent" | "asap" | "routine" | undefined;
    encounterSource?: "appointment" | "walk_in" | "emergency" | "telemedicine" | undefined;
}, {
    status?: "unknown" | "planned" | "arrived" | "in_progress" | "onleave" | "finished" | "cancelled" | "entered_in_error" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: "createdAt" | "startTime" | "endTime" | "patientName" | "staffName" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    dateRange?: {
        from: string | Date;
        to: string | Date;
    } | undefined;
    patientId?: string | undefined;
    facilityId?: string | undefined;
    appointmentId?: string | undefined;
    primaryStaffId?: string | undefined;
    encounterClass?: "AMB" | "EMER" | "FLD" | "HH" | "IMP" | "ACUTE" | "NONAC" | "PRENC" | "SS" | "VR" | "OBSENC" | undefined;
    priority?: "immediate" | "urgent" | "asap" | "routine" | undefined;
    encounterSource?: "appointment" | "walk_in" | "emergency" | "telemedicine" | undefined;
}>;
export const EncounterSearchDto: z.ZodObject<{
    q: z.ZodString;
    fields: z.ZodOptional<z.ZodArray<z.ZodEnum<["chiefComplaint", "presentingSymptoms", "notes", "patientName", "staffName"]>, "many">>;
    dateRange: z.ZodOptional<z.ZodObject<{
        from: z.ZodUnion<[z.ZodString, z.ZodDate]>;
        to: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    }, "strip", z.ZodTypeAny, {
        from: string | Date;
        to: string | Date;
    }, {
        from: string | Date;
        to: string | Date;
    }>>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    q: string;
    dateRange?: {
        from: string | Date;
        to: string | Date;
    } | undefined;
    fields?: ("notes" | "chiefComplaint" | "presentingSymptoms" | "patientName" | "staffName")[] | undefined;
}, {
    q: string;
    limit?: number | undefined;
    dateRange?: {
        from: string | Date;
        to: string | Date;
    } | undefined;
    fields?: ("notes" | "chiefComplaint" | "presentingSymptoms" | "patientName" | "staffName")[] | undefined;
}>;
export const CreateClinicalNoteDto: z.ZodObject<{
    encounterId: z.ZodString;
    noteType: z.ZodEnum<["soap", "progress", "assessment", "plan", "procedure", "discharge"]>;
    title: z.ZodString;
    content: z.ZodString;
    authorStaffId: z.ZodString;
    isTemplate: z.ZodDefault<z.ZodBoolean>;
    templateId: z.ZodOptional<z.ZodString>;
    isSigned: z.ZodDefault<z.ZodBoolean>;
    signedAt: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    signedBy: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    encounterId: string;
    noteType: "soap" | "progress" | "assessment" | "plan" | "procedure" | "discharge";
    authorStaffId: string;
    isTemplate: boolean;
    isSigned: boolean;
    templateId?: string | undefined;
    signedAt?: string | Date | undefined;
    signedBy?: string | undefined;
}, {
    title: string;
    content: string;
    encounterId: string;
    noteType: "soap" | "progress" | "assessment" | "plan" | "procedure" | "discharge";
    authorStaffId: string;
    isTemplate?: boolean | undefined;
    templateId?: string | undefined;
    isSigned?: boolean | undefined;
    signedAt?: string | Date | undefined;
    signedBy?: string | undefined;
}>;
export const UpdateClinicalNoteDto: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    isTemplate: z.ZodOptional<z.ZodBoolean>;
    templateId: z.ZodOptional<z.ZodString>;
    isSigned: z.ZodOptional<z.ZodBoolean>;
    signedAt: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    signedBy: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    content?: string | undefined;
    isTemplate?: boolean | undefined;
    templateId?: string | undefined;
    isSigned?: boolean | undefined;
    signedAt?: string | Date | undefined;
    signedBy?: string | undefined;
}, {
    title?: string | undefined;
    content?: string | undefined;
    isTemplate?: boolean | undefined;
    templateId?: string | undefined;
    isSigned?: boolean | undefined;
    signedAt?: string | Date | undefined;
    signedBy?: string | undefined;
}>;
export const CreateVitalsDto: z.ZodObject<{
    encounterId: z.ZodString;
    recordedBy: z.ZodString;
    recordedAt: z.ZodDefault<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    height: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
    temperature: z.ZodOptional<z.ZodNumber>;
    bloodPressure: z.ZodOptional<z.ZodObject<{
        systolic: z.ZodNumber;
        diastolic: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        systolic: number;
        diastolic: number;
    }, {
        systolic: number;
        diastolic: number;
    }>>;
    heartRate: z.ZodOptional<z.ZodNumber>;
    respiratoryRate: z.ZodOptional<z.ZodNumber>;
    oxygenSaturation: z.ZodOptional<z.ZodNumber>;
    painScore: z.ZodOptional<z.ZodNumber>;
    bmi: z.ZodOptional<z.ZodNumber>;
    headCircumference: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    encounterId: string;
    recordedBy: string;
    recordedAt: string | Date;
    notes?: string | undefined;
    height?: number | undefined;
    weight?: number | undefined;
    temperature?: number | undefined;
    bloodPressure?: {
        systolic: number;
        diastolic: number;
    } | undefined;
    heartRate?: number | undefined;
    respiratoryRate?: number | undefined;
    oxygenSaturation?: number | undefined;
    painScore?: number | undefined;
    bmi?: number | undefined;
    headCircumference?: number | undefined;
}, {
    encounterId: string;
    recordedBy: string;
    notes?: string | undefined;
    height?: number | undefined;
    weight?: number | undefined;
    temperature?: number | undefined;
    bloodPressure?: {
        systolic: number;
        diastolic: number;
    } | undefined;
    heartRate?: number | undefined;
    respiratoryRate?: number | undefined;
    oxygenSaturation?: number | undefined;
    painScore?: number | undefined;
    recordedAt?: string | Date | undefined;
    bmi?: number | undefined;
    headCircumference?: number | undefined;
}>;
export const CreateOrderDto: z.ZodObject<{
    encounterId: z.ZodString;
    orderType: z.ZodEnum<["medication", "lab", "imaging", "procedure", "referral", "diet", "nursing"]>;
    priority: z.ZodDefault<z.ZodEnum<["routine", "urgent", "stat", "asap"]>>;
    status: z.ZodDefault<z.ZodEnum<["draft", "active", "completed", "cancelled", "on_hold"]>>;
    requestedBy: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
    clinicalIndication: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "active" | "cancelled" | "draft" | "completed" | "on_hold";
    priority: "urgent" | "asap" | "routine" | "stat";
    encounterId: string;
    orderType: "procedure" | "medication" | "lab" | "imaging" | "referral" | "diet" | "nursing";
    requestedBy: string;
    notes?: string | undefined;
    clinicalIndication?: string | undefined;
}, {
    encounterId: string;
    orderType: "procedure" | "medication" | "lab" | "imaging" | "referral" | "diet" | "nursing";
    requestedBy: string;
    status?: "active" | "cancelled" | "draft" | "completed" | "on_hold" | undefined;
    notes?: string | undefined;
    priority?: "urgent" | "asap" | "routine" | "stat" | undefined;
    clinicalIndication?: string | undefined;
}>;
export const EncounterResponseDto: z.ZodObject<{
    id: z.ZodString;
    patientId: z.ZodString;
    facilityId: z.ZodString;
    appointmentId: z.ZodOptional<z.ZodString>;
    primaryStaffId: z.ZodString;
    encounterClass: z.ZodEnum<["AMB", "EMER", "FLD", "HH", "IMP", "ACUTE", "NONAC", "PRENC", "SS", "VR", "OBSENC", "AMB"]>;
    status: z.ZodEnum<["planned", "arrived", "in_progress", "onleave", "finished", "cancelled", "entered_in_error", "unknown"]>;
    priority: z.ZodEnum<["immediate", "urgent", "asap", "routine"]>;
    startTime: z.ZodString;
    endTime: z.ZodOptional<z.ZodString>;
    encounterSource: z.ZodEnum<["appointment", "walk_in", "emergency", "telemedicine"]>;
    walkInDetails: z.ZodOptional<z.ZodAny>;
    chiefComplaint: z.ZodOptional<z.ZodString>;
    presentingSymptoms: z.ZodOptional<z.ZodString>;
    vitalSigns: z.ZodOptional<z.ZodAny>;
    allergies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    currentMedications: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    medicalHistory: z.ZodOptional<z.ZodString>;
    socialHistory: z.ZodOptional<z.ZodString>;
    familyHistory: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    dischargeDisposition: z.ZodOptional<z.ZodString>;
    followUpInstructions: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    patient: z.ZodOptional<z.ZodAny>;
    primaryStaff: z.ZodOptional<z.ZodAny>;
    facility: z.ZodOptional<z.ZodAny>;
    appointment: z.ZodOptional<z.ZodAny>;
    clinicalNotes: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    vitals: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    orders: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "unknown" | "planned" | "arrived" | "in_progress" | "onleave" | "finished" | "cancelled" | "entered_in_error";
    createdAt: string;
    updatedAt: string;
    patientId: string;
    facilityId: string;
    startTime: string;
    primaryStaffId: string;
    encounterClass: "AMB" | "EMER" | "FLD" | "HH" | "IMP" | "ACUTE" | "NONAC" | "PRENC" | "SS" | "VR" | "OBSENC";
    priority: "immediate" | "urgent" | "asap" | "routine";
    encounterSource: "appointment" | "walk_in" | "emergency" | "telemedicine";
    facility?: any;
    patient?: any;
    appointment?: any;
    notes?: string | undefined;
    allergies?: string[] | undefined;
    vitals?: any[] | undefined;
    currentMedications?: string[] | undefined;
    endTime?: string | undefined;
    appointmentId?: string | undefined;
    walkInDetails?: any;
    chiefComplaint?: string | undefined;
    presentingSymptoms?: string | undefined;
    vitalSigns?: any;
    medicalHistory?: string | undefined;
    socialHistory?: string | undefined;
    familyHistory?: string | undefined;
    dischargeDisposition?: string | undefined;
    followUpInstructions?: string | undefined;
    primaryStaff?: any;
    clinicalNotes?: any[] | undefined;
    orders?: any[] | undefined;
}, {
    id: string;
    status: "unknown" | "planned" | "arrived" | "in_progress" | "onleave" | "finished" | "cancelled" | "entered_in_error";
    createdAt: string;
    updatedAt: string;
    patientId: string;
    facilityId: string;
    startTime: string;
    primaryStaffId: string;
    encounterClass: "AMB" | "EMER" | "FLD" | "HH" | "IMP" | "ACUTE" | "NONAC" | "PRENC" | "SS" | "VR" | "OBSENC";
    priority: "immediate" | "urgent" | "asap" | "routine";
    encounterSource: "appointment" | "walk_in" | "emergency" | "telemedicine";
    facility?: any;
    patient?: any;
    appointment?: any;
    notes?: string | undefined;
    allergies?: string[] | undefined;
    vitals?: any[] | undefined;
    currentMedications?: string[] | undefined;
    endTime?: string | undefined;
    appointmentId?: string | undefined;
    walkInDetails?: any;
    chiefComplaint?: string | undefined;
    presentingSymptoms?: string | undefined;
    vitalSigns?: any;
    medicalHistory?: string | undefined;
    socialHistory?: string | undefined;
    familyHistory?: string | undefined;
    dischargeDisposition?: string | undefined;
    followUpInstructions?: string | undefined;
    primaryStaff?: any;
    clinicalNotes?: any[] | undefined;
    orders?: any[] | undefined;
}>;
export const ClinicalNoteResponseDto: z.ZodObject<{
    id: z.ZodString;
    encounterId: z.ZodString;
    noteType: z.ZodEnum<["soap", "progress", "assessment", "plan", "procedure", "discharge"]>;
    title: z.ZodString;
    content: z.ZodString;
    authorStaffId: z.ZodString;
    isTemplate: z.ZodBoolean;
    templateId: z.ZodOptional<z.ZodString>;
    isSigned: z.ZodBoolean;
    signedAt: z.ZodOptional<z.ZodString>;
    signedBy: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    author: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    content: string;
    encounterId: string;
    noteType: "soap" | "progress" | "assessment" | "plan" | "procedure" | "discharge";
    authorStaffId: string;
    isTemplate: boolean;
    isSigned: boolean;
    templateId?: string | undefined;
    signedAt?: string | undefined;
    signedBy?: string | undefined;
    author?: any;
}, {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    content: string;
    encounterId: string;
    noteType: "soap" | "progress" | "assessment" | "plan" | "procedure" | "discharge";
    authorStaffId: string;
    isTemplate: boolean;
    isSigned: boolean;
    templateId?: string | undefined;
    signedAt?: string | undefined;
    signedBy?: string | undefined;
    author?: any;
}>;
export const VitalsResponseDto: z.ZodObject<{
    id: z.ZodString;
    encounterId: z.ZodString;
    recordedBy: z.ZodString;
    recordedAt: z.ZodString;
    height: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
    temperature: z.ZodOptional<z.ZodNumber>;
    bloodPressure: z.ZodOptional<z.ZodAny>;
    heartRate: z.ZodOptional<z.ZodNumber>;
    respiratoryRate: z.ZodOptional<z.ZodNumber>;
    oxygenSaturation: z.ZodOptional<z.ZodNumber>;
    painScore: z.ZodOptional<z.ZodNumber>;
    bmi: z.ZodOptional<z.ZodNumber>;
    headCircumference: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    recordedByStaff: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    id: string;
    encounterId: string;
    recordedBy: string;
    recordedAt: string;
    notes?: string | undefined;
    height?: number | undefined;
    weight?: number | undefined;
    temperature?: number | undefined;
    bloodPressure?: any;
    heartRate?: number | undefined;
    respiratoryRate?: number | undefined;
    oxygenSaturation?: number | undefined;
    painScore?: number | undefined;
    bmi?: number | undefined;
    headCircumference?: number | undefined;
    recordedByStaff?: any;
}, {
    id: string;
    encounterId: string;
    recordedBy: string;
    recordedAt: string;
    notes?: string | undefined;
    height?: number | undefined;
    weight?: number | undefined;
    temperature?: number | undefined;
    bloodPressure?: any;
    heartRate?: number | undefined;
    respiratoryRate?: number | undefined;
    oxygenSaturation?: number | undefined;
    painScore?: number | undefined;
    bmi?: number | undefined;
    headCircumference?: number | undefined;
    recordedByStaff?: any;
}>;
export const EncounterStatsDto: z.ZodObject<{
    total: z.ZodNumber;
    byStatus: z.ZodRecord<z.ZodString, z.ZodNumber>;
    byClass: z.ZodRecord<z.ZodString, z.ZodNumber>;
    bySource: z.ZodRecord<z.ZodString, z.ZodNumber>;
    byStaff: z.ZodRecord<z.ZodString, z.ZodNumber>;
    byFacility: z.ZodRecord<z.ZodString, z.ZodNumber>;
    averageDuration: z.ZodNumber;
    averageWaitTime: z.ZodNumber;
    walkInRate: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    total: number;
    byStatus: Record<string, number>;
    byClass: Record<string, number>;
    bySource: Record<string, number>;
    byStaff: Record<string, number>;
    byFacility: Record<string, number>;
    averageDuration: number;
    averageWaitTime: number;
    walkInRate: number;
}, {
    total: number;
    byStatus: Record<string, number>;
    byClass: Record<string, number>;
    bySource: Record<string, number>;
    byStaff: Record<string, number>;
    byFacility: Record<string, number>;
    averageDuration: number;
    averageWaitTime: number;
    walkInRate: number;
}>;
import { z } from 'zod';
//# sourceMappingURL=encounter.dto.d.ts.map