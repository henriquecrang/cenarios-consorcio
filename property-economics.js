(function(root,factory){
  const api=factory();
  if(typeof module==='object' && module.exports) module.exports=api;
  root.ConsorcioProperty=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  // Adaptador de domínio imóvel: não incorpora políticas do consórcio.
  // Nenhum fluxo abaixo deve ser usado para veículo/serviço sem novo adaptador.
  function propertyPurchaseCosts({price,availableCredit,principalCredit,itbi,rgi,outros,
    residualCreditPolicy='unallocated',residualExpenseCapPct=0.10}){
    const complement=Math.max(0,price-availableCredit);
    const residualGross=Math.max(0,availableCredit-price);
    const purchaseCostsGross=price*itbi+rgi+outros;
    const cap=Math.max(0,principalCredit*residualExpenseCapPct);
    const residualAppliedToCosts=residualCreditPolicy==='costs'
      ? Math.min(residualGross,purchaseCostsGross,cap):0;
    const residualUnallocated=Math.max(0,residualGross-residualAppliedToCosts);
    const purchaseCostsOutOfPocket=Math.max(0,purchaseCostsGross-residualAppliedToCosts);
    return {complement,residualGross,purchaseCostsGross,residualAppliedToCosts,
      residualUnallocated,purchaseCostsOutOfPocket};
  }
  function monthlyPropertyNetRent({rent,vacancy,adminRent,maintenance,rentTax,fixedOwner}){
    const received=rent*(1-vacancy);
    const variableCosts=received*(adminRent+maintenance);
    const beforeTax=received-variableCosts-fixedOwner;
    const tax=Math.max(0,beforeTax)*rentTax;
    return {received,variableCosts,beforeTax,tax,netRent:beforeTax-tax};
  }
  function propertyRealization({marketValue,priceAtPurchase,purchaseCostsGross,
    brokeragePct,otherCosts,capitalGainTaxPct}){
    const brokerage=marketValue*brokeragePct;
    const simplifiedTaxBasis=priceAtPurchase+purchaseCostsGross;
    const taxableGain=Math.max(0,marketValue-simplifiedTaxBasis);
    const tax=taxableGain*capitalGainTaxPct;
    return {brokerage,otherCosts,tax,taxableGain,
      totalCosts:brokerage+otherCosts+tax,
      net:Math.max(0,marketValue-brokerage-otherCosts-tax)};
  }
  function propertySale({marketValue,purchasePrice,baseMode='market',pctOfBase=1,
    purchaseCostsGross=0,brokeragePct=0,otherCosts=0,capitalGainTaxPct=0,guaranteeCost=0}){
    const base=baseMode==='market'?marketValue:purchasePrice;
    const salePrice=base*pctOfBase;
    const realization=propertyRealization({
      marketValue:salePrice,priceAtPurchase:purchasePrice,purchaseCostsGross,
      brokeragePct,otherCosts:otherCosts+guaranteeCost,capitalGainTaxPct
    });
    return {salePrice,brokerage:realization.brokerage,tax:realization.tax,
      otherCosts:otherCosts+guaranteeCost,guaranteeCost,
      totalCosts:realization.totalCosts};
  }
  return {propertyPurchaseCosts,monthlyPropertyNetRent,propertyRealization,propertySale};
});
