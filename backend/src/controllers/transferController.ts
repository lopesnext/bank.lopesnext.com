import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AccountModel } from '../models/Account';
import { TransactionModel } from '../models/Transaction';
import { validateIBAN } from '../utils/validators';

/**
 * Validate IBAN and get recipient details
 */
export const validateRecipient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { iban } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!iban) {
      res.status(400).json({ error: 'IBAN is required' });
      return;
    }

    // Validate IBAN format
    if (!validateIBAN(iban)) {
      res.status(400).json({ error: 'Invalid IBAN format' });
      return;
    }

    // Get sender's account
    const senderAccount = await AccountModel.findByUserId(userId);
    if (!senderAccount) {
      res.status(404).json({ error: 'Sender account not found' });
      return;
    }

    // Check if trying to transfer to own account
    if (senderAccount.iban === iban) {
      res.status(400).json({ error: 'Cannot transfer to your own account' });
      return;
    }

    // Find recipient account by IBAN
    const recipientAccount = await AccountModel.findByIBAN(iban);
    if (!recipientAccount) {
      res.status(404).json({ error: 'Recipient account not found' });
      return;
    }

    res.json({
      valid: true,
      recipient: {
        name: recipientAccount.full_name,
        iban: recipientAccount.iban,
        account_number: recipientAccount.account_number
      }
    });
  } catch (error) {
    console.error('Validate recipient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Create a new transfer
 */
export const createTransfer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { iban, amount, description } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Validate input
    if (!iban || !amount || amount <= 0) {
      res.status(400).json({ error: 'Invalid transfer data' });
      return;
    }

    // Validate IBAN format
    if (!validateIBAN(iban)) {
      res.status(400).json({ error: 'Invalid IBAN format' });
      return;
    }

    // Get sender's account
    const senderAccount = await AccountModel.findByUserId(userId);
    if (!senderAccount) {
      res.status(404).json({ error: 'Sender account not found' });
      return;
    }

    // Check if trying to transfer to own account
    if (senderAccount.iban === iban) {
      res.status(400).json({ error: 'Cannot transfer to your own account' });
      return;
    }

    // Find recipient account
    const recipientAccount = await AccountModel.findByIBAN(iban);
    if (!recipientAccount) {
      res.status(404).json({ error: 'Recipient account not found' });
      return;
    }

    // Check if sender has sufficient balance
    if (senderAccount.balance < amount) {
      res.status(400).json({ 
        error: 'Insufficient balance',
        current_balance: senderAccount.balance,
        required: amount
      });
      return;
    }

    // Create transaction
    const transactionId = await TransactionModel.create(
      senderAccount.id,
      recipientAccount.id,
      amount,
      description || 'Transfer'
    );

    // Get updated balances
    const updatedSenderAccount = await AccountModel.findById(senderAccount.id);
    const transaction = await TransactionModel.findById(transactionId);

    res.status(201).json({
      message: 'Transfer completed successfully',
      transaction: {
        id: transactionId,
        amount: amount,
        description: description || 'Transfer',
        recipient: {
          name: recipientAccount.full_name,
          iban: recipientAccount.iban
        },
        date: transaction?.transaction_date
      },
      new_balance: updatedSenderAccount?.balance
    });
  } catch (error: any) {
    console.error('Create transfer error:', error);
    
    if (error.message === 'Insufficient balance') {
      res.status(400).json({ error: 'Insufficient balance' });
      return;
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get transfer history
 */
export const getTransferHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || 20;

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

    // Format transactions
    const formattedTransactions = transactions.map(tx => {
      const isOutgoing = tx.from_account_id === account.id;
      
      return {
        id: tx.id,
        type: isOutgoing ? 'sent' : 'received',
        amount: tx.amount,
        description: tx.description,
        date: tx.transaction_date,
        counterparty: {
          name: isOutgoing ? tx.to_user_name : tx.from_user_name,
          iban: isOutgoing ? tx.to_iban : tx.from_iban
        }
      };
    });

    res.json({
      transfers: formattedTransactions,
      total: formattedTransactions.length
    });
  } catch (error) {
    console.error('Get transfer history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

