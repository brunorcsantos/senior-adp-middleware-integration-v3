import { callOperation } from './soapClient.js';
import { logger } from '../utils/logger.js';
import { env } from '../utils/envConfig.js';

export const processaWorkers = async (workers, uuidRun = '-') => {
  logger.info('SOAP', `Enviando ${workers.length} workers ao Senior`, uuidRun);

  const batches = [];
  for (let i = 0; i < workers.length; i += env.batchSize) {
    batches.push(workers.slice(i, i + env.batchSize));
  }

  logger.info('SOAP', `Total de lotes: ${batches.length}`, uuidRun);

  let enviados = 0;
  let erros = 0;

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    logger.info('SOAP', `Enviando lote ${i + 1}/${batches.length} (${batch.length} registros)`, uuidRun);

    for (const worker of batch) {
      try {
        await callOperation('ProcessaWorkers', worker, uuidRun);
        enviados++;
      } catch (err) {
        logger.error('SOAP', `Erro ao enviar worker ${worker.UUIDSO}: ${err.message}`, uuidRun);
        erros++;
      }
    }
  }

  logger.info('SOAP', `Workers concluído. Enviados: ${enviados} | Erros: ${erros}`, uuidRun);
  return { enviados, erros };
};