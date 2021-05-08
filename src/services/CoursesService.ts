import { Assignment, Calendar, CareerSubjects, Course, Note } from "../models";
import AxiosClient from "./AxiosClient";

const CoursesService = (() => {

  return ({
    get(id: number) {
      return new Promise<Course>((resolve, reject) => {
        AxiosClient
          .get(`/api/courses/${id}`)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    insert(model: Course) {
      return new Promise<Course>((resolve, reject) => {
        AxiosClient
          .post('/api/courses', model)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    update(model: Course) {
      return new Promise<Course>((resolve, reject) => {
        AxiosClient
          .put('/api/courses', model)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    getAssignmentsByCourse(idCourse: number) {
      return new Promise<Assignment[]>((resolve, reject) => {
        AxiosClient
          .get(`/api/assignments/${idCourse}/bycourse`)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    getAssignmentsByCareer(userCareerId: number) {
      return new Promise<CareerSubjects>((resolve, reject) => {
        AxiosClient
          .get(`/api/assignments/${userCareerId}/byCareer`)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    getAssignmentsToCalendar() {
      return new Promise<Calendar>((resolve, reject) => {
        AxiosClient
          .get(`/api/assignments/calendar`)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    insertAssignment(model: FormData) {
      return new Promise<Assignment>((resolve, reject) => {
        AxiosClient
          .post('/api/assignments', model)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    updateAssignment(model: FormData) {
      return new Promise<Assignment>((resolve, reject) => {
        AxiosClient
          .put('/api/assignments', model)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    completeAssignment(assignmentId: number) {
      return new Promise<boolean>((resolve, reject) => {
        AxiosClient
          .put(`/api/assignments/${assignmentId}/complete`, null)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    deleteAssignment(assignmentId: number) {
      return new Promise<boolean>((resolve, reject) => {
        AxiosClient
          .delete(`/api/assignments/${assignmentId}`, null)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    getNotesByCourse(idCourse: number) {
      return new Promise<Note[]>((resolve, reject) => {
        AxiosClient
          .get(`/api/notes/${idCourse}/bycourse`)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    insertNote(model: Note) {
      return new Promise<Note>((resolve, reject) => {
        AxiosClient
          .post('/api/notes', model)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    updateNote(model: Note) {
      return new Promise<Note>((resolve, reject) => {
        AxiosClient
          .put('/api/notes', model)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    deleteNote(noteId: number) {
      return new Promise<boolean>((resolve, reject) => {
        AxiosClient
          .delete(`/api/notes/${noteId}`, null)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
  });
})();

export default CoursesService;