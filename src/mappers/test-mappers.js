import { fetchAllWorkers } from '../services/adpWorkers.js';
import { fetchAllDepartments } from '../services/adpDepartments.js';
import { fetchAllLeaves } from '../services/adpLeaves.js';
import { mapDepartments } from './departmentMapper.js';
import { mapLeaves } from './leaveMapper.js';

const uuidRun = 'uuid-test-mappers';

// Teste departamentos
const departments = await fetchAllDepartments(uuidRun);
const mappedDeps = mapDepartments(departments, uuidRun);

console.log('\n--- Departamento mapeado (primeiro) ---');
process.stdout.write(JSON.stringify(mappedDeps[0], null, 2) + '\n');

// Teste afastamentos — apenas 3 workers para agilizar
const workers = await fetchAllWorkers(uuidRun);
const leaves = await fetchAllLeaves(workers.slice(0, 3), uuidRun);
const mappedLeaves = mapLeaves(leaves, uuidRun);

console.log('\n--- Afastamento mapeado (primeiro) ---');
process.stdout.write(JSON.stringify(mappedLeaves[0], null, 2) + '\n');

console.log(`\nTotais: ${mappedDeps.length} deptos | ${mappedLeaves.length} afastamentos`);