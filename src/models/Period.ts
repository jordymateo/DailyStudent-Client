export type PeriodSubject = {
    id: number;
    name: string;
    color: string;
    teacherFullName: string;
    isDeleted: boolean;
}

export type Period = {
    id: number;
    name: string;
    number: number;
    initialDate: number;
    endDate: string;
    userCareerId: number;
    subjects: PeriodSubject[];
}