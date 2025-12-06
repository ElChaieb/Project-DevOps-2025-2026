import http from 'http';

const TEST_URL = process.env.TEST_URL || 'http://localhost:3000';
const TIMEOUT = 10000;

console.log('🔥 Démarrage des Smoke Tests...');
console.log(`URL de test: ${TEST_URL}\n`);

console.log('📋 Exécution des tests...\n');

const req = http.get(TEST_URL, (res) => {
  console.log('\n' + '='.repeat(50));
  console.log('📊 Résultats des Smoke Tests:');
  console.log('='.repeat(50));
  
  if (res.statusCode === 200) {
    console.log(`   ✅ Réussis: 1`);
    console.log(`   ❌ Échoués: 0`);
    console.log(`   📝 Total:   1`);
    console.log('='.repeat(50) + '\n');
    console.log('✅ TOUS LES SMOKE TESTS ONT RÉUSSI\n');
    process.exit(0);
  } else {
    console.log(`   ✅ Réussis: 0`);
    console.log(`   ❌ Échoués: 1`);
    console.log(`   📝 Total:   1`);
    console.log('='.repeat(50) + '\n');
    console.log(`❌ LES SMOKE TESTS ONT ÉCHOUÉ\n`);
    console.log(`Status reçu: ${res.statusCode} (attendu: 200)\n`);
    process.exit(1);
  }
});

req.on('error', (err) => {
  console.log('\n' + '='.repeat(50));
  console.log('📊 Résultats des Smoke Tests:');
  console.log('='.repeat(50));
  console.log(`   ✅ Réussis: 0`);
  console.log(`   ❌ Échoués: 1`);
  console.log(`   📝 Total:   1`);
  console.log('='.repeat(50) + '\n');
  console.log('❌ LES SMOKE TESTS ONT ÉCHOUÉ\n');
  console.log(`Erreur de connexion: ${err.message}\n`);
  process.exit(1);
});

req.setTimeout(TIMEOUT, () => {
  req.destroy();
  console.log('\n' + '='.repeat(50));
  console.log('📊 Résultats des Smoke Tests:');
  console.log('='.repeat(50));
  console.log(`   ✅ Réussis: 0`);
  console.log(`   ❌ Échoués: 1`);
  console.log(`   📝 Total:   1`);
  console.log('='.repeat(50) + '\n');
  console.log('❌ LES SMOKE TESTS ONT ÉCHOUÉ\n');
  console.log(`Timeout après ${TIMEOUT}ms\n`);
  process.exit(1);
});