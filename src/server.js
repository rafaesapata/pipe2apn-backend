import app from './app.js';
import config from './config.js';

// Debug das variáveis de ambiente
console.log('=== DEBUG VARIÁVEIS DE AMBIENTE ===');
console.log('process.env.PORT:', process.env.PORT);
console.log('process.env.PIP2APN_PORT:', process.env.PIP2APN_PORT);
console.log('config.port:', config.port);
console.log('=====================================');

const PORT = process.env.PORT || process.env.PIP2APN_PORT || config.port || 3001;

console.log(`Porta selecionada: ${PORT}`);

process.env.TZ = "America/Sao_Paulo";
process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse em http://localhost:${PORT}`);
  console.log(`Versão: ${process.env.npm_package_version || '1.0.5'}`);
});
