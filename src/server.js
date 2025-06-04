import app from './app.js';
import config from './config.js';

const PORT = process.env.PIP2APN_PORT || process.env.PORT || config.port || 3001;

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
  console.log(`Versão: ${process.env.npm_package_version || '1.0.3'}`);
});
