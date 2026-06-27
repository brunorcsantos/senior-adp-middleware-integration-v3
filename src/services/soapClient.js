import soap from 'soap';
import { env } from '../utils/envConfig.js';
import { logger } from '../utils/logger.js';

const WSDL_URL = `${env.urlG5}/g5-senior-services/rubi_Synccom_lobtec_seniorx_integracaoWorkers_v3?wsdl`;

let clientInstance = null;

const getClient = async () => {
  if (clientInstance) return clientInstance;
  clientInstance = await soap.createClientAsync(WSDL_URL, {
    disableCache: false,
  });
  return clientInstance;
};

const buildAuth = () => ({
  user: env.usuarioG5,
  password: env.senhaG5,
  encryption: 0,
});

export const callOperation = async (operation, parameters, uuidRun = '-') => {
  const client = await getClient();
  const auth = buildAuth();

  const args = {
    ...auth,
    parameters,
  };

  logger.info('SOAP', `Chamando operação ${operation}`, uuidRun);

  try {
    const [result] = await client[`${operation}Async`](args);

    if (result?.result?.erroExecucao) {
      throw new Error(`Erro Senior [${operation}]: ${result.result.erroExecucao}`);
    }

    logger.info('SOAP', `Operação ${operation} concluída com sucesso`, uuidRun);
    return result?.result ?? null;

  } catch (err) {
    logger.error('SOAP', `Erro na operação ${operation}: ${err?.message}`, uuidRun);
    logger.error('SOAP', `Body do erro: ${JSON.stringify(err?.body ?? err?.cause ?? {})}`, uuidRun);
    throw err;
  }
};

export const resetClient = () => {
  clientInstance = null;
};