import axios from 'axios';
import { env } from '../utils/envConfig.js';
import { logger } from '../utils/logger.js';
import { getAdpToken, getMtlsAgent } from './adpAuth.js';

const TOP = 100;

const fetchPage = async (token, agent, skip) => {
  const response = await axios({
    method: 'GET',
    url: `${env.urlAdp}/hr/v2/workers`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': undefined,
      'Accept': undefined,
    },
    params: {
      $top: TOP,
      ...(skip > 0 && { $skip: skip }),
    },
    httpsAgent: agent,
  });

  return response.data.workers ?? [];
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