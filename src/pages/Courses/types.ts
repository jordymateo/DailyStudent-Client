import { Assignment, Course, Note } from "../../models";

export interface ICreateAssigmentProps {
  data?: Assignment;
  courseId: number;
  visible: boolean;
  onHidden: () => void;
  onDataChanged: () => void;
}

export interface ICreateNoteProps {
  data?: Note;
  courseId: number;
  visible: boolean;
  onHidden: () => void;
  onDataChanged: () => void;
}

export interface IAssignmentCardProps {
  data: Assignment;
  onOpenClick: () => void;
  onDataChanged: () => void;
}

export interface INoteCardProps {
  data: Note;
  onOpenClick: () => void;
  onDataChanged: () => void;
}

export interface IAssignmentsSectionProps {
  assignments: Assignment[] | undefined;
  tabIndex: number;
  assigmentPopUpVisible: boolean;
  onDataChanged: () => void;
  setSelectedAssignment: (assignment: Assignment | undefined) => void;
  setAssigmentPopUpVisible: (assigmentPopUpVisible: boolean) => void;
}

export interface INotesSectionProps {
  notes: Note[] | undefined;
  tabIndex: number;
  notePopUpVisible: boolean;
  onDataChanged: () => void;
  setSelectedNote: (assignment: Note | undefined) => void;
  setNotePopUpVisible: (assigmentPopUpVisible: boolean) => void;
}

export interface ICourseDetailProps {
  data?: Course;
  visible: boolean;
  onHidden: () => void;
  onDataChanged: () => void;
}