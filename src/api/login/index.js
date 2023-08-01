import axios from 'axios';
import { API_URL } from '../config/constants';

export const userLogin = async (user) => {
   return axios.post(`${API_URL}v1/login`, {
    email: user.username,
    password: user.password
  }).then((response) => {
    try {
      return getUserInfo(response.data.data.authToken).then((responseInfo) => {
        return responseInfo.data.data.name;
      }).catch((error) => {
        throw new Error('Something went wrong!!');
      });
    }
    catch (e) {
        throw new Error('Something went wrong!!');
    }
  }).catch((err) => {
    throw new Error('Something went wrong!!');
  });
}

export const getUserInfo = async (authToken) => {
    const headers = { 'Authorization': authToken };
    return axios.get(`${API_URL}v1/auth/users-info`, { headers })
    .then(response => {
        return response;
    })
    .catch(err => {
        throw new Error(err);
    });

 }