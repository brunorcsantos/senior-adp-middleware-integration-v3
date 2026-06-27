import { Router } from "express";
import { randomUUID } from "crypto";
import { logger } from "../utils/logger.js";
import { env } from "../utils/envConfig.js";

import { fetchAllWorkers } from "../services/adpWorkers.js";
import { fetchAllDepartments } from "../services/adpDepartments.js";
import { fetchAllLeaves } from "../services/adpLeaves.js";

import {
  mapWorkers,
  mapHistDeptos,
  mapHistCC,
  mapHistCargo,
  mapHistEscala,
  mapHistFilial,
  mapHistContrato,
  mapHistApuracao,
  mapHistVinculo,
  mapHistSindicato,
} from "../mappers/workerMapper.js";
import { mapDepartments } from "../mappers/departmentMapper.js";
import { mapLeaves } from "../mappers/leaveMapper.js";

import { processaRun } from "../services/soapRun.js";
import { processaWorkers } from "../services/soapWorkers.js";
import { processaDepartamentos } from "../services/soapDepartments.js";
import { processaAfastamentos } from "../services/soapLeaves.js";
import { processaHistDeptos } from "../services/soapHistDep.js";
import { processaHistCC } from "../services/soapHistCC.js";
import { processaHistCargo } from '../services/soapHistCargo.js';
import { processaHistEscala } from '../services/soapHistEscala.js';
import { processaHistFilial } from '../services/soapHistFilial.js';
import { processaHistContrato } from '../services/soapHistContrato.js';
import { processaHistApuracao } from '../services/soapHistApuracao.js';
import { processaHistVinculo } from '../services/soapHistVinculo.js';
import { processaHistSindicato } from '../services/soapHistSindicato.js';

const router = Router();

let isRunning = false;

