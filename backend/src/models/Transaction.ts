import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';

export interface Transaction {
  id: number;
  from_account_id: number;
  to_account_id: number;
  amount: number;
  description: string;
  transaction_date: Date;
}

export interface TransactionWithDetails extends Transaction {
  from_account_number: string;
  from_iban: string;
  from_user_name: string;
  to_account_number: string;
  to_iban: string;
  to_user_name: string;
}

export class TransactionModel {
  /**
   * Create a new transaction
   */
  static async create(
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    description: string
  ): Promise<number> {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Get account balances
      const [fromAccounts] = await connection.execute<RowDataPacket[]>(
        'SELECT balance FROM accounts WHERE id = ? FOR UPDATE',
        [fromAccountId]
      );

      const [toAccounts] = await connection.execute<RowDataPacket[]>(
        'SELECT balance FROM accounts WHERE id = ? FOR UPDATE',
        [toAccountId]
      );

      if (fromAccounts.length === 0 || toAccounts.length === 0) {
        throw new Error('Account not found');
      }

      const fromBalance = fromAccounts[0].balance;
      const toBalance = toAccounts[0].balance;

      // Check if sender has sufficient balance
      if (fromBalance < amount) {
        throw new Error('Insufficient balance');
      }

      // Update balances
      await connection.execute(
        'UPDATE accounts SET balance = balance - ? WHERE id = ?',
        [amount, fromAccountId]
      );

      await connection.execute(
        'UPDATE accounts SET balance = balance + ? WHERE id = ?',
        [amount, toAccountId]
      );

      // Create transaction record
      const [result] = await connection.execute<ResultSetHeader>(
        `INSERT INTO transactions (from_account_id, to_account_id, amount, description)
         VALUES (?, ?, ?, ?)`,
        [fromAccountId, toAccountId, amount, description]
      );

      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Get transactions for an account (last N transactions)
   */
  static async getByAccountId(accountId: number, limit: number = 10): Promise<TransactionWithDetails[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        t.*,
        fa.account_number as from_account_number,
        fa.iban as from_iban,
        fu.full_name as from_user_name,
        ta.account_number as to_account_number,
        ta.iban as to_iban,
        tu.full_name as to_user_name
       FROM transactions t
       JOIN accounts fa ON t.from_account_id = fa.id
       JOIN users fu ON fa.user_id = fu.id
       JOIN accounts ta ON t.to_account_id = ta.id
       JOIN users tu ON ta.user_id = tu.id
       WHERE t.from_account_id = ? OR t.to_account_id = ?
       ORDER BY t.transaction_date DESC
       LIMIT ?`,
      [accountId, accountId, limit]
    );

    return rows as TransactionWithDetails[];
  }

  /**
   * Get transaction by ID
   */
  static async findById(transactionId: number): Promise<TransactionWithDetails | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        t.*,
        fa.account_number as from_account_number,
        fa.iban as from_iban,
        fu.full_name as from_user_name,
        ta.account_number as to_account_number,
        ta.iban as to_iban,
        tu.full_name as to_user_name
       FROM transactions t
       JOIN accounts fa ON t.from_account_id = fa.id
       JOIN users fu ON fa.user_id = fu.id
       JOIN accounts ta ON t.to_account_id = ta.id
       JOIN users tu ON ta.user_id = tu.id
       WHERE t.id = ?`,
      [transactionId]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as TransactionWithDetails;
  }

  /**
   * Get all transactions between two accounts
   */
  static async getBetweenAccounts(
    accountId1: number,
    accountId2: number
  ): Promise<TransactionWithDetails[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        t.*,
        fa.account_number as from_account_number,
        fa.iban as from_iban,
        fu.full_name as from_user_name,
        ta.account_number as to_account_number,
        ta.iban as to_iban,
        tu.full_name as to_user_name
       FROM transactions t
       JOIN accounts fa ON t.from_account_id = fa.id
       JOIN users fu ON fa.user_id = fu.id
       JOIN accounts ta ON t.to_account_id = ta.id
       JOIN users tu ON ta.user_id = tu.id
       WHERE (t.from_account_id = ? AND t.to_account_id = ?)
          OR (t.from_account_id = ? AND t.to_account_id = ?)
       ORDER BY t.transaction_date DESC`,
      [accountId1, accountId2, accountId2, accountId1]
    );

    return rows as TransactionWithDetails[];
  }
}

