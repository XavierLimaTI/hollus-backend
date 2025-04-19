import express from 'express';
import { getAnalytics, getUserStatistics, getRevenueStatistics, getTherapistPerformance } from '../controllers/analyticsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Todas as rotas de admin requerem autenticação e permissão de admin
router.use(authMiddleware);
router.use(isAdmin);

// Rotas de análise
router.get('/analytics', getAnalytics);
router.get('/user-statistics', getUserStatistics);
router.get('/revenue-statistics', getRevenueStatistics);
router.get('/therapist-performance', getTherapistPerformance);

export default router;