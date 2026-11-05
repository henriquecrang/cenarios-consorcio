(function(root,factory){
  const api=factory();
  if(typeof module==='object' && module.exports) module.exports=api;
  root.ConsorcioPolicies=api;
})(typeof globalThis!=='undefined' ? globalThis : this,function(){
  'use strict';
  const finite=(v,name)=>{ const n=Number(v); if(!Number.isFinite(n)) throw new Error(name+' deve ser numérico'); return n; };
  const boundedRate=(v,name)=>{ const n=finite(v,name); if(n<=-1) throw new Error(name+' não pode ser <= -100%'); return n; };

  // As séries são cenários exógenos informados pelo usuário, não consultas a índices.
  // annual_series: taxas anuais em ordem de ocorrência (ex.: "6;4;5" em porcentagem).
  // event_series: mês:taxa em porcentagem (ex.: "7:6;19:4;31:-1").
  function parseRateSeries(raw,mode){
    const str=String(raw??'').trim();
    if(!str) return [];
    const tokens=str.split(/[;,\n]+/).map(s=>s.trim());
    if(tokens.some(s=>!s)) throw new Error('Série possui valor vazio');
    if(mode==='annual_series'){
      return tokens.map((s,i)=>boundedRate(finite(s,'Reajuste '+(i+1))/100,'Reajuste '+(i+1)));
    }
    if(mode==='event_series' || mode==='monthly_series'){
      const seen=new Set();
      return tokens.map((s)=>{
        const m=/^(\d+)\s*:\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))$/.exec(s);
        if(!m) throw new Error('Use mês:percentual (ex.: 7:6;19:4)');
        const month=Number(m[1]);
        if(!Number.isInteger(month)||month<1||seen.has(month)) throw new Error('Meses devem ser únicos e positivos');
        seen.add(month);
        return {month,rate:boundedRate(Number(m[2])/100,'Taxa do mês '+month)};
      }).sort((a,b)=>a.month-b.month);
    }
    throw new Error('Modalidade de série desconhecida: '+mode);
  }
  function rateAtAdjustment(cfg,month){
    const mode=cfg.adjustmentMode||'fixed_annual';
    const first=Math.max(1,Math.round(Number(cfg.firstAdj)||12));
    let event=false,rate=0;
    if(mode==='fixed_annual'){
      event=month>=first && (month-first)%12===0;
      rate=Number(cfg.reaj)||0;
    }else if(mode==='annual_series'){
      event=month>=first && (month-first)%12===0;
      const idx=(month-first)/12;
      const raw=cfg.adjustmentSeries||[];
      const rates=Array.isArray(raw)?raw:parseRateSeries(raw,'annual_series');
      if(event && idx>=rates.length) throw new Error('Série anual não cobre o reajuste do mês '+month);
      rate=event?rates[idx]:0;
    }else if(mode==='event_series'){
      const raw=cfg.adjustmentSeries||[];
      const events=Array.isArray(raw)?raw:parseRateSeries(raw,'event_series');
      const item=events.find(x=>x.month===month);
      event=!!item;
      rate=item?item.rate:0;
    }else{
      throw new Error('Tipo de reajuste não suportado: '+mode);
    }
    if(!event) return {applies:false,rate:0};
    rate=boundedRate(rate,'Reajuste do mês '+month);
    if(cfg.adjustmentCap!==undefined && cfg.adjustmentCap!==null) rate=Math.min(rate,finite(cfg.adjustmentCap,'Teto de reajuste'));
    if(cfg.adjustmentFloor!==undefined && cfg.adjustmentFloor!==null) rate=Math.max(rate,finite(cfg.adjustmentFloor,'Piso de reajuste'));
    return {applies:true,rate:boundedRate(rate,'Reajuste limitado')};
  }

  function letterMonthlyRateAt(cfg,month){
    const mode=cfg.letterYieldMode||'cdi_pct';
    let annual;
    if(mode==='cdi_pct') annual=Math.max(0,Number(cfg.cdiAnnual)||0)*Math.max(0,Number(cfg.cartaPctCdi)||0);
    else if(mode==='fixed_net') annual=boundedRate(cfg.letterNetAnnual,'Taxa líquida anual da carta');
    else if(mode==='annual_net_series'){
      const series=cfg.letterAnnualRates||[];
      const rates=Array.isArray(series)?series:parseRateSeries(series,'annual_series');
      const index=Math.floor((month-1)/12);
      if(index>=rates.length) throw new Error('Série anual de rendimentos não cobre o mês '+month);
      annual=boundedRate(rates[index],'Rendimento líquido do ano '+(index+1));
    }
    else if(mode==='monthly_series'){
      const series=cfg.letterMonthlyRates||[];
      const rates=Array.isArray(series)?series:parseRateSeries(series,'annual_series');
      const index=month-1;
      if(index>=rates.length) throw new Error('Série mensal de rendimentos não cobre o mês '+month);
      const monthly=boundedRate(rates[index],'Retorno líquido mensal');
      return monthly;
    }else throw new Error('Tipo de rendimento não suportado: '+mode);
    return Math.pow(1+boundedRate(annual,'Taxa líquida anual da carta'),1/12)-1;
  }
  function parseMonthList(raw,maxMonth){
    const str=String(raw??'').trim();
    if(!str) return [];
    const numbers=str.split(/[;,\n]+/).map(v=>Number(v.trim()));
    const seen=new Set();
    numbers.forEach(m=>{
      if(!Number.isSafeInteger(m)||m<1||(Number.isInteger(maxMonth)&&m>maxMonth)||seen.has(m))
        throw new Error('Meses de solicitação devem ser únicos e dentro do prazo');
      seen.add(m);
    });
    return numbers.sort((a,b)=>a-b);
  }
  function canUseYieldForInstallment(cfg,month){
    const mode=cfg.yieldInstallmentMode||'legacy';
    if(mode==='legacy') return !!cfg.rendimentoPagaParcela;
    if(mode==='capitalize') return false;
    if(!['automatic','requested_months'].includes(mode)) throw new Error('Política de abatimento desconhecida: '+mode);
    if(cfg.yieldInstallmentApproved!==true)
      throw new Error('Abatimento de rendimentos exige autorização contratual explícita');
    if(mode==='automatic') return true;
    return (cfg.yieldRequestMonths||[]).includes(month);
  }
  function calculateTransferFee(quotas,policy,offer){
    const rows=Array.isArray(quotas)?quotas:[];
    const p=policy||{};
    const kind=p.kind||'outstanding_pct';
    const rate=Math.max(0,finite(p.rate??0,'Tarifa percentual'));
    const cap=Number(p.cap)>0?Number(p.cap):Infinity;
    const fixed=Math.max(0,finite(p.fixed??0,'Tarifa fixa'));
    const registration=Math.max(0,finite(p.registrationPerQuota??0,'Cadastro por cota'));
    if(!['outstanding_pct','credit_pct','fixed_per_quota','fixed_per_transfer','offer_pct'].includes(kind))
      throw new Error('Base de tarifa de transferência não suportada: '+kind);
    const n=rows.length||1;
    const fees=rows.map(q=>{
      let variable=0;
      if(kind==='outstanding_pct') variable=Math.max(0,Number(q.outstanding)||0)*rate;
      else if(kind==='credit_pct') variable=Math.max(0,Number(q.credit)||0)*rate;
      else if(kind==='offer_pct') variable=Math.max(0,Number(offer)||0)*rate/n;
      else if(kind==='fixed_per_quota') variable=fixed;
      else if(kind==='fixed_per_transfer') variable=fixed/n;
      // O teto é por cota para percentuais; tarifas fixas não são limitadas
      // por um teto percentual que não faça parte do contrato.
      const assessed=kind.endsWith('_pct')?Math.min(variable,cap):variable;
      return {id:q.id,fee:assessed+registration};
    });
    return {
      byQuota:Object.fromEntries(fees.map(f=>[f.id,f.fee])),
      total:fees.reduce((a,f)=>a+f.fee,0)
    };
  }
  return {parseRateSeries,rateAtAdjustment,letterMonthlyRateAt,parseMonthList,canUseYieldForInstallment,calculateTransferFee};
});
