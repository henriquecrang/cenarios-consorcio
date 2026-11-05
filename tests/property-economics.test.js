const assert=require('node:assert/strict');
const {propertyPurchaseCosts,monthlyPropertyNetRent,propertyRealization,propertySale}=require('../property-economics.js');
const close=(x,y)=>assert.ok(Math.abs(x-y)<0.005,`Esperado ${y}; recebido ${x}`);
// Custos da compra: residual não vira dinheiro livre nem é usado duas vezes.
{
  const p=propertyPurchaseCosts({price:900000,availableCredit:1000000,principalCredit:1000000,
    itbi:0.03,rgi:6000,outros:2000,residualCreditPolicy:'unallocated'});
  close(p.complement,0);close(p.residualGross,100000);close(p.purchaseCostsGross,35000);
  close(p.residualAppliedToCosts,0);close(p.residualUnallocated,100000);
  const costs=propertyPurchaseCosts({price:900000,availableCredit:1000000,principalCredit:1000000,
    itbi:0.03,rgi:6000,outros:2000,residualCreditPolicy:'costs',residualExpenseCapPct:0.10});
  close(costs.residualAppliedToCosts,35000);close(costs.residualUnallocated,65000);
  close(costs.purchaseCostsOutOfPocket,0);
}
{
  const r=monthlyPropertyNetRent({rent:5000,vacancy:0.10,adminRent:0.08,
    maintenance:0.05,rentTax:0.275,fixedOwner:300});
  close(r.received,4500);close(r.variableCosts,585);
  close(r.beforeTax,3615);close(r.tax,994.125);close(r.netRent,2620.875);
}
{
  const r=propertyRealization({marketValue:1200000,priceAtPurchase:1000000,
    purchaseCostsGross:50000,brokeragePct:0.05,otherCosts:10000,capitalGainTaxPct:0.15});
  close(r.brokerage,60000);close(r.tax,22500);close(r.net,1107500);
  const s=propertySale({marketValue:1200000,purchasePrice:1000000,baseMode:'market',
    pctOfBase:1,purchaseCostsGross:50000,brokeragePct:0.05,
    otherCosts:10000,capitalGainTaxPct:0.15,guaranteeCost:2500});
  close(s.salePrice,1200000);close(s.guaranteeCost,2500);close(s.totalCosts,95000);
}
console.log('property-economics regression tests: ok');
