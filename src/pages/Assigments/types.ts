import { Assignment } from "../../models";

export interface IAssignmentItemProps {
    subject: {
        id: number;
        name: string;
        assignments: Assignment[];
    };
    setAssigmentPopUpVisible: (data: boolean) => void;
    setSelectedAssignment: (data: any) => void;
}