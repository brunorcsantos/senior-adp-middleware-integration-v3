# Senior ADP Middleware Integration

Middleware Node.js para integração entre ADP RH e Senior G5.

## Pré-requisitos

- Node.js >= 18.0.0
- Certificados digitais ADP (.key e .cer)
- Acesso ao webservice SOAP do Senior G5

## Instalação

```bash
npm install
cp .env.example .env
# Edite o .env com as credenciais do ambiente
```

## Estrutura de pastas

src/

├── routes/       # Endpoints Express

├── services/     # Clientes ADP e SOAP

├── mappers/      # Transformação dos payloads ADP

└── utils/        # Logger e configuração

certs/            # Certificados (não versionado)

logs/             # Logs de execução (não versionado)

installer/        # Scripts NSSM para Windows

## Execução

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## Tabelas de staging Senior

| Tabela | Descrição |
|---|---|
| USU_TADPRUN | Controle de execuções |
| USU_TADPWKR | Workers (colaboradores) |
| USU_TADPHDP | Histórico de departamento |
| USU_TADPHCC | Histórico de centro de custo |
| USU_TADPDEP | Cadastro de departamentos |
| USU_TADPAFA | Afastamentos |