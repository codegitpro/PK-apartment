import axios from "axios";
import moment from "moment-timezone";
import { omitBy, isNil } from 'lodash';

import {
  REFRESH_TOKEN_URL,
  LOGIN_URL,
  REGISTER_URL,
  APARTMENTS_URL,
  USERS_URL,
} from "../constants/urls";

const authHeaderConfig = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const { accessToken } = auth.token;
  const requestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  return requestConfig;
};

const refreshToken = async () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const { expiresIn, refreshToken } = auth.token;
  const { email } = auth.user;
  if (moment().add(20, "minutes") > moment(expiresIn)) {
    try {
      const response = await axios.post(REFRESH_TOKEN_URL, {
        email,
        refreshToken,
      });
      auth.token = response.data;
      localStorage.setItem("auth", JSON.stringify(auth));
    } catch (e) {
      console.log(e);
    }
  }
};

export const logout = () => {
  localStorage.removeItem("auth");
};

export const login = async (data) => {
  try {
    const response = await axios.post(LOGIN_URL, data);
    localStorage.setItem("auth", JSON.stringify(response.data));
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const register = async (data) => {
  try {
    const response = await axios.post(REGISTER_URL, data);
    localStorage.setItem("auth", JSON.stringify(response.data));
    return response.data;
  } catch (e) {
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

/**
 * Api services to manage Users
 */
export const fetchUsers = async () => {
  try {
    const response = await axios.get(USERS_URL, authHeaderConfig());
    refreshToken();
    return response.data;
  } catch (e) {
    if (e.response.status === 401) {
      logout();
    }
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const fetchUser = async (userId) => {
  try {
    const response = await axios.get(
      `${USERS_URL}/${userId}`,
      authHeaderConfig()
    );
    refreshToken();
    return response.data;
  } catch (e) {
    if (e.response.status === 401) {
      logout();
    }
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const createUser = async (data) => {
  try {
    const response = await axios.post(USERS_URL, data, authHeaderConfig());
    refreshToken();
    return response.data;
  } catch (e) {
    if (e.response.status === 401) {
      logout();
    }
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const updateUser = async (userId, data) => {
  try {
    const response = await axios.patch(
      `${USERS_URL}/${userId}`,
      data,
      authHeaderConfig()
    );
    refreshToken();
    return response.data;
  } catch (e) {
    if (e.response.status === 401) {
      logout();
    }
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(
      `${USERS_URL}/${userId}`,
      authHeaderConfig()
    );
    refreshToken();
    return response.data;
  } catch (e) {
    if (e.response.status === 401) {
      logout();
    }
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

/**
 * Api services to manage Apartments
 */
export const fetchApartments = async (params = {}) => {
  try {
    params = omitBy(params, isNil);
    const query = Object.keys(params)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&');
    
    const response = await axios.get(`${APARTMENTS_URL}?${query}`, authHeaderConfig());
    refreshToken();
    return response.data;
  } catch (e) {
    if (e.response.status === 401) {
      logout();
    }
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const fetchApartment = async (apartmentId) => {
  try {
    const response = await axios.get(
      `${APARTMENTS_URL}/${apartmentId}`,
      authHeaderConfig()
    );
    refreshToken();
    return response.data;
  } catch (e) {
    if (e.response.status === 401) {
      logout();
    }
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const createApartment = async (data) => {
  try {
    const response = await axios.post(APARTMENTS_URL, data, authHeaderConfig());
    refreshToken();
    return response.data;
  } catch (e) {
    if (e.response.status === 401) {
      logout();
    }
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const updateApartment = async (apartmentId, data) => {
  try {
    const response = await axios.patch(
      `${APARTMENTS_URL}/${apartmentId}`,
      data,
      authHeaderConfig()
    );
    refreshToken();
    return response.data;
  } catch (e) {
    if (e.response.status === 401) {
      logout();
    }
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};

export const deleteApartment = async (apartmentId) => {
  try {
    const response = await axios.delete(
      `${APARTMENTS_URL}/${apartmentId}`,
      authHeaderConfig()
    );
    refreshToken();
    return response.data;
  } catch (e) {
    if (e.response.status === 401) {
      logout();
    }
    const message = e.response ? e.response.data.message : e.message;
    throw new Error(message);
  }
};
