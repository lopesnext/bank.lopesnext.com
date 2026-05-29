import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';

export interface Account {
  id: number;
  user_id: number;
  account_number: string;
  iban: string;
  balance: number;
  created_at: Date;
}

export interface AccountWithUser extends Account {
  full_name: string;
  email: string;
}

export class AccountModel {
  /**
   * Create a new account
   */
  static async create(
    userId: number,
    accountNumber: string,
    iban: string,
    initialBalance: number = 1000.00
  ): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO accounts (user_id, account_number, iban, balance)
       VALUES (?, ?, ?, ?)`,
      [userId, accountNumber, iban, initialBalance]
    );

    return result.insertId;
  }

  /**
   * Find account by user ID
   */
  static async findByUserId(userId: number): Promise<Account | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM accounts WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as Account;
  }

  /**
   * Find account by IBAN
   */
  static async findByIBAN(iban: string): Promise<AccountWithUser | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT a.*, u.full_name, u.email 
       FROM accounts a
       JOIN users u ON a.user_id = u.id
       WHERE a.iban = ?`,
      [iban]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as AccountWithUser;
  }

  /**
   * Find account by account number
   */
  static async findByAccountNumber(accountNumber: string): Promise<Account | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM accounts WHERE account_number = ?',
      [accountNumber]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as Account;
  }

  /**
   * Update account balance
   */
  static async updateBalance(accountId: number, newBalance: number): Promise<void> {
    await pool.execute(
      'UPDATE accounts SET balance = ? WHERE id = ?',
      [newBalance, accountId]
    );
  }

  /**
   * Get account by ID
   */
  static async findById(accountId: number): Promise<Account | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM accounts WHERE id = ?',
      [accountId]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as Account;
  }
}

