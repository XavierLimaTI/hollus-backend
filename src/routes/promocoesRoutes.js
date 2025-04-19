import express from 'express';
import { getPromocoes } from '../controllers/promocoesController.js';

const router = express.Router();

router.get('/', getPromocoes);

export default router;