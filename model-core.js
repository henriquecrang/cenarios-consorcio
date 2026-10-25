(function(root,factory){
  const api=factory();
  if(typeof module==='object' && module.exports) module.exports=api;
  root.ConsorcioModel=api;
})(typeof globalThis!=='undefined' ? globalThis : this,function(){
  function clamp(value,min,max){
    return Math.max(min,Math.min(max,value));
  }

  function resolveEffectiveLance(credit,outstanding,lancePct,embPct){
    const safeLancePct=clamp(Number(lancePct)||0,0,1);
    const safeEmbPct=clamp(Number(embPct)||0,0,0.30);
    const safeOutstanding=Math.max(0,Number(outstanding)||0);
    const safeCredit=Math.max(0,Number(credit)||0);

    const requestedTotal=safeOutstanding*safeLancePct;
    const effectiveTotal=Math.min(requestedTotal,safeOutstanding);

    const requestedEmbedded=safeCredit*safeEmbPct;
    const embedded=Math.min(requestedEmbedded,effectiveTotal);
    const cash=Math.max(0,effectiveTotal-embedded);

    return {
      requestedTotal,
      effectiveTotal,
      requestedEmbedded,
      embedded,
      cash,
      limitedByOutstanding: effectiveTotal+0.005<requestedTotal,
      embeddedLimitedByTotal: embedded+0.005<requestedEmbedded
    };
  }

  function calculateCashback(creditUsed,cashbackPct){
    const safeCreditUsed=Math.max(0,Number(creditUsed)||0);
    const safeCashbackPct=Math.max(0,Number(cashbackPct)||0);
    return safeCreditUsed*safeCashbackPct;
  }

  return {
    resolveEffectiveLance,
    calculateCashback
  };
});
