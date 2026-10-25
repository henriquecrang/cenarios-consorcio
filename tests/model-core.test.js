const assert=require('node:assert/strict');
const {resolveEffectiveLance,calculateCashback}=require('../model-core.js');

function close(actual,expected,tolerance=0.005){
  assert.ok(Math.abs(actual-expected)<=tolerance,`expected ${expected}, got ${actual}`);
}

// Caso reconciliado com a Bamaq: Livre sobre saldo, embutido sobre a carta.
{
  const r=resolveEffectiveLance(400000,495330,0.45,0.30);
  close(r.requestedTotal,222898.50);
  close(r.effectiveTotal,222898.50);
  close(r.requestedEmbedded,120000);
  close(r.embedded,120000);
  close(r.cash,102898.50);
  assert.equal(r.embeddedLimitedByTotal,false);
}

// O embutido nunca pode exceder o próprio lance total.
{
  const r=resolveEffectiveLance(400000,500000,0.10,0.30);
  close(r.effectiveTotal,50000);
  close(r.requestedEmbedded,120000);
  close(r.embedded,50000);
  close(r.cash,0);
  assert.equal(r.embeddedLimitedByTotal,true);
}

// Cashback multi-cota reconciliado: 10% sobre R$959 mil efetivamente faturados/liberados.
{
  close(calculateCashback(959000,0.10),95900);
}

// Guardrails básicos.
{
  close(calculateCashback(-100,0.10),0);
  close(calculateCashback(959000,-0.10),0);
}

console.log('model-core regression tests: ok');
