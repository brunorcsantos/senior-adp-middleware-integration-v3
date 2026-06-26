export const callOperation = async (operation, parameters, uuidRun = '-') => {
  const client = await getClient();
  const auth = buildAuth();

  const args = {
    ...auth,
    parameters,
  };

  logger.info('SOAP', `Chamando operação ${operation}`, uuidRun);

  try {
    const [result] = await client[`${operation}Async`](args);

    if (result?.result?.erroExecucao) {
      throw new Error(`Erro Senior [${operation}]: ${result.result.erroExecucao}`);
    }

    logger.info('SOAP', `Operação ${operation} concluída com sucesso`, uuidRun);
    return result?.result ?? null;

  } catch (err) {
    logger.error('SOAP', `Erro na operação ${operation}: ${err?.message}`, uuidRun);
    logger.error('SOAP', `Body do erro: ${JSON.stringify(err?.body ?? err?.cause ?? {})}`, uuidRun);
    throw err;
  }
};