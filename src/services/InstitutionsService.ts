import { CareerOrCourse, Institution } from "../models";
import AxiosClient from "./AxiosClient";

const InstitutionsService = (() => {

  return ({
    request(model: FormData) {
      return new Promise<void>((resolve, reject) => {
        AxiosClient
          .post('/api/institutions', model)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    }, 
    get() {
      return new Promise<Institution[]>((resolve, reject) => {
        AxiosClient
          .get('/api/institutions/available')
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err);
          });
      });
    },
    getAll() {
      return new Promise<Institution[]>((resolve, reject) => {
        AxiosClient
          .get('/api/institutions')
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    }, 
    getUserInstitutions() {
      return new Promise<any>((resolve, reject) => {
        AxiosClient
          .get('/api/institutions/userInstitutions')
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err);
          });
      });
    },
    getUserInstitutionsInLine() {
      return new Promise<CareerOrCourse[]>((resolve, reject) => {
        AxiosClient
          .get('/api/institutions/userInstitutionsInLine')
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err);
          });
      });
    },
    getUserCareers() {
      return new Promise<any>((resolve, reject) => {
        AxiosClient
          .get('/api/institutions/userCareers')
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err);
          });
      });
    },
    toggleUserCareerState(userCareerId: number) {
      return new Promise<any>((resolve, reject) => {
        AxiosClient
          .put('/api/institutions/toggleUserCareerState/' + userCareerId, null)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err);
          });
      });
    },
    toggleUserCourseState(userCourseId: number) {
      return new Promise<any>((resolve, reject) => {
        AxiosClient
          .put('/api/institutions/toggleUserCourseState/' + userCourseId, null)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err);
          });
      });
    }
  });
})();

export default InstitutionsService;