export type AcademicPlan = {
    code: number;
    name: string;
    subjects: {
        code: number;
        name: string;
        credits: string;
        prerequisites2: string[];
        corequisites2: string[];
    }[];
    credits: number;
  }
  