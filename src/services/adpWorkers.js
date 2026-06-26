import { env } from '../utils/envConfig.js';
import { logger } from '../utils/logger.js';
import { getAdpToken, getMtlsAgent } from './adpAuth.js';

const TOP = 100;

const fetchPage = async (token, agent, skip) => {
  const url = `${env.urlAdp}/hr/v2/workers?$top=${TOP}&$skip=${skip}`;

  const response = await fetch(url, {
    method: 'GET',
    agent,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`ADP Workers falhou: ${response.status} - ${detail}`);
  }

  const data = await response.json();
  return data.workers ?? [];
};

export const fetchAllWorkers = async (uuidRun = '-') => {
  logger.info('WORKERS', 'Iniciando busca de workers ADP', uuidRun);

  const token = await getAdpToken(uuidRun);
  const agent = getMtlsAgent();

  let allWorkers = [];
  let skip = 0;
  let page = 1;

  while (true) {
    logger.info('WORKERS', `Buscando página ${page} (skip=${skip})`, uuidRun);

    const workers = await fetchPage(token, agent, skip);

    if (workers.length === 0) {
      logger.info('WORKERS', `Paginação concluída. Total: ${allWorkers.length} workers`, uuidRun);
      break;
    }

    allWorkers = allWorkers.concat(workers);
    logger.info('WORKERS', `Página ${page} recebida: ${workers.length} registros`, uuidRun);

    if (workers.length < TOP) {
      logger.info('WORKERS', `Última página detectada. Total: ${allWorkers.length} workers`, uuidRun);
      break;
    }

    skip += TOP;
    page++;
  }

  return allWorkers;
};