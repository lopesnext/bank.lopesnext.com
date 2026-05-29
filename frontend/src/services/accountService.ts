import api from './api';
import { Account, User } from './authService';

export interface Transaction {
  id: number;
  type: 'incoming' | 'outgoing';
  amount: number;
  description: string;
  date: string;
  counterparty: {
    name: string;
    iban: string;
    account_number: string;
  };
}

export interface AccountDetails {
  user: User;
  account: Account;
}

export interface TransactionsResponse {
  account_id: number;
  transactions: Transaction[];
}

export interface BalanceResponse {
  balance: number;
  account_number: string;
  iban: string;
}

class AccountService {
  async getAccountDetails(): Promise<AccountDetails> {
    const response = await api.get<AccountDetails>('/account');
    
    // Update local storage with latest data
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('account', JSON.stringify(response.data.account));
    
    return response.data;
  }

  async getTransactions(limit: number = 10): Promise<Transaction[]> {
    const response = await api.get<TransactionsResponse>('/account/transactions', {
      params: { limit }
    });
    return response.data.transactions;
  }

  async getBalance(): Promise<BalanceResponse> {
    const response = await api.get<BalanceResponse>('/account/balance');
    
    // Update account balance in local storage
    const accountStr = localStorage.getItem('account');
    if (accountStr) {
      const account = JSON.parse(accountStr);
      account.balance = response.data.balance;
      localStorage.setItem('account', JSON.stringify(account));
    }
    
    return response.data;
  }
}

export const accountService = new AccountService();
export default accountService;

