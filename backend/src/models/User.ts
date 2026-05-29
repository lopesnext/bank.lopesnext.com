import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  nif: string;
  cc: string;
  birth_date: Date;
  address: string;
  postal_code: string;
  phone: string;
  nationality: string;
  created_at: Date;
}

export interface UserRegistration {
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

export class UserModel {
  /**
   * Create a new user
   */
  static async create(userData: UserRegistration): Promise<number> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO users (full_name, email, password_hash, nif, cc, birth_date, address, postal_code, phone, nationality)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.full_name,
        userData.email,
        hashedPassword,
        userData.nif,
        userData.cc,
        userData.birth_date,
        userData.address,
        userData.postal_code,
        userData.phone,
        userData.nationality
      ]
    );

    return result.insertId;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as User;
  }

  /**
   * Find user by ID
   */
  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as User;
  }

  /**
   * Find user by NIF
   */
  static async findByNIF(nif: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE nif = ?',
      [nif]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as User;
  }

  /**
   * Find user by CC
   */
  static async findByCC(cc: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE cc = ?',
      [cc]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as User;
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Get user without sensitive data
   */
  static sanitizeUser(user: User): Omit<User, 'password_hash'> {
    const { password_hash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

