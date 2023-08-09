import axios from 'axios';
import { API_URL } from '../config/constants';
import { Alert } from 'react-native';

export const userLogin = async (user) => {
  return {
    _id: "64bcd25156b42faba9f88f77",
    name: "Rajiv Ranjan",
    email: "rajiv.ranjan@pmc.com",
    phone: "7599509238",
    isPasswordSet: false,
    role: "quality-users" // project-head, quality-head", "quality-users"
};
   return axios.post(`${API_URL}v1/login`, {
    email: user.username,
    password: user.password
  }).then((response) => {
    try {
      if(response.data.code === 200) {
        return getUserInfo(response.data.data.authToken).then((responseInfo) => {
          return responseInfo.data.data;
        }).catch((error) => {
          throw new Error('Email/Mobile or Password is incorrect.');
        });
      } else {
        throw new Error(response.data.message);
      }
    }
    catch (e) {
        throw new Error('Username/Mobile or Password is incorrect.');
    }
  }).catch((err) => {
    const errorMessge = err.response?.data?.message || 'Username/Mobile or Password is incorrect.';
    throw new Error(errorMessge);
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