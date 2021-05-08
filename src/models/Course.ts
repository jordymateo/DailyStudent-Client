export type Course = {
  id?: number;
  institutionId: number;
  color: string;
  name: string;
  courseTypeId: 'course';
  teacherFullName: string;
  academicPeriodId?: number;
  isDeleted?: boolean;
}