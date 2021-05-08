import { Course } from "../../models";

export interface IItemSideMenu {
    text:string;
    icon:string;
    route:string;
} 

export interface IAssignmentsProps {
    data: Course[];
} 

export interface IAssignmentItemProps {
    data: Course;
} 

