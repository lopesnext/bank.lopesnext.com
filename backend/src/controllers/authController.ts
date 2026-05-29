import { Request, Response } from 'express';
import { UserModel, UserRegistration } from '../models/User';
import { AccountModel } from '../models/Account';
import { generateToken } from '../middleware/auth';
import {
  validateNIF,
  validateCC,
  validateEmail,
  validatePassword,
  validatePostalCode,
  validatePhone,
  generateAccountNumber,
  generateIBAN
} from '../utils/validators';

/**
 * User Login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isValidPassword = await UserModel.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Get user's account
    const account = await AccountModel.findByUserId(user.id);
    if (!account) {
      res.status(500).json({ error: 'Account not found' });
      return;
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    // Return user data without password
    const sanitizedUser = UserModel.sanitizeUser(user);

    res.json({
      message: 'Login successful',
      token,
      user: sanitizedUser,
      account: {
        id: account.id,
        account_number: account.account_number,
        iban: account.iban,
        balance: account.balance
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * User Registration
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData: UserRegistration = req.body;

    // Validate all required fields
    if (!userData.full_name || !userData.email || !userData.password ||
        !userData.nif || !userData.cc || !userData.birth_date ||
        !userData.address || !userData.postal_code || !userData.phone ||
        !userData.nationality) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    // Validate email format
    if (!validateEmail(userData.email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    // Validate password strength
    if (!validatePassword(userData.password)) {
      res.status(400).json({ 
        error: 'Password must be at least 8 characters with uppercase, lowercase, and number' 
      });
      return;
    }

    // Validate NIF
    if (!validateNIF(userData.nif)) {
      res.status(400).json({ error: 'Invalid NIF (Portuguese tax number)' });
      return;
    }

    // Validate CC
    if (!validateCC(userData.cc)) {
      res.status(400).json({ error: 'Invalid CC (Portuguese citizen card) format' });
      return;
    }

    // Validate postal code
    if (!validatePostalCode(userData.postal_code)) {
      res.status(400).json({ error: 'Invalid postal code format (XXXX-XXX)' });
      return;
    }

    // Validate phone
    if (!validatePhone(userData.phone)) {
      res.status(400).json({ error: 'Invalid phone number (9 digits starting with 9)' });
      return;
    }

    // Check if email already exists
    const existingEmail = await UserModel.findByEmail(userData.email);
    if (existingEmail) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    // Check if NIF already exists
    const existingNIF = await UserModel.findByNIF(userData.nif);
    if (existingNIF) {
      res.status(409).json({ error: 'NIF already registered' });
      return;
    }

    // Check if CC already exists
    const existingCC = await UserModel.findByCC(userData.cc);
    if (existingCC) {
      res.status(409).json({ error: 'CC already registered' });
      return;
    }

    // Create user
    const userId = await UserModel.create(userData);

    // Generate account number and IBAN
    const accountNumber = generateAccountNumber();
    const iban = generateIBAN(accountNumber);

    // Create account with initial balance of €1000
    const accountId = await AccountModel.create(userId, accountNumber, iban, 1000.00);

    // Get created user and account
    const user = await UserModel.findById(userId);
    const account = await AccountModel.findById(accountId);

    if (!user || !account) {
      res.status(500).json({ error: 'Error creating user account' });
      return;
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    // Return user data without password
    const sanitizedUser = UserModel.sanitizeUser(user);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: sanitizedUser,
      account: {
        id: account.id,
        account_number: account.account_number,
        iban: account.iban,
        balance: account.balance
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

