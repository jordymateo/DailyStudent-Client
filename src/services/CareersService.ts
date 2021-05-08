import { Career, Course, Period, UserCareer } from "../models";
import AxiosClient from "./AxiosClient";

const CareersService = (() => {

  return ({
    getAll() {
      return new Promise<Career[]>((resolve, reject) => {
        AxiosClient
          .get('/api/careers')
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    }, 
    getByInstitution(institutionId: number) {
      return new Promise<Career[]>((resolve, reject) => {
        AxiosClient
          .get(`/api/careers/getByInstitution/${institutionId}`)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    }, 
    getUserPeriods(userCareerId: number) {
      return new Promise<Period[]>((resolve, reject) => {
        AxiosClient
          .get(`/api/careers/userPeriods/${userCareerId}`)
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
          .post('/api/careers', model)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    }, 
    create(model: UserCareer) {
      return new Promise<UserCareer>((resolve, reject) => {
        AxiosClient
          .post('/api/careers/user', model)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    createPeriod(model: any) {
      return new Promise((resolve, reject) => {
        AxiosClient
          .post('/api/careers/period', model)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    createPeriodSubject(model: any) {
      return new Promise((resolve, reject) => {
        AxiosClient
          .post('/api/careers/periodSubject', model)
          .then((res: any) => {
            resolve(res);
          }).catch(err => {
            console.error(err);
            reject(err.response);
          });
      });
    },
    updatePeriod(model: any) {
      return new Promise((resolve, reject) => {
        AxiosClient
          .put('/api/careers/period', model)
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

export default CareersService;