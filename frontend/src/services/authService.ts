import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  nif: string;
  cc: string;
  birth_date: string;
  address: string;
  postal_code: string;
  phone: string;
  nationality: string;
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  nif: string;
  cc: string;
  birth_date: string;
  address: string;
  postal_code: string;
  phone: string;
  nationality: string;
  created_at: string;
}

export interface Account {
  id: number;
  account_number: string;
  iban: string;
  balance: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
  account: Account;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Store token and user data
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('account', JSON.stringify(response.data.account));
    
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    
    // Store token and user data
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('account', JSON.stringify(response.data.account));
    
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('account');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getCurrentAccount(): Account | null {
    const accountStr = localStorage.getItem('account');
    return accountStr ? JSON.parse(accountStr) : null;
  }
}

export const authService = new AuthService();
export default authService;

