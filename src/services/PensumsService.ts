import { AcademicPlan, Course, Pensum, Subject } from "../models";
import AxiosClient from "./AxiosClient";

const PensumsService = (() => {

  return ({
    get(id: number | string) {
      return new Promise<Pensum>((resolve, reject) => {
        AxiosClient
          .get('/api/pensums/' + id)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    }, 
    request(model: FormData) {
      return new Promise<void>((resolve, reject) => {
        AxiosClient
          .post('/api/pensums', model)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    }, 
    getByCareer(careerId: number) {
      return new Promise<Pensum[]>((resolve, reject) => {
        AxiosClient
          .get(`/api/pensums/getByCareer/${careerId}`)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    }, 

    //Subjects
    getSubjects(pensumId: number) {
      return new Promise<Subject[]>((resolve, reject) => {
        AxiosClient
          .get(`/api/pensums/subjects/${pensumId}`)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    getUserSubjects(userCareerId: number) {
      return new Promise<Course[]>((resolve, reject) => {
        AxiosClient
          .get(`/api/pensums/userSubjects/${userCareerId}`)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    generateAcademicPlan(pensumId: number, completedSubjects: string[] | null) {
      return new Promise<AcademicPlan[]>((resolve, reject) => {
        AxiosClient
          .post(`/api/pensums/generateAcademicPlan/${pensumId}`, completedSubjects)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    }
  });
})();

export default PensumsService;