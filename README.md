# Pipe2APN Backend

Backend para integração entre Pipedrive e AWS Partner Network (APN), otimizado para deploy no AWS Amplify.

## Descrição

Este projeto é um backend Node.js que facilita a integração entre o CRM Pipedrive e o sistema AWS Partner Network, permitindo sincronização de dados e automação de processos de parceria.

## Funcionalidades

- 🔄 Sincronização de dados entre Pipedrive e AWS APN
- 📊 Exportação de dados em formato Excel
- 🌍 Suporte a diferentes países e segmentos
- 🔐 Autenticação segura com AWS
- 📱 API RESTful para integração

## Tecnologias

- **Node.js** (≥20.0.0)
- **Express.js** - Framework web
- **AWS SDK** - Integração com serviços AWS
- **Pipedrive SDK** - Integração com Pipedrive
- **ExcelJS** - Manipulação de planilhas

## Configuração

### Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as seguintes variáveis:

```bash
# Pipedrive
PIP2APN_PIPEDRIVE_API_KEY="sua_chave_api_pipedrive"

# AWS
PIP2APN_AWS_ACCESS_KEY_ID="sua_access_key_aws"
PIP2APN_AWS_SECRET_ACCESS_KEY="sua_secret_key_aws"
PIP2APN_AWS_ACCOUNT_ID="seu_account_id_aws"
PIP2APN_AWS_REGION="us-east-1"

# Configurações
PIP2APN_APN_CATALOG="Sandbox"
PIP2APN_PORT=3001

# Opcional - Taxa de conversão BRL para USD (padrão: 5.60)
PIP2APN_BRL_TO_USD_RATE=5.60
```

## Instalação e Execução

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Executar em produção
npm start
```

### Deploy no AWS Amplify

Este projeto está configurado para deploy automático no AWS Amplify:

1. Conecte seu repositório GitHub ao Amplify
2. Configure as variáveis de ambiente no console do Amplify
3. O deploy será feito automaticamente usando o arquivo `amplify.yml`

## Estrutura do Projeto

```
src/
├── app.js              # Configuração principal da aplicação
├── server.js           # Servidor HTTP
├── config.js           # Configurações
├── controllers/        # Controladores da API
│   ├── apnController.js
│   ├── exportController.js
│   └── pipedriveController.js
├── middlewares/        # Middlewares
│   └── logMiddleware.js
├── routes/             # Definição das rotas
│   ├── apnRoutes.js
│   ├── exportRoutes.js
│   └── pipedriveRoutes.js
├── services/           # Lógica de negócio
│   ├── apnService.js
│   ├── exportService.js
│   └── pipedriveService.js
└── utils/              # Utilitários
    ├── country.js
    ├── person.js
    ├── phoneUtils.js
    ├── segment.js
    └── useCase.js
```

## API Endpoints

### Pipedrive
- `GET /api/pipedrive/deals` - Listar deals
- `GET /api/pipedrive/persons` - Listar pessoas
- `GET /api/pipedrive/organizations` - Listar organizações

### APN
- `POST /api/apn/sync` - Sincronizar dados com APN
- `GET /api/apn/opportunities` - Listar oportunidades

### Export
- `GET /api/export/excel` - Exportar dados para Excel
- `GET /api/export/report` - Gerar relatório

## Versioning

Versão atual: **1.0.1**

A versão é incrementada automaticamente a cada deploy e exibida no console do servidor.

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto é proprietário e confidencial.

## Suporte

Para suporte técnico, entre em contato com a equipe de desenvolvimento.

