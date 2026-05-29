import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
  validateRecipient, 
  createTransfer, 
  getTransferHistory 
} from '../controllers/transferController';

const router = Router();

/**
 * All routes require authentication
 */
router.use(authenticateToken);

/**
 * POST /api/transfers/validate
 * Validate recipient IBAN and get details
 */
router.post('/validate', validateRecipient);

/**
 * POST /api/transfers
 * Create a new transfer
 */
router.post('/', createTransfer);

/**
 * GET /api/transfers/history
 * Get transfer history
 */
router.get('/history', getTransferHistory);

export default router;

