import { UserCareer } from "../../models";

export interface ICreatePopupProps {
    userCareer?: UserCareer;
    visible: boolean;
    onHidden: () => void;
    onDataChanged?: () => void;
}


export type SubjectForm = {
    number: number;
    name: string;
    initialDate: Date;
    endDate: Date;
    subjects: any[];
}