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

  // Políticas de lance por grupo. Sem policy preserva integralmente a regra Bamaq V3.21.
  function resolveEffectiveBid(credit,outstanding,mode='free',lancePct=0,fixedPct=0.30,embPct=0,policy=null){
    const safeMode=mode==='fixed' ? 'fixed' : 'free';
    const p=policy || {};
    const safeCredit=Math.max(0,Number(credit)||0);
    const safeOutstanding=Math.max(0,Number(outstanding)||0);
    const baseFor=kind=>{
      if(kind==='credit') return safeCredit;
      if(kind==='outstanding') return safeOutstanding;
      if(kind==='credit_plus_fees') return safeCredit*(1+Math.max(0,Number(p.feeRatio)||0));
      throw new Error('Base de lance não suportada: '+kind);
    };
    const base=safeMode==='fixed'
      ? baseFor(p.fixedBase||'credit')
      : baseFor(p.freeBase||'outstanding');
    const requestedPct=safeMode==='fixed' ? Number(fixedPct)||0 : Number(lancePct)||0;
    if(p.strict && (requestedPct<0 || requestedPct>1)) throw new Error('Lance percentual fora de 0–100%');
    const pct=clamp(requestedPct,0,1);
    const requestedEmbeddedPct=Number(embPct)||0;
    const cap=p.maxEmbeddedPct===undefined ? 0.30 : Math.min(1,Math.max(0,Number(p.maxEmbeddedPct)||0));
    if(p.strict && (requestedEmbeddedPct<0 || requestedEmbeddedPct>cap+1e-12)){
      throw new Error('Lance embutido excede o limite do contrato ('+(cap*100)+'%)');
    }
    if(p.strict && safeMode==='fixed' && p.allowFixedEmbedded===false && requestedEmbeddedPct>0){
      throw new Error('O regulamento deste grupo não admite lance embutido na modalidade Fixo');
    }
    const safeEmbeddedPct=clamp(requestedEmbeddedPct,0,cap);
    const requestedTotal=base*pct;
    const effectiveTotal=Math.min(requestedTotal,safeOutstanding);
    const requestedEmbedded=safeCredit*safeEmbeddedPct;
    const embedded=(safeMode==='fixed' && p.allowFixedEmbedded===false)
      ? 0
      : Math.min(requestedEmbedded,effectiveTotal);
    const cash=Math.max(0,effectiveTotal-embedded);
    return {
      mode:safeMode,base,requestedTotal,effectiveTotal,requestedEmbedded,embedded,cash,
      limitedByOutstanding:effectiveTotal+0.005<requestedTotal,
      embeddedLimitedByTotal:embedded+0.005<requestedEmbedded,
      embeddedCap:cap
    };
  }

  function resolveCashbackBase(price,availableCredit,principalCredit,policy='principal'){
    const safePrice=Math.max(0,Number(price)||0);
    const safeAvailable=Math.max(0,Number(availableCredit)||0);
    const safePrincipal=Math.max(0,Number(principalCredit)||0);
    const candidate=policy==='available' ? safeAvailable : safePrincipal;
    return Math.min(safePrice,safeAvailable,candidate);
  }

  function calculateCashback(creditUsed,cashbackPct){
    const safeCreditUsed=Math.max(0,Number(creditUsed)||0);
    const safeCashbackPct=Math.max(0,Number(cashbackPct)||0);
    return safeCreditUsed*safeCashbackPct;
  }

  return {
    resolveEffectiveLance,
    resolveEffectiveBid,
    resolveCashbackBase,
    calculateCashback
  };
});