const runSync = async (uuidRun) => {
  let totalWkr = 0;
  let totalDep = 0;
  let totalAfa = 0;
  let totalHdp = 0;
  let totalHcc = 0;
  let totalCargo = 0;
  let totalEscala = 0;
  let totalFilial = 0;
  let totalContrato = 0;
  let totalApuracao = 0;
  let totalVinculo = 0;
  let totalSindicato = 0;
  let totalErros = 0;

  try {
    // Registrar início da execução
    await processaRun(
      {
        UUIDRUN: uuidRun,
        STATUS: "RUNNING",
        TOTALWKR: 0,
        TOTALDEP: 0,
        TOTALAFA: 0,
        TOTALHDP: 0,
        TOTALHCC: 0,
        TOTALHCA: 0,
        TOTALHES: 0,
        TOTALHFI: 0,
        TOTALHCO: 0,
        TOTALAPU: 0,
        TOTALHVI: 0,
        TOTALHSI: 0,
        ERROS: 0,
      },
      uuidRun,
    );

    // ─── PIPELINE WORKERS ────────────────────────────────────────────
    logger.info("SYNC", "Iniciando pipeline Workers", uuidRun);
    const workers = await fetchAllWorkers(uuidRun);

    const mappedWorkers = mapWorkers(workers, uuidRun);
    const mappedHistDep = mapHistDeptos(workers, uuidRun);
    const mappedHistCC = mapHistCC(workers, uuidRun);
    const mappedHistCargo = mapHistCargo(workers, uuidRun);
    const mappedHistEsc = mapHistEscala(workers, uuidRun);
    const mappedHistFil = mapHistFilial(workers, uuidRun);
    const mappedHistCon = mapHistContrato(workers, uuidRun);
    const mappedHistApu = mapHistApuracao(workers, uuidRun);
    const mappedHistVin = mapHistVinculo(workers, uuidRun);
    const mappedHistSind = mapHistSindicato(workers, uuidRun);

    const resultWkr = await processaWorkers(mappedWorkers, uuidRun);
    const resultHdp = await processaHistDeptos(mappedHistDep, uuidRun);
    const resultHcc = await processaHistCC(mappedHistCC, uuidRun);
    const resultCargo = await processaHistCargo(mappedHistCargo, uuidRun);
    const resultEsc = await processaHistEscala(mappedHistEsc, uuidRun);
    const resultFil = await processaHistFilial(mappedHistFil, uuidRun);
    const resultCon = await processaHistContrato(mappedHistCon, uuidRun);
    const resultApu = await processaHistApuracao(mappedHistApu, uuidRun);
    const resultVin = await processaHistVinculo(mappedHistVin, uuidRun);
    const resultSind = await processaHistSindicato(mappedHistSind, uuidRun);

    totalWkr = mappedWorkers.length;
    totalHdp = mappedHistDep.length;
    totalHcc = mappedHistCC.length;
    totalCargo = mappedHistCargo.length;
    totalEscala = mappedHistEsc.length;
    totalFilial = mappedHistFil.length;
    totalContrato = mappedHistCon.length;
    totalApuracao = mappedHistApu.length;
    totalVinculo = mappedHistVin.length;
    totalSindicato = mappedHistSind.length;

    totalErros +=
      resultWkr.erros +
      resultHdp.erros +
      resultHcc.erros +
      resultCargo.erros +
      resultEsc.erros +
      resultFil.erros +
      resultCon.erros +
      resultApu.erros +
      resultVin.erros +
      resultSind.erros;

    // ─── PIPELINE DEPARTAMENTOS ───────────────────────────────────────
    logger.info("SYNC", "Iniciando pipeline Departamentos", uuidRun);
    const departments = await fetchAllDepartments(uuidRun);

    const mappedDeps = mapDepartments(departments, uuidRun);
    const resultDep = await processaDepartamentos(mappedDeps, uuidRun);

    totalDep = mappedDeps.length;
    totalErros += resultDep.erros;

    // ─── PIPELINE AFASTAMENTOS ────────────────────────────────────────
    logger.info("SYNC", "Iniciando pipeline Afastamentos", uuidRun);
    const leaves = await fetchAllLeaves(workers, uuidRun);

    const mappedLeaves = mapLeaves(leaves, uuidRun);
    const resultAfa = await processaAfastamentos(mappedLeaves, uuidRun);

    totalAfa = mappedLeaves.length;
    totalErros += resultAfa.erros;

    // ─── FINALIZAR EXECUÇÃO ───────────────────────────────────────────
    await processaRun(
      {
        UUIDRUN: uuidRun,
        STATUS: "DONE",
        TOTALWKR: totalWkr,
        TOTALDEP: totalDep,
        TOTALAFA: totalAfa,
        TOTALHDP: totalHdp,
        TOTALHCC: totalHcc,
        TOTALHCA: totalCargo,
        TOTALHES: totalEscala,
        TOTALHFI: totalFilial,
        TOTALHCO: totalContrato,
        TOTALAPU: totalApuracao,
        TOTALHVI: totalVinculo,
        TOTALHSI: totalSindicato,
        ERROS: totalErros,
      },
      uuidRun,
    );

    logger.info(
      "SYNC",
      `Execução concluída. WKR:${totalWkr} DEP:${totalDep} AFA:${totalAfa} HDP:${totalHdp} HCC:${totalHcc} HCA:${totalCargo} HES:${totalEscala} HFI:${totalFilial} HCO:${totalContrato} APU:${totalApuracao} HVI:${totalVinculo} HSI:${totalSindicato} ERROS:${totalErros}`,
      uuidRun,
    );
  } catch (err) {
    totalErros++;
    logger.error("SYNC", `Erro crítico na execução: ${err.message}`, uuidRun);

    try {
      await processaRun(
        {
          UUIDRUN: uuidRun,
          STATUS: "ERROR",
          TOTALWKR: totalWkr,
          TOTALDEP: totalDep,
          TOTALAFA: totalAfa,
          TOTALHDP: totalHdp,
          TOTALHCC: totalHcc,
          TOTALHCA: totalCargo,
          TOTALHES: totalEscala,
          TOTALHFI: totalFilial,
          TOTALHCO: totalContrato,
          TOTALAPU: totalApuracao,
          TOTALHVI: totalVinculo,
          TOTALHSI: totalSindicato,
          ERROS: totalErros,
        },
        uuidRun,
      );
    } catch (runErr) {
      logger.error(
        "SYNC",
        `Falha ao atualizar USU_TADPRUN com STATUS=ERROR: ${runErr.message}`,
        uuidRun,
      );
    }
  } finally {
    isRunning = false;
  }
};

router.post("/", async (req, res) => {
  if (!env.allowConcurrent && isRunning) {
    logger.warn("SYNC", "Execução já em andamento. Requisição rejeitada.");
    return res.status(429).json({
      status: "rejected",
      message: "Sincronização já em andamento. Aguarde a conclusão.",
    });
  }

  const uuidRun = randomUUID();
  isRunning = true;

  logger.info("SYNC", `Nova execução iniciada. UUIDRUN: ${uuidRun}`);

  // Responde imediatamente ao G5 — não bloqueia o processo
  res.status(202).json({
    status: "accepted",
    uuidRun,
    message: "Sincronização iniciada.",
  });

  // Executa de forma assíncrona após responder
  runSync(uuidRun);
});

export default router;
