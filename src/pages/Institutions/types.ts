import { UserCareer } from "../../models";

export type InstitutionForm = {
  institutionId: number;
  type: 'career' | 'course';
  course: string;
  color: string;
  teacher: string;
  careerId: number;
  pensumId: number;
}

export interface ICreatePopupProps {
  visible: boolean;
  onHidden: () => void;
  afterSubmit: (data: UserCareer) => void;
}