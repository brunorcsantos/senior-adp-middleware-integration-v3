import { logger } from '../utils/logger.js';

const findAuxField = (auxFields = [], shortName) => {
  return auxFields.find(f => f.nameCode?.shortName === shortName)?.stringValue ?? null;
};

const formatDateTime = (date = new Date()) => {
  return date.toISOString().replace('T', ' ').substring(0, 19);
};

export const mapDepartment = (department, uuidRun) => {
  try {
    const location = department.assignedLocation ?? {};
    const auxFields = department.auxilliaryFields ?? [];

    return {
      UUIDRUN: uuidRun,
      UUIDSO: department.itemID ?? null,

      // Dados do departamento
      CODDEP: department.departmentCode?.codeValue ?? null,
      NOMDEP: department.departmentCode?.shortName ?? null,
      DESCRICAO: department.departmentDescription ?? null,
      ATIVO: department.activeIndicator === true ? 'S' : 'N',

      // Centro de custo
      CODCC: findAuxField(auxFields, 'Accounting Interface Code'),
      CODCONTRAP: findAuxField(auxFields, 'Counterpart Code'),
      CODDIVCC: findAuxField(auxFields, 'Accounting Code Division'),

      // Localização
      CODLOCALIZ: location.nameCode?.codeValue ?? null,
      NOMLOCALIZ: location.nameCode?.shortName ?? null,
      CIDLOCALIZ: location.cityName ?? null,
      UFLOCALIZ: location.countrySubdivisionLevel1?.codeValue ?? null,
      CEPLOCALIZ: location.postalCode ?? null,

      // Controle de staging
      SITUACAO: 'P',
      DTATUALIZ: formatDateTime(),
      DTPROCESSADO: null,
    };
  } catch (err) {
    logger.error('MAPPER', `Erro ao mapear departamento ${department?.itemID}: ${err.message}`, uuidRun);
    return null;
  }
};

export const mapDepartments = (departments, uuidRun) => {
  logger.info('MAPPER', `Mapeando ${departments.length} departamentos`, uuidRun);

  const mapped = departments
    .map(dep => mapDepartment(dep, uuidRun))
    .filter(Boolean);

  logger.info('MAPPER', `Departamentos mapeados com sucesso: ${mapped.length}`, uuidRun);
  return mapped;
};