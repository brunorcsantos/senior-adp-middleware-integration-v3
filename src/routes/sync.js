import { Router } from 'express';
import { randomUUID } from 'crypto';
import { logger } from '../utils/logger.js';
import { env } from '../utils/envConfig.js';

import { fetchAllWorkers } from '../services/adpWorkers.js';
import { fetchAllDepartments } from '../services/adpDepartments.js';
import { fetchAllLeaves } from '../services/adpLeaves.js';

import { mapWorkers, mapHistDeptos, mapHistCC } from '../mappers/workerMapper.js';
import { mapDepartments } from '../mappers/departmentMapper.js';
import { mapLeaves } from '../mappers/leaveMapper.js';

import { processaRun } from '../services/soapRun.js';
import { processaWorkers } from '../services/soapWorkers.js';
import { processaDepartamentos } from '../services/soapDepartments.js';
import { processaAfastamentos } from '../services/soapLeaves.js';
import { processaHistDeptos } from '../services/soapHistDep.js';
import { processaHistCC } from '../services/soapHistCC.js';

const router = Router();

let isRunning = false;

const formatDateTime = (date = new Date()) => {
  return date.toISOString().replace('T', ' ').substring(0, 19);
};

const runSync = async (uuidRun) => {
  let totalWkr = 0;
  let totalDep = 0;
  let totalAfa = 0;
  let totalHdp = 0;
  let totalHcc = 0;
  let totalErros = 0;

  try {
    // Registrar início da execução
    await processaRun({
      UUIDRUN: uuidRun,
      DTINICIO: formatDateTime(),
      DTFIM: null,
      STATUS: 'RUNNING',
      TOTALWKR: 0,
      TOTALDEP: 0,
      TOTALAFA: 0,
      TOTALHDP: 0,
      TOTALHCC: 0,
      ERROS: 0,
    }, uuidRun);

    // ─── PIPELINE WORKERS ────────────────────────────────────────────
    logger.info('SYNC', 'Iniciando pipeline Workers', uuidRun);
    const workers = await fetchAllWorkers(uuidRun);

    const mappedWorkers  = mapWorkers(workers, uuidRun);
    const mappedHistDep  = mapHistDeptos(workers, uuidRun);
    const mappedHistCC   = mapHistCC(workers, uuidRun);

    const resultWkr = await processaWorkers(mappedWorkers, uuidRun);
    const resultHdp = await processaHistDeptos(mappedHistDep, uuidRun);
    const resultHcc = await processaHistCC(mappedHistCC, uuidRun);

    totalWkr   = mappedWorkers.length;
    totalHdp   = mappedHistDep.length;
    totalHcc   = mappedHistCC.length;
    totalErros += resultWkr.erros + resultHdp.erros + resultHcc.erros;

    // ─── PIPELINE DEPARTAMENTOS ───────────────────────────────────────
    logger.info('SYNC', 'Iniciando pipeline Departamentos', uuidRun);
    const departments = await fetchAllDepartments(uuidRun);

    const mappedDeps = mapDepartments(departments, uuidRun);
    const resultDep  = await processaDepartamentos(mappedDeps, uuidRun);

    totalDep    = mappedDeps.length;
    totalErros += resultDep.erros;

    // ─── PIPELINE AFASTAMENTOS ────────────────────────────────────────
    logger.info('SYNC', 'Iniciando pipeline Afastamentos', uuidRun);
    const leaves = await fetchAllLeaves(workers, uuidRun);

    const mappedLeaves = mapLeaves(leaves, uuidRun);
    const resultAfa    = await processaAfastamentos(mappedLeaves, uuidRun);

    totalAfa    = mappedLeaves.length;
    totalErros += resultAfa.erros;

    // ─── FINALIZAR EXECUÇÃO ───────────────────────────────────────────
    await processaRun({
      UUIDRUN: uuidRun,
      DTINICIO: null,
      DTFIM: formatDateTime(),
      STATUS: 'DONE',
      TOTALWKR: totalWkr,
      TOTALDEP: totalDep,
      TOTALAFA: totalAfa,
      TOTALHDP: totalHdp,
      TOTALHCC: totalHcc,
      ERROS: totalErros,
    }, uuidRun);

    logger.info('SYNC', `Execução concluída. WKR:${totalWkr} DEP:${totalDep} AFA:${totalAfa} HDP:${totalHdp} HCC:${totalHcc} ERROS:${totalErros}`, uuidRun);

  } catch (err) {
    totalErros++;
    logger.error('SYNC', `Erro crítico na execução: ${err.message}`, uuidRun);

    try {
      await processaRun({
        UUIDRUN: uuidRun,
        DTINICIO: null,
        DTFIM: formatDateTime(),
        STATUS: 'ERROR',
        TOTALWKR: totalWkr,
        TOTALDEP: totalDep,
        TOTALAFA: totalAfa,
        TOTALHDP: totalHdp,
        TOTALHCC: totalHcc,
        ERROS: totalErros,
      }, uuidRun);
    } catch (runErr) {
      logger.error('SYNC', `Falha ao atualizar USU_TADPRUN com STATUS=ERROR: ${runErr.message}`, uuidRun);
    }
  } finally {
    isRunning = false;
  }
};

router.post('/', async (req, res) => {
  if (!env.allowConcurrent && isRunning) {
    logger.warn('SYNC', 'Execução já em andamento. Requisição rejeitada.');
    return res.status(429).json({
      status: 'rejected',
      message: 'Sincronização já em andamento. Aguarde a conclusão.',
    });
  }

  const uuidRun = randomUUID();
  isRunning = true;

  logger.info('SYNC', `Nova execução iniciada. UUIDRUN: ${uuidRun}`);

  // Responde imediatamente ao G5 — não bloqueia o processo
  res.status(202).json({
    status: 'accepted',
    uuidRun,
    message: 'Sincronização iniciada.',
  });

  // Executa de forma assíncrona após responder
  runSync(uuidRun);
});

export default router;