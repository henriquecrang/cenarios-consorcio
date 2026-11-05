const assert=require('node:assert/strict');
const {resolveEffectiveLance,resolveEffectiveBid,resolveCashbackBase,calculateCashback}=require('../model-core.js');

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

// Modalidades usam bases diferentes.
{
  const livre=resolveEffectiveBid(400000,495330,'free',0.45,0.30,0.30);
  close(livre.base,495330);
  close(livre.effectiveTotal,222898.50);
  close(livre.embedded,120000);
  close(livre.cash,102898.50);

  const fixo=resolveEffectiveBid(400000,495330,'fixed',0.70,0.30,0.30);
  close(fixo.base,400000);
  close(fixo.effectiveTotal,120000);
  close(fixo.embedded,120000);
  close(fixo.cash,0);
  assert.equal(fixo.mode,'fixed');
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

// Base conservadora: rendimentos acumulados não aumentam o cashback.
{
  close(resolveCashbackBase(1000000,1012017.72,959000,'principal'),959000);
  close(calculateCashback(resolveCashbackBase(1000000,1012017.72,959000,'principal'),0.10),95900);
}

// Sensibilidade explícita: incluir todo crédito usado, inclusive rendimentos.
{
  close(resolveCashbackBase(1000000,1012017.72,959000,'available'),1000000);
  close(calculateCashback(resolveCashbackBase(1000000,1012017.72,959000,'available'),0.10),100000);
}


// Guardrails básicos.
{
  close(calculateCashback(-100,0.10),0);
  close(calculateCashback(959000,-0.10),0);
}

console.log('model-core regression tests: ok');


 // #26 — políticas contratuais (sem alterar a compatibilidade da modalidade Bamaq).
 {
   const fees={fixedBase:'credit_plus_fees',freeBase:'outstanding',feeRatio:0.25,maxEmbeddedPct:0.20,allowFixedEmbedded:false,strict:true};
   const fixed=resolveEffectiveBid(400000,500000,'fixed',0.70,0.20,0,fees);
   close(fixed.base,500000);
   close(fixed.effectiveTotal,100000);
   close(fixed.cash,100000);
   assert.throws(()=>resolveEffectiveBid(400000,500000,'fixed',0.70,0.20,0.10,fees),/não admite/);
   assert.throws(()=>resolveEffectiveBid(400000,500000,'free',0.25,0.20,0.30,fees),/excede/);
   const twenty=resolveEffectiveBid(400000,500000,'free',0.25,0.20,0.20,fees);
   close(twenty.embedded,80000);
   close(twenty.cash,45000);
   const legacy=resolveEffectiveBid(400000,500000,'fixed',0.70,0.30,0.30);
   close(legacy.base,400000);close(legacy.embedded,120000);
 }
