export type CareerForm = {
    id: number;
    name: string;
    institutionId: number;
    pensum: File[];
}

export type PensumForm = {
    id: number;
    name: string;
    careerId: any;
    creditLimitPerPeriod: number;
    pensum: File[];
}