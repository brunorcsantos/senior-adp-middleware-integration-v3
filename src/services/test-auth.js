import { getAdpToken } from './adpAuth.js';

// Teste 1: deve falhar com credenciais fictícias e logar o erro
try {
  await getAdpToken('uuid-test-001');
} catch (err) {
  console.log(`\nErro esperado com credenciais fictícias: ${err.message}`);
}

// Teste 2: cache — segunda chamada não deve tentar nova requisição
// (só atingível com token real; documenta o comportamento esperado)
console.log('\nTeste de cache: segunda chamada reutilizaria token se o primeiro tivesse sucesso.');