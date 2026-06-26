import { logger } from '../utils/logger.js';

const findAlternateID = (alternateIDs = [], shortName) => {
  return alternateIDs.find(id => id.schemeCode?.shortName === shortName)?.idValue ?? null;
};
null
const findGovID = (governmentIDs = [], shortName) => {
  return governmentIDs.find(id => id.nameCode?.shortName === shortName) ?? null;
};

const findCustomField = (stringFields = [], shortName) => {
  return stringFields.find(f => f.nameCode?.shortName === shortName)?.stringValue ?? null;
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return dateStr.substring(0, 10);
};

const formatDateTime = (date = new Date()) => {
  return date.toISOString().replace('T', ' ').substring(0, 19);
};

export const mapWorker = (worker, uuidRun) => {
  try {
    const person = worker.person ?? {};
    const legalName = person.legalName ?? {};
    const legalAddress = person.legalAddress ?? {};
    const communication = person.communication ?? {};
    const birthPlace = person.birthPlace ?? {};
    const customFields = person.customFieldGroup?.stringFields ?? [];
    const govIDs = person.governmentIDs ?? [];
    const alternateIDs = worker.alternateIDs ?? [];
    const workerDates = worker.workerDates ?? {};
    const workerStatus = worker.workerStatus ?? {};
    const assignment = worker.workAssignments?.[0] ?? {};
    const homeOrg = assignment.homeOrganizationalUnits?.[0]?.nameCode ?? {};
    const assignedOrg = assignment.assignedOrganizationalUnits?.[0]?.nameCode ?? {};
    const businessEmail = worker.businessCommunication?.emails?.[0]?.emailUri ?? null;
    const personalEmail = communication.emails?.[0]?.emailUri ?? null;
    const mobile = communication.mobiles?.[0]?.formattedNumber ?? null;

    const rg = findGovID(govIDs, 'RG');
    const ctps = findGovID(govIDs, 'CTPS');

    return {
      UUIDRUN: uuidRun,
      UUIDSO: worker.associateOID ?? null,

      // Chaves Senior — preenchidas pelo LSP
      NUMEMP: null,
      TIPCOL: null,
      NUMCAD: null,

      // Identificadores ADP
      MATRICULA: findAlternateID(alternateIDs, 'Matrícula'),
      CRACHA: findAlternateID(alternateIDs, 'Cracha'),
      WORKERID: worker.workerID?.idValue ?? null,

      // Dados pessoais
      NOME: legalName.formattedName ?? null,
      CPF: findGovID(govIDs, 'CPF')?.idValue ?? null,
      PIS: findGovID(govIDs, 'PIS')?.idValue ?? null,
      RG: rg?.idValue ?? null,
      ORGAORG: rg?.nameCode?.codeValue ?? null,
      CTPS: ctps?.idValue ?? null,
      SERIECTPS: ctps?.nameCode?.codeValue ?? null,
      DTNASC: formatDate(person.birthDate),
      SEXO: person.genderCode?.codeValue ?? null,
      ESTCIVIL: person.maritalStatusCode?.codeValue ?? null,
      RACA: person.raceCode?.codeValue ?? null,
      ESCOLARIDADE: person.highestEducationLevelCode?.codeValue ?? null,
      NOMMAE: findCustomField(customFields, "Mother's Name"),
      NOMPAI: findCustomField(customFields, "Father's Name"),
      CIDNASC: birthPlace.cityName ?? null,
      UFNASC: birthPlace.countrySubdivisionLevel1?.codeValue ?? null,

      // Endereço
      LOGRADOURO: legalAddress.streetName ?? null,
      NUMERO: legalAddress.buildingNumber ?? null,
      BAIRRO: legalAddress.blockName ?? null,
      CIDADE: legalAddress.cityName ?? null,
      UF: legalAddress.countrySubdivisionLevel1?.codeValue ?? null,
      CEP: legalAddress.postalCode ?? null,

      // Contato
      TELEFONE: mobile,
      EMAIL_PES: personalEmail,
      EMAIL_CORP: businessEmail,

      // Vínculo
      CARGO: assignment.jobTitle ?? null,
      CODCARGO: assignment.jobCode?.codeValue ?? null,
      DEPTO: homeOrg.shortName ?? null,
      CODDEPTO: homeOrg.codeValue ?? null,
      DTADM: formatDate(workerDates.originalHireDate),
      DTRETORNO: formatDate(workerDates.leaveOfAbsenceReturnDate),
      STATUS: workerStatus.statusCode?.shortName ?? null,

      // Controle de staging
      SITUACAO: 'P',
      DTATUALIZ: formatDateTime(),
      DTPROCESSADO: null,
    };
  } catch (err) {
    logger.error('MAPPER', `Erro ao mapear worker ${worker?.associateOID}: ${err.message}`, uuidRun);
    return null;
  }
};

