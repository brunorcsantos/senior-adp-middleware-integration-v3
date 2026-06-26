import axios from 'axios';
import { env } from '../utils/envConfig.js';
import { logger } from '../utils/logger.js';
import { getAdpToken, getMtlsAgent } from './adpAuth.js';

const TOP = 100;

export const fetchLeavesForWorker = async (associateOID, token, agent, uuidRun = '-') => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${env.urlAdp}/hr/v2/workers/${associateOID}/leaves`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': undefined,
        'Accept': undefined,
      },
      params: { $top: TOP },
      httpsAgent: agent,
    });

    return response.data.workerLeaves?.[0] ?? null;
  } catch (error) {
    logger.warn('AFA', `Falha ao buscar afastamentos do worker ${associateOID}: ${error?.response?.status ?? error.message}`, uuidRun);
    return null;
  }
};

export const fetchAllLeaves = async (workers, uuidRun = '-') => {
  logger.info('AFA', `Iniciando busca de afastamentos para ${workers.length} workers`, uuidRun);

  const token = await getAdpToken(uuidRun);
  const agent = getMtlsAgent();

  const allLeaves = [];

  for (const worker of workers) {
    const associateOID = worker.associateOID;
    logger.info('AFA', `Buscando afastamentos do worker ${associateOID}`, uuidRun);

    const leave = await fetchLeavesForWorker(associateOID, token, agent, uuidRun);

    if (leave) {
      allLeaves.push(leave);
    }
  }

  logger.info('AFA', `Busca concluída. Total com afastamentos: ${allLeaves.length}`, uuidRun);
  return allLeaves;
};