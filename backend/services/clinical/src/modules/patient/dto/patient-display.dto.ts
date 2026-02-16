export class PatientDisplayDto {
    id!: string;
    mrn!: string;
    firstName!: string;
    lastName!: string;
    fullName!: string;
    dateOfBirth!: Date;
    age!: number;
    gender!: string;
    phoneNumber!: string;
    email?: string | null;
    status!: string;
}
