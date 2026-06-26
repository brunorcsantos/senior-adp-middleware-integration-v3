import { fetchAllWorkers } from './adpWorkers.js';

try {
  const workers = await fetchAllWorkers('uuid-test-workers');
  console.log(`\nTotal de workers recebidos: ${workers.length}`);
  if (workers.length > 0) {
    console.log('Primeiro worker:', JSON.stringify(workers[0], null, 2));
  }
} catch (err) {
  console.log(`\nErro esperado sem credenciais reais: ${err.message}`);
}