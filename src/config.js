import dotenv from 'dotenv';

dotenv.config();

const config = {
  pipedriveApiKey: process.env.PIP2APN_PIPEDRIVE_API_KEY || "",
  apnCredentials: {
    accessKeyId: process.env.PIP2APN_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.PIP2APN_AWS_SECRET_ACCESS_KEY || "",
    region: process.env.PIP2APN_AWS_REGION || "us-east-1",
  },
  apnCatalog: process.env.PIP2APN_APN_CATALOG || "Sandbox",
  port: process.env.PIP2APN_PORT || process.env.PORT || 3001,
  // Adicionar outras configurações conforme necessário
};

export default config;
