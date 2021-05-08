import { Period, Course, PeriodSubject } from "../../../../models";

export interface IEditProps {
    data: Period;
    visible: boolean;
    onHidden: () => void;
    onDataChanged: () => void;
}

export interface ISubjectProps {
    periodId: number;
    data?: Course;
    visible: boolean;
    onHidden: () => void;
    onDataChanged: () => void;
}

export interface IAccordionTitleProps {
    data: Period;
    onEditClick: (data: Period) => void;
    onAddSubjectClick: (data: Period) => void;
}

export interface IAccordionItemProps {
    data: Period;
    onEditSubjectClick: (data: Period, item: PeriodSubject) => void;
    onTonggleSubjectClick: (item: PeriodSubject) => void;
}