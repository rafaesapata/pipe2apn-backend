import dotenv from 'dotenv';

dotenv.config();

const config = {
  pipedriveApiKey: process.env.PIPEDRIVE_API_KEY || "",
  apnCredentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    region: process.env.AWS_REGION || "us-east-1",
  },
  apnCatalog: process.env.APN_CATALOG || "Sandbox",
  port: process.env.PORT || 3001,
  // Adicionar outras configurações conforme necessário
};

export default config;
