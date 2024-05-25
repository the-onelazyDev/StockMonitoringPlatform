import axios from 'axios';

interface User {
  token: string;
}

const API_BASE_URL = 'http://localhost:9090/api';

export const registerUser = async (
  email: string,
  fullName: string,
  password: string
): Promise<User | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      email,
      fullName,
      password,
    });
    const { user } = response.data;
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};