export const mapWorkers = (workers, uuidRun) => {
  logger.info('MAPPER', `Mapeando ${workers.length} workers`, uuidRun);

  const mapped = workers
    .map((worker, index) => {
      const record = mapWorker(worker, uuidRun);
      if (!record) return null;
      return { ...record, SEQREG: index + 1 };
    })
    .filter(Boolean);

  logger.info('MAPPER', `Workers mapeados com sucesso: ${mapped.length}`, uuidRun);
  return mapped;
};

export const mapHistDeptos = (workers, uuidRun) => {
  logger.info('MAPPER', `Mapeando histórico de departamentos para ${workers.length} workers`, uuidRun);

  const mapped = workers.map((worker, index) => {
    try {
      const assignment = worker.workAssignments?.[0] ?? {};
      const homeOrg = assignment.homeOrganizationalUnits?.[0]?.nameCode ?? {};

      return {
        UUIDRUN: uuidRun,
        UUIDSO: worker.associateOID ?? null,
        SEQREG: index + 1,
        NUMEMP: null,
        TIPCOL: null,
        NUMCAD: null,
        DATALT: formatDate(assignment.actualStartDate),
        CODDEPTO: homeOrg.codeValue ?? null,
        NOMDEPTO: homeOrg.shortName ?? null,
        SITUACAO: 'P',
        DTATUALIZ: formatDateTime(),
        DTPROCESSADO: null,
      };
    } catch (err) {
      logger.error('MAPPER', `Erro ao mapear hist.depto worker ${worker?.associateOID}: ${err.message}`, uuidRun);
      return null;
    }
  }).filter(Boolean);

  logger.info('MAPPER', `Histórico de departamentos mapeado: ${mapped.length}`, uuidRun);
  return mapped;
};

export const mapHistCC = (workers, uuidRun) => {
  logger.info('MAPPER', `Mapeando histórico de CC para ${workers.length} workers`, uuidRun);

  const mapped = workers.map((worker, index) => {
    try {
      const assignment = worker.workAssignments?.[0] ?? {};
      const assignedOrg = assignment.assignedOrganizationalUnits?.[0]?.nameCode ?? {};

      return {
        UUIDRUN: uuidRun,
        UUIDSO: worker.associateOID ?? null,
        SEQREG: index + 1,
        NUMEMP: null,
        TIPCOL: null,
        NUMCAD: null,
        DATALT: formatDate(assignment.actualStartDate),
        CODCC: assignedOrg.codeValue ?? null,
        NOMCC: assignedOrg.shortName ?? null,
        SITUACAO: 'P',
        DTATUALIZ: formatDateTime(),
        DTPROCESSADO: null,
      };
    } catch (err) {
      logger.error('MAPPER', `Erro ao mapear hist.CC worker ${worker?.associateOID}: ${err.message}`, uuidRun);
      return null;
    }
  }).filter(Boolean);

  logger.info('MAPPER', `Histórico de CC mapeado: ${mapped.length}`, uuidRun);
  return mapped;
};