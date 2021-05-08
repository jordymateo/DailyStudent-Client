import { Assignment } from ".";

export type CareerSubjects = {
  careerName: string;
  subjects: {
    id: number;
    color: string;
    name: string;
    teacherFullName: string;
    assignments: Assignment[];
  }[];
}
