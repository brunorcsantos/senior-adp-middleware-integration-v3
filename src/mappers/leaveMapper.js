import { logger } from '../utils/logger.js';

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return dateStr.substring(0, 10);
};

const formatDateTime = (date = new Date()) => {
  return date.toISOString().replace('T', ' ').substring(0, 19);
};

export const mapLeave = (workerLeave, leave, uuidRun) => {
  try {
    return {
      UUIDRUN: uuidRun,
      UUIDSO: leave.itemID ?? null,

      // Chaves Senior do colaborador — preenchidas pelo LSP
      NUMEMP: null,
      TIPCOL: null,
      NUMCAD: null,

      // Chave histórica
      DATAFA: formatDate(leave.effectiveDateTime),

      // Identificação ADP do colaborador
      ASSOCIATEOID: workerLeave.associateOID ?? null,
      WORKERID: workerLeave.workerID?.idValue ?? null,

      // Dados do afastamento
      QTDDIAS: leave.leaveAbsence?.leaveDuration?.quantityValue ?? null,
      DTRETORNO: formatDate(leave.leaveReturn?.returnDateTime),
      STLICENCA: leave.leaveAbsence?.leaveStatus?.leaveStatusCode?.shortName ?? null,
      STRETORNO: leave.leaveReturn?.returnStatus?.returnStatusCode?.shortName ?? null,

      // Controle de staging
      SITUACAO: 'P',
      DTATUALIZ: formatDateTime(),
      DTPROCESSADO: null,
    };
  } catch (err) {
    logger.error('MAPPER', `Erro ao mapear afastamento ${leave?.itemID}: ${err.message}`, uuidRun);
    return null;
  }
};

export const mapLeaves = (workerLeaves, uuidRun) => {
  logger.info('MAPPER', `Mapeando afastamentos de ${workerLeaves.length} workers`, uuidRun);

  const mapped = [];
  let seq = 1;

  for (const workerLeave of workerLeaves) {
    const leaves = workerLeave.leaves ?? [];

    for (const leave of leaves) {
      const record = mapLeave(workerLeave, leave, uuidRun);
      if (record) {
        mapped.push({ ...record, SEQREG: seq++ });
      }
    }
  }

  logger.info('MAPPER', `Afastamentos mapeados com sucesso: ${mapped.length}`, uuidRun);
  return mapped;
};