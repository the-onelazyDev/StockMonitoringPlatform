import axios from 'axios';

interface User {
  token: string;
}

interface LoginData {
  email: string;
  password: string;
}

const API_BASE_URL = 'http://localhost:9090/api';

export const login = async (loginData: LoginData): Promise<User | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth`, loginData);
    const { user } = response.data;
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};