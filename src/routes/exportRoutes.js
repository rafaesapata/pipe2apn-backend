import express from 'express';
import exportController from '../controllers/exportController.js';

const router = express.Router();

// Rota para exportar itens selecionados
router.post('/excel', exportController.exportSelectedItems);

export default router;
