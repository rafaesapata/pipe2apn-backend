import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import exportRoutes from './routes/exportRoutes.js'; // Importar as rotas de exportação
import pipedriveRoutes from './routes/pipedriveRoutes.js'; // Importar as rotas de pipedrive
import apnRoutes from './routes/apnRoutes.js'; // Importar as rotas de APN
import LogMiddleware from './middlewares/logMiddleware.js';

const app = express();

// Middlewares
app.use(helmet()); // Adiciona headers de segurança
app.use(compression()); // Comprime as respostas HTTP
app.use(express.json({ limit: '10mb' })); // Aumenta o limite para uploads maiores
app.use(express.urlencoded({ extended: true })); // Suporte para dados de formulário

// Configuração do CORS com headers expostos
app.use(cors());
app.use(LogMiddleware); // Adiciona o middleware de log

// Rotas
app.use('/api/export', exportRoutes); // Usar as rotas de exportação
app.use('/api/pipedrive', pipedriveRoutes); // Usar as rotas de pipedrive
app.use('/api/apn', apnRoutes); // Usar as rotas de APN

// Rota de health check básica
app.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  };
  res.status(200).send(healthcheck);
});

// Tratamento de rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  // Enviar uma resposta de erro mais detalhada, se possível, sem expor dados sensíveis
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something broke!';
  res.status(statusCode).json({ success: false, message });
});

export default app;
