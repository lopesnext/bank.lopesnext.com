import api from './api';

export interface ValidateRecipientRequest {
  iban: string;
}

export interface ValidateRecipientResponse {
  valid: boolean;
  recipient: {
    name: string;
    iban: string;
    account_number: string;
  };
}

export interface CreateTransferRequest {
  iban: string;
  amount: number;
  description?: string;
}

export interface CreateTransferResponse {
  message: string;
  transaction: {
    id: number;
    amount: number;
    description: string;
    recipient: {
      name: string;
      iban: string;
    };
    date: string;
  };
  new_balance: number;
}

export interface TransferHistoryItem {
  id: number;
  type: 'sent' | 'received';
  amount: number;
  description: string;
  date: string;
  counterparty: {
    name: string;
    iban: string;
  };
}

export interface TransferHistoryResponse {
  transfers: TransferHistoryItem[];
  total: number;
}

class TransferService {
  async validateRecipient(iban: string): Promise<ValidateRecipientResponse> {
    const response = await api.post<ValidateRecipientResponse>('/transfers/validate', { iban });
    return response.data;
  }

  async createTransfer(data: CreateTransferRequest): Promise<CreateTransferResponse> {
    const response = await api.post<CreateTransferResponse>('/transfers', data);
    
    // Update account balance in local storage
    const accountStr = localStorage.getItem('account');
    if (accountStr) {
      const account = JSON.parse(accountStr);
      account.balance = response.data.new_balance;
      localStorage.setItem('account', JSON.stringify(account));
    }
    
    return response.data;
  }

  async getTransferHistory(limit: number = 20): Promise<TransferHistoryItem[]> {
    const response = await api.get<TransferHistoryResponse>('/transfers/history', {
      params: { limit }
    });
    return response.data.transfers;
  }
}

export const transferService = new TransferService();
export default transferService;

