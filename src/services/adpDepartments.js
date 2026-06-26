import axios from 'axios';
import { env } from '../utils/envConfig.js';
import { logger } from '../utils/logger.js';
import { getAdpToken, getMtlsAgent } from './adpAuth.js';

const TOP = 100;

const fetchPage = async (token, agent, skip) => {
  const response = await axios({
    method: 'GET',
    url: `${env.urlAdp}/core/v1/organization-departments`,
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

  return response.data.organizationDepartments ?? [];
};

export const fetchAllDepartments = async (uuidRun = '-') => {
  logger.info('DEPTO', 'Iniciando busca de departamentos ADP', uuidRun);

  const token = await getAdpToken(uuidRun);
  const agent = getMtlsAgent();

  let allDepartments = [];
  let skip = 0;
  let page = 1;

  while (true) {
    logger.info('DEPTO', `Buscando página ${page} (skip=${skip})`, uuidRun);

    const departments = await fetchPage(token, agent, skip);

    if (departments.length === 0) {
      logger.info('DEPTO', `Paginação concluída. Total: ${allDepartments.length} departamentos`, uuidRun);
      break;
    }

    allDepartments = allDepartments.concat(departments);
    logger.info('DEPTO', `Página ${page} recebida: ${departments.length} registros`, uuidRun);

    if (departments.length < TOP) {
      logger.info('DEPTO', `Última página detectada. Total: ${allDepartments.length} departamentos`, uuidRun);
      break;
    }

    skip += TOP;
    page++;
  }

  return allDepartments;
};