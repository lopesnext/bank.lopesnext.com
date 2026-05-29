import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
  getAccountDetails, 
  getTransactions, 
  getBalance 
} from '../controllers/accountController';

const router = Router();

/**
 * All routes require authentication
 */
router.use(authenticateToken);

/**
 * GET /api/account
 * Get account details
 */
router.get('/', getAccountDetails);

/**
 * GET /api/account/balance
 * Get account balance
 */
router.get('/balance', getBalance);

/**
 * GET /api/account/transactions
 * Get account transactions
 */
router.get('/transactions', getTransactions);

export default router;

