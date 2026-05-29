import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AccountModel } from '../models/Account';
import { TransactionModel } from '../models/Transaction';
import { UserModel } from '../models/User';

/**
 * Get account details and balance
 */
export const getAccountDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get user details
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get account details
    const account = await AccountModel.findByUserId(userId);
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    res.json({
      user: UserModel.sanitizeUser(user),
      account: {
        id: account.id,
        account_number: account.account_number,
        iban: account.iban,
        balance: account.balance,
        created_at: account.created_at
      }
    });
  } catch (error) {
    console.error('Get account details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get account transactions
 */
export const getTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get user's account
    const account = await AccountModel.findByUserId(userId);
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    // Get transactions
    const transactions = await TransactionModel.getByAccountId(account.id, limit);

    // Format transactions for the user
    const formattedTransactions = transactions.map(tx => {
      const isOutgoing = tx.from_account_id === account.id;
      
      return {
        id: tx.id,
        type: isOutgoing ? 'outgoing' : 'incoming',
        amount: tx.amount,
        description: tx.description,
        date: tx.transaction_date,
        counterparty: {
          name: isOutgoing ? tx.to_user_name : tx.from_user_name,
          iban: isOutgoing ? tx.to_iban : tx.from_iban,
          account_number: isOutgoing ? tx.to_account_number : tx.from_account_number
        }
      };
    });

    res.json({
      account_id: account.id,
      transactions: formattedTransactions
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get account balance
 */
export const getBalance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get user's account
    const account = await AccountModel.findByUserId(userId);
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    res.json({
      balance: account.balance,
      account_number: account.account_number,
      iban: account.iban
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

