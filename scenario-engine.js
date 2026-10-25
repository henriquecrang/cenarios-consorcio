(function(root,factory){
  let core=root.ConsorcioModel;
  if(typeof module==='object' && module.exports) core=require('./model-core.js');
  const api=factory(core);
  if(typeof module==='object' && module.exports) module.exports=api;
  root.ConsorcioEngine=api;
})(typeof globalThis!=='undefined' ? globalThis : this,function(core){
  if(!core) throw new Error('ConsorcioModel is required before ConsorcioEngine');
  const {resolveEffectiveBid,resolveCashbackBase,calculateCashback}=core;
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const pct=x=>Number(x)/100;

function irrMonthly(cashFlows){
  // TIR mensal por bisseção em uma faixa numericamente estável.
  const flows=cashFlows.map(v=>Number.isFinite(v)?v:0);
  const hasNeg=flows.some(v=>v<0);
  const hasPos=flows.some(v=>v>0);
  if(!hasNeg || !hasPos) return null;

  const npv=r=>{
    if(r<=-1) return null;
    let factor=1;
    let s=0;
    for(let t=0;t<flows.length;t++){
      if(t>0) factor*=(1+r);
      if(!Number.isFinite(factor) || factor===0) return null;
      s += flows[t]/factor;
      if(!Number.isFinite(s)) return null;
    }
    return s;
  };

  let lo=-0.50, hi=1.0;
  let flo=npv(lo), fhi=npv(hi);
  if(flo===null || fhi===null) return null;

  let guard=0;
  while(flo*fhi>0 && guard<40){
    hi*=2;
    fhi=npv(hi);
    if(fhi===null) return null;
    guard++;
  }
  if(flo*fhi>0) return null;

  for(let i=0;i<160;i++){
    const mid=(lo+hi)/2;
    const fm=npv(mid);
    if(fm===null) return null;
    if(Math.abs(fm)<1e-8) return mid;
    if(flo*fm<=0){ hi=mid; fhi=fm; }
    else { lo=mid; flo=fm; }
  }
  return (lo+hi)/2;
}

function annualizeMonthlyRate(r){
  return r===null || !Number.isFinite(r) ? null : Math.pow(1+r,12)-1;
}

function runScenario(cfg,overrides={}){
  const N=cfg.N;
  const lancePct=clamp(overrides.lancePct ?? cfg.lancePct,0,1);
  const embPct=clamp(cfg.embMaxPct,0,0.30);

  const sourceCotas=(cfg.cotas && cfg.cotas.length ? cfg.cotas : [{id:'Única',credit0:cfg.credit0,cont:cfg.cont}]);
  const scenarioCotas=sourceCotas.map(c=>{
    const fallbackMode=(c.lanceMode || cfg.lanceMode || 'free')==='fixed' ? 'fixed' : 'free';
    const fallbackBidPct=fallbackMode==='fixed'
      ? (c.bidPct ?? c.fixedLancePct ?? cfg.fixedLancePct ?? 0.30)
      : (c.bidPct ?? c.freeLancePct ?? c.lancePct ?? lancePct);
    return {
    id:c.id,
    credit0:Math.max(0,c.credit0||0),
    cont:clamp(overrides.cont ?? c.cont,1,N),
    useInPurchase:c.useInPurchase!==false,
    lanceMode:fallbackMode,
    bidPct:clamp(Number(fallbackBidPct)||0,0,1),
    embPct:clamp(Number(c.embPct ?? c.embMaxPct ?? embPct)||0,0,0.30),
    loanTerms:{
      fundPct:clamp(c.loanTerms?.fundPct ?? cfg.emprestimoLancePct,0,1),
      rateMonthly:Math.max(0,c.loanTerms?.rateMonthly ?? cfg.emprestimoTaxaMes),
      trAnnual:Math.max(0,c.loanTerms?.trAnnual ?? cfg.emprestimoTrAnnual),
      term:Math.max(1,c.loanTerms?.term ?? cfg.emprestimoPrazo),
      system:(c.loanTerms?.system || cfg.emprestimoSistema)==='sac' ? 'sac' : 'price'
    }
  };
  });
  const firstCont=Math.min(...scenarioCotas.map(c=>c.cont));
  const cont=Math.max(...scenarioCotas.map(c=>c.cont)); // última contemplação de todas as cotas
  const purchaseScenarioCotas=scenarioCotas.filter(c=>c.useInPurchase);
  const purchaseReadyCont=purchaseScenarioCotas.length
    ? Math.max(...purchaseScenarioCotas.map(c=>c.cont))
    : N+1;

  const resgateAtivo=cfg.resgateAtivo;
  const buy=resgateAtivo || purchaseReadyCont>N
    ? N+1
    : Math.min(N+1,Math.max(purchaseReadyCont,cfg.buyRaw));
  const sellMonth=Math.min(N+1,Math.max(buy<=N?buy:N+1,cfg.sellMonth));

  const minRedeemForScenario=cont+6;
  const configuredRedeemMonth=Number.isFinite(cfg.redeemMonth) ? cfg.redeemMonth : N+1;
  const redeemMonth=resgateAtivo
    ? (minRedeemForScenario<=N
        ? Math.min(N,Math.max(minRedeemForScenario,configuredRedeemMonth))
        : N+1)
    : N+1;

  const quotaSale=overrides.quotaSale || null;
  const quotaSaleMonth=quotaSale ? Math.min(N,Math.max(cont,quotaSale.month)) : N+1;

  const cdbMonthly=Math.pow(1+cfg.cdbAnnual,1/12)-1;
  const inflationMonthly=Math.pow(1+cfg.inflationAnnual,1/12)-1;
  const cdiAnnual=Math.max(0,cfg.cdiAnnual||0);
  const cartaPctCdi=Math.max(0,cfg.cartaPctCdi||0);
  const cartaAnnual=cdiAnnual*cartaPctCdi;
  const cartaMonthly=Math.pow(1+cartaAnnual,1/12)-1;
  const loanTrAnnual=Math.max(0,cfg.emprestimoTrAnnual||0);
  const loanTrMonthly=Math.pow(1+loanTrAnnual,1/12)-1;

  let price=cfg.priceInput;
  let rgi=cfg.rgiInput;
  let rent0=cfg.rentInput;
  let fixedOwner=cfg.fixedOwnerInput;

  if(cfg.lockRent && !cfg.lockPropertyPrice) rent0=price*cfg.rentPctOfProperty;
  let currentRent=rent0;
  if(cfg.lockRgi && !cfg.lockPropertyPrice) rgi=price*cfg.rgiPctOfProperty;
  if(cfg.lockOwnerCosts) fixedOwner=currentRent*cfg.ownerCostsPctOfRent;

  const cotas=scenarioCotas.map(c=>{
    const outstanding=c.credit0*(1+cfg.adm+cfg.reserva);
    const fullInstall=outstanding/N;
    return {
      ...c,
      credit:c.credit0,
      outstanding,
      fullInstall,
      initialReduced:fullInstall*cfg.reduced,
      contemplated:false,
      usedInPurchase:false,
      letterBalance:0,
      letterPrincipalAtCont:0,
      postInstall:0,
      requestedLanceAtCont:0,
      effectiveLanceAtCont:0,
      requestedEmbeddedAtCont:0,
      embeddedLanceAtCont:0,
      cashLanceAtCont:0,
      lanceWasLimitedByOutstanding:false,
      embeddedWasLimitedByTotal:false,
      loanFundPct:c.loanTerms.fundPct,
      loanRateMonthly:c.loanTerms.rateMonthly,
      loanTrAnnual:c.loanTerms.trAnnual,
      loanTrMonthly:Math.pow(1+c.loanTerms.trAnnual,1/12)-1,
      loanTerm:c.loanTerms.term,
      loanSystem:c.loanTerms.system,
      loanReleaseMonth:null,
      loanPrincipal:0,
      loanBalance:0,
      loanInitialPayment:0,
      loanMonthsPaid:0,
      loanIndexFactor:1,
      totalLoanPayments:0,
      totalLoanInterest:0,
      totalLoanTrCorrection:0,
      ownCashLance:0,
      monthlyInstallment:0,
      monthlyLoanPayment:0,
      monthlyLetterYield:0,
      monthlyYieldUsedForInstallment:0,
      totalYieldUsedForInstallments:0,
      totalLetterYieldAccrued:0
    };
  });

  const sumQ=fn=>cotas.reduce((a,q)=>a+(fn(q)||0),0);
  const initialReduced=sumQ(q=>q.initialReduced);

  let purchased=false, redeemed=false, propertySold=false, quotaSold=false;
  let propertyValue=0;
  let residualCredit=0, residualGross=0, residualAppliedToCosts=0, residualUnallocated=0, residualComparableAsset=0;

  let propertySalePrice=0, propertySaleBrokerage=0, propertySaleTax=0, propertySaleOtherCosts=0;
  let propertySaleTotalCosts=0, propertySaleConsortiumPayoff=0, propertySaleLoanPayoff=0;
  let propertySaleNetCash=0, propertySaleTopUp=0;
  let finalPropertyMarketValue=0, finalPropertyNetRealization=0, finalPropertyExitCosts=0, finalPropertyExitTax=0;

  let redeemCredit=0, redeemConsortiumPayoff=0, redeemLanceLoanPayoff=0;
  let redeemBridgeCost=0, redeemTaxCost=0, redeemNetCash=0, redeemTopUp=0;
  let redeemAportesAte=0, redeemNetPosition=0;

  let quotaSaleCredit=0, quotaSaleDebt=0, quotaSaleLoan=0;
  let quotaSaleDebtByQuota={}, quotaSaleTransferFeeByQuota={};
  let quotaSaleTransferFee=0, quotaSaleExtraCost=0, quotaSaleNetCash=0, quotaSaleTopUp=0;

  let totalYieldUsedForInstallments=0;
  let totalLetterYieldAccrued=0;
  let firstYieldUsedForInstallment=0;
  let firstGrossLetterYield=0;

  let cdbBal=0, strategyCash=0, cumulativeExternal=0, totalNetRent=0;
  let realContributionsToday=0;
  const externalCashFlowsReal=[0];

  let postInstall=0, creditAtBuy=0, principalCreditAtBuy=0, complement=0;
  let purchaseCostsGross=0, purchaseCostsOutOfPocket=0;
  let cashbackEligibleBase=0, purchaseCashback=0, purchaseCashbackReceiptMonth=N+1, purchaseTransactionNet=0;
  let initialNetRent=0, initialPostCashFlow=0;
  let finalSettlement=0;
  let firstFullConsortiumPayment=0, firstFullLoanPayment=0, firstFullNetRent=0;
  let firstPostContConsortiumPayment=0, firstPostContLoanPayment=0;
  let firstPostContGrossConsortiumPayment=0, firstPostContYieldUsed=0;

  let cashLanceTotal=0;
  let requestedLanceAtCont=0, effectiveLanceAtCont=0, lanceWasLimitedByOutstanding=false;
  let loanPrincipal=0, loanInitialPayment=0;
  let totalLoanPayments=0, totalLoanInterest=0, totalLoanTrCorrection=0, earlyLoanPayoff=0, ownCashLance=0;

  let totalInsurancePayments=0;
  let firstInsurancePayment=null;
  let firstPostContInsurancePayment=0;
  let firstFullInsurancePayment=0;

  let priceAtPurchase=null, rentAtPurchase=null, rgiAtPurchase=null, fixedOwnerAtPurchase=null;
  let lastFixedOwner=fixedOwner;

  const hist=[];
  const isAdjMonth=m => m>=cfg.firstAdj && (m-cfg.firstAdj)%12===0;
  const isPropertyAnniversary=m => purchased && !propertySold && m>buy && (m-buy)%12===0;

  for(let m=1;m<=N;m++){
    if(isPropertyAnniversary(m)){
      propertyValue *= (1+cfg.propAdj);
      currentRent *= (1+cfg.rentAdj);
      if(cfg.lockOwnerCosts){
        fixedOwner=currentRent*cfg.ownerCostsPctOfRent;
        lastFixedOwner=fixedOwner;
      }
    }

    // Reajuste individual por cota.
    cotas.forEach(q=>{
      q.deferSameMonthAdjustment = isAdjMonth(m) && m===q.cont && !cfg.adjustmentBeforeContemplation && !q.contemplated && !quotaSold;
      if(isAdjMonth(m) && !quotaSold && !redeemed && !q.deferSameMonthAdjustment){
        q.credit *= (1+cfg.reaj);
        q.outstanding *= (1+cfg.reaj);
        const rem=N-m+1;
        if(!q.contemplated) q.fullInstall *= (1+cfg.reaj);
        else q.fullInstall = rem>0 ? q.outstanding/rem : q.outstanding;
      }
    });

    let installment=0;
    let outstandingBeforeInstallment=0;
    cotas.forEach(q=>{
      outstandingBeforeInstallment += q.outstanding;
      q.monthlyInstallment=(redeemed || quotaSold) ? 0 : (q.contemplated ? q.fullInstall : q.fullInstall*cfg.reduced);
      q.outstanding=Math.max(0,q.outstanding-q.monthlyInstallment);
      installment += q.monthlyInstallment;
    });

    let cashObrigacoes=installment;
    let rendaEstrategia=0;
    let currentLoanPayment=0;
    let currentInsurancePayment=0;

    // P0 V2.60 — cada contemplação cria uma tranche independente. Não há juros
    // antes da liberação; cada tranche usa seus próprios taxa/TR/prazo/sistema.
    cotas.forEach(q=>{
      q.monthlyLoanPayment=0;
      if(q.loanBalance>0 && m>q.cont && q.loanMonthsPaid<q.loanTerm){
        let loanPayment=0;
        let loanInterestThisMonth=0;

        if(q.loanTrMonthly>0){
          const trCorrectionThisMonth=q.loanBalance*q.loanTrMonthly;
          q.loanBalance += trCorrectionThisMonth;
          q.loanIndexFactor *= (1+q.loanTrMonthly);
          q.totalLoanTrCorrection += trCorrectionThisMonth;
          totalLoanTrCorrection += trCorrectionThisMonth;
        }

        if(q.loanSystem==='sac'){
          const amortBase=q.loanPrincipal/q.loanTerm;
          const amortTarget=q.loanTrMonthly>0 ? amortBase*q.loanIndexFactor : amortBase;
          const interest=q.loanBalance*q.loanRateMonthly;
          loanInterestThisMonth=interest;
          const amort=Math.min(q.loanBalance,amortTarget);
          loanPayment=amort+interest;
          q.loanBalance=Math.max(0,q.loanBalance-amort);
        }else{
          const remLoan=q.loanTerm-q.loanMonthsPaid;
          let scheduled;
          if(q.loanTrMonthly>0){
            const baseScheduled=q.loanRateMonthly===0
              ? q.loanPrincipal/q.loanTerm
              : q.loanPrincipal*q.loanRateMonthly/(1-Math.pow(1+q.loanRateMonthly,-q.loanTerm));
            scheduled=baseScheduled*q.loanIndexFactor;
          }else{
            scheduled=q.loanRateMonthly===0
              ? q.loanBalance/remLoan
              : q.loanPrincipal*q.loanRateMonthly/(1-Math.pow(1+q.loanRateMonthly,-q.loanTerm));
          }
          const interest=q.loanBalance*q.loanRateMonthly;
          loanInterestThisMonth=interest;
          const amort=Math.max(0,scheduled-interest);
          loanPayment=Math.min(q.loanBalance+interest,scheduled);
          q.loanBalance=Math.max(0,q.loanBalance-amort);
        }

        q.loanMonthsPaid++;
        q.monthlyLoanPayment=loanPayment;
        q.totalLoanPayments += loanPayment;
        q.totalLoanInterest += loanInterestThisMonth;
        totalLoanPayments += loanPayment;
        totalLoanInterest += loanInterestThisMonth;
        currentLoanPayment += loanPayment;
        cashObrigacoes += loanPayment;
      }
    });

    // Seguro permanece agregado nesta branch para isolar o P0 multi-cota.
    if(cfg.seguroAtivo && !redeemed && !quotaSold && outstandingBeforeInstallment>0){
      if(cfg.seguroBase==='installment') currentInsurancePayment=installment*pct(cfg.seguroValorRaw);
      else if(cfg.seguroBase==='balance') currentInsurancePayment=outstandingBeforeInstallment*pct(cfg.seguroValorRaw);
      else currentInsurancePayment=cfg.seguroValorRaw;

      currentInsurancePayment=Math.max(0,currentInsurancePayment);
      cashObrigacoes += currentInsurancePayment;
      totalInsurancePayments += currentInsurancePayment;
      if(firstInsurancePayment===null) firstInsurancePayment=currentInsurancePayment;
      if(m===cont+1) firstPostContInsurancePayment=currentInsurancePayment;
      if(m===buy+1) firstFullInsurancePayment=currentInsurancePayment;
    }

    if(m===cont+1){
      firstPostContGrossConsortiumPayment=installment;
      firstPostContConsortiumPayment=installment;
      firstPostContLoanPayment=currentLoanPayment;
    }

    // Contemplações independentes.
    cotas.forEach(q=>{
      if(m===q.cont && !quotaSold && !redeemed && !q.contemplated){
        q.contemplated=true;
        const lance=resolveEffectiveBid(
          q.credit,
          q.outstanding,
          q.lanceMode,
          q.lanceMode==='free' ? q.bidPct : 0,
          q.lanceMode==='fixed' ? q.bidPct : (cfg.fixedLancePct??0.30),
          q.embPct
        );
        q.requestedLanceAtCont=lance.requestedTotal;
        q.effectiveLanceAtCont=lance.effectiveTotal;
        q.requestedEmbeddedAtCont=lance.requestedEmbedded;
        q.embeddedLanceAtCont=lance.embedded;
        q.cashLanceAtCont=lance.cash;
        q.lanceWasLimitedByOutstanding=lance.limitedByOutstanding;
        q.embeddedWasLimitedByTotal=lance.embeddedLimitedByTotal;

        requestedLanceAtCont += lance.requestedTotal;
        effectiveLanceAtCont += lance.effectiveTotal;
        cashLanceTotal += lance.cash;
        lanceWasLimitedByOutstanding = lanceWasLimitedByOutstanding || lance.limitedByOutstanding;

        q.loanPrincipal=cfg.usarEmprestimoLance ? lance.cash*q.loanFundPct : 0;
        q.loanReleaseMonth=q.loanPrincipal>0 ? m : null;
        q.loanBalance=q.loanPrincipal;
        q.ownCashLance=Math.max(0,lance.cash-q.loanPrincipal);
        loanPrincipal += q.loanPrincipal;
        ownCashLance += q.ownCashLance;
        cashObrigacoes += q.ownCashLance;

        if(q.loanPrincipal>0){
          const firstTrFactor=1+q.loanTrMonthly;
          const firstCorrectedBalance=q.loanPrincipal*firstTrFactor;
          if(q.loanSystem==='sac'){
            const firstAmort=(q.loanPrincipal/q.loanTerm)*firstTrFactor;
            q.loanInitialPayment=firstAmort + firstCorrectedBalance*q.loanRateMonthly;
          }else{
            const basePayment=q.loanRateMonthly===0
              ? q.loanPrincipal/q.loanTerm
              : q.loanPrincipal*q.loanRateMonthly/(1-Math.pow(1+q.loanRateMonthly,-q.loanTerm));
            q.loanInitialPayment=basePayment*firstTrFactor;
          }
          loanInitialPayment += q.loanInitialPayment;
        }

        q.outstanding=Math.max(0,q.outstanding-lance.effectiveTotal);
        q.letterBalance=Math.max(0,q.credit-lance.embedded);
        q.letterPrincipalAtCont=q.letterBalance;
        const rem=N-m;
        q.fullInstall=rem>0 ? q.outstanding/rem : 0;
        q.postInstall=q.fullInstall;

        if(q.deferSameMonthAdjustment){
          q.outstanding *= (1+cfg.reaj);
          q.fullInstall=rem>0 ? q.outstanding/rem : q.outstanding;
          q.postInstall=q.fullInstall;
        }
      }
    });

    postInstall=sumQ(q=>q.postInstall);

    let monthlyLetterYieldThisMonth=0;
    const yieldEntries=[];
    cotas.forEach(q=>{
      q.monthlyLetterYield=0;
      q.monthlyYieldUsedForInstallment=0;
      if(q.contemplated && !q.usedInPurchase && !redeemed && !quotaSold && m>q.cont){
        const y=q.letterBalance*cartaMonthly;
        q.monthlyLetterYield=y;
        q.totalLetterYieldAccrued += y;
        monthlyLetterYieldThisMonth += y;
        totalLetterYieldAccrued += y;
        yieldEntries.push({q,y});
      }
    });

    if(m===cont+1) firstGrossLetterYield=monthlyLetterYieldThisMonth;

    if(monthlyLetterYieldThisMonth>0){
      if(cfg.rendimentoPagaParcela){
        // P0 V2.59 mantido na V2.60 — sem pooling: cada cota usa somente o próprio rendimento
        // para abater a própria parcela. Excedente permanece na própria carta.
        let yieldUsedThisMonth=0;
        yieldEntries.forEach(({q,y})=>{
          const used=Math.min(y,q.monthlyInstallment);
          q.monthlyYieldUsedForInstallment=used;
          q.totalYieldUsedForInstallments += used;
          yieldUsedThisMonth += used;
          q.letterBalance += Math.max(0,y-used);
        });
        cashObrigacoes=Math.max(0,cashObrigacoes-yieldUsedThisMonth);
        totalYieldUsedForInstallments += yieldUsedThisMonth;

        if(m===cont+1){
          firstYieldUsedForInstallment=yieldUsedThisMonth;
          firstPostContYieldUsed=yieldUsedThisMonth;
          firstPostContConsortiumPayment=Math.max(0,installment-yieldUsedThisMonth);
        }
      }else{
        yieldEntries.forEach(({q,y})=>{q.letterBalance += y;});
      }
    }

    let purchaseCashbackThisMonth=0;
    let redeemCashThisMonth=0;
    let propertySaleCashThisMonth=0;
    let quotaSaleCashThisMonth=0;

    if(cfg.resgateAtivo && !purchased && !redeemed && !quotaSold && redeemMonth<=N && m===redeemMonth){
      redeemCredit=sumQ(q=>q.letterBalance);
      redeemConsortiumPayoff=sumQ(q=>q.outstanding);
      if(cfg.resgateComPonte){
        const bridgeInterestRate=Math.pow(1+cfg.ponteTaxaMes,cfg.ponteDias/30)-1;
        const bridgeInterest=redeemConsortiumPayoff*bridgeInterestRate;
        const bridgeIof=redeemConsortiumPayoff*(cfg.ponteIofFixo+cfg.ponteIofDia*cfg.ponteDias);
        redeemBridgeCost=bridgeInterest+bridgeIof;
      }else redeemBridgeCost=0;

      redeemLanceLoanPayoff=cfg.quitarEmpLanceNoResgate ? sumQ(q=>q.loanBalance) : 0;
      const accumulatedFinancialReturn=Math.max(0,totalLetterYieldAccrued);
      redeemTaxCost=accumulatedFinancialReturn*cfg.irResgatePct;
      redeemNetPosition=redeemCredit-redeemConsortiumPayoff-redeemBridgeCost-redeemTaxCost-redeemLanceLoanPayoff;

      let liquid=redeemNetPosition;
      if(liquid<0){
        redeemTopUp=-liquid;
        cashObrigacoes += redeemTopUp;
        liquid=0;
      }else redeemTopUp=0;

      redeemNetCash=liquid;
      redeemAportesAte=cumulativeExternal+Math.max(0,cashObrigacoes-rendaEstrategia);
      redeemCashThisMonth=redeemNetCash;

      cotas.forEach(q=>{
        q.outstanding=0; q.fullInstall=0; q.letterBalance=0;
        if(cfg.quitarEmpLanceNoResgate && q.loanBalance>0){
          earlyLoanPayoff += q.loanBalance;
          q.totalLoanPayments += q.loanBalance;
          totalLoanPayments += q.loanBalance;
          q.loanBalance=0;
          q.loanMonthsPaid=q.loanTerm;
        }
      });
      redeemed=true;
    }

    if(buy<=N && m===buy && !redeemed && !quotaSold){
      purchased=true;
      const purchaseCotas=cotas.filter(q=>q.useInPurchase);
      creditAtBuy=purchaseCotas.reduce((a,q)=>a+q.letterBalance,0);
      principalCreditAtBuy=purchaseCotas.reduce((a,q)=>a+q.letterPrincipalAtCont,0);

      if(cfg.lockPropertyPrice) price=creditAtBuy;
      if(cfg.lockRent){rent0=price*cfg.rentPctOfProperty;currentRent=rent0;}
      if(cfg.lockRgi) rgi=price*cfg.rgiPctOfProperty;
      if(cfg.lockOwnerCosts){fixedOwner=currentRent*cfg.ownerCostsPctOfRent;lastFixedOwner=fixedOwner;}

      priceAtPurchase=price;
      rentAtPurchase=currentRent;
      rgiAtPurchase=rgi;
      fixedOwnerAtPurchase=fixedOwner;

      const creditUsed=Math.min(price,creditAtBuy);
      residualGross=Math.max(0,creditAtBuy-price);
      complement=Math.max(0,price-creditAtBuy);

      purchaseCostsGross=price*cfg.itbi+rgi+cfg.outros;
      residualAppliedToCosts=0;
      residualUnallocated=residualGross;
      residualComparableAsset=0;

      if(cfg.residualCreditPolicy==='costs' && residualGross>0){
        const residualCostCap=Math.max(0,principalCreditAtBuy*(cfg.residualExpenseCapPct ?? 0.10));
        residualAppliedToCosts=Math.min(residualGross,purchaseCostsGross,residualCostCap);
        residualUnallocated=Math.max(0,residualGross-residualAppliedToCosts);
      }

      // Compatibilidade de output: residualCredit representa o valor ainda sem
      // destinação após aplicações explícitas. Ele NÃO é automaticamente ativo
      // comparável; residualComparableAsset controla o reconhecimento patrimonial.
      residualCredit=residualUnallocated;
      purchaseCostsOutOfPocket=Math.max(0,purchaseCostsGross-residualAppliedToCosts);

      cashbackEligibleBase=resolveCashbackBase(
        price,
        creditAtBuy,
        principalCreditAtBuy,
        cfg.cashbackBasePolicy
      );
      purchaseCashback=calculateCashback(cashbackEligibleBase,cfg.cashbackPct);
      purchaseCashbackReceiptMonth=Math.min(N+1,buy+Math.max(0,Math.round(cfg.cashbackDelayMonths ?? 1)));
      purchaseTransactionNet=complement+purchaseCostsOutOfPocket-purchaseCashback;

      cashObrigacoes += complement+purchaseCostsOutOfPocket;
      propertyValue=price;
      purchaseCotas.forEach(q=>{
        q.usedInPurchase=true;
        q.letterBalance=0;
      });
    }

    if(purchased && purchaseCashback>0 && m===purchaseCashbackReceiptMonth){
      purchaseCashbackThisMonth=purchaseCashback;
    }

    let netRent=0;
    if(purchased && !propertySold && m>buy){
      const received=currentRent*(1-cfg.vacancy);
      const variableCosts=received*(cfg.adminRent+cfg.manut);
      const operatingBeforeTax=received-variableCosts-fixedOwner;
      const tax=Math.max(0,operatingBeforeTax)*cfg.rentTax;
      netRent=operatingBeforeTax-tax;
      totalNetRent += netRent;
      rendaEstrategia += netRent;

      if(m===buy+1){
        initialNetRent=netRent;
        initialPostCashFlow=cashObrigacoes-rendaEstrategia;
        firstFullConsortiumPayment=installment;
        firstFullLoanPayment=currentLoanPayment;
        firstFullNetRent=netRent;
      }
    }

    if(purchased && !propertySold && sellMonth<=N && m===sellMonth){
      const saleBaseValue=cfg.propertySaleBase==='market' ? propertyValue : price;
      propertySalePrice=saleBaseValue*cfg.propertySalePctOfPurchase;
      propertySaleBrokerage=propertySalePrice*cfg.sellerBrokeragePct;
      propertySaleOtherCosts=cfg.sellerOtherCosts;
      const simplifiedTaxBasis=price+purchaseCostsGross;
      const simplifiedCapitalGain=Math.max(0,propertySalePrice-simplifiedTaxBasis);
      propertySaleTax=simplifiedCapitalGain*cfg.sellerCapitalGainTaxPct;
      propertySaleTotalCosts=propertySaleBrokerage+propertySaleOtherCosts+propertySaleTax;

      propertySaleConsortiumPayoff=cfg.sellPropertyPayoff ? sumQ(q=>q.usedInPurchase ? q.outstanding : 0) : 0;
      propertySaleLoanPayoff=cfg.payLanceLoanOnPropertySale ? sumQ(q=>q.usedInPurchase ? q.loanBalance : 0) : 0;

      let netSale=propertySalePrice-propertySaleTotalCosts-propertySaleConsortiumPayoff-propertySaleLoanPayoff;
      if(netSale<0){propertySaleTopUp=-netSale;cashObrigacoes += propertySaleTopUp;netSale=0;} else propertySaleTopUp=0;
      propertySaleNetCash=netSale;
      propertySaleCashThisMonth=netSale;

      if(cfg.sellPropertyPayoff) cotas.forEach(q=>{
        if(q.usedInPurchase){q.outstanding=0;q.fullInstall=0;}
      });
      if(cfg.payLanceLoanOnPropertySale && propertySaleLoanPayoff>0){
        cotas.forEach(q=>{
          if(!q.usedInPurchase) return;
          if(q.loanBalance>0){q.totalLoanPayments+=q.loanBalance;totalLoanPayments+=q.loanBalance;}
          q.loanBalance=0;q.loanMonthsPaid=q.loanTerm;
        });
      }
      propertyValue=0;
      currentRent=0;
      propertySold=true;
    }

    // Nesta versão, a cessão representa a venda conjunta do conjunto de cotas
    // e só é habilitada depois da última contemplação.
    if(quotaSale && !quotaSold && !purchased && !redeemed && m===quotaSaleMonth){
      quotaSaleCredit=sumQ(q=>q.letterBalance);
      quotaSaleDebt=sumQ(q=>q.outstanding);
      quotaSaleLoan=sumQ(q=>q.loanBalance);

      const grossOffer=Math.max(0,quotaSale.grossOffer||0);
      const feePct=quotaSale.saleFeePct ?? cfg.saleFeePct;
      const feeCap=quotaSale.saleFeeCap ?? cfg.saleFeeCap;
      const extraPct=quotaSale.saleExtraCostPct ?? cfg.saleExtraCostPct;
      const payLoan=quotaSale.payLanceLoanOnSale ?? cfg.payLanceLoanOnQuotaSale;

      quotaSaleDebtByQuota=Object.fromEntries(cotas.map(q=>[q.id,q.outstanding]));
      quotaSaleTransferFeeByQuota=Object.fromEntries(cotas.map(q=>[
        q.id,
        Math.min(q.outstanding*feePct,feeCap || Infinity)
      ]));
      quotaSaleTransferFee=Object.values(quotaSaleTransferFeeByQuota).reduce((a,v)=>a+v,0);
      quotaSaleExtraCost=grossOffer*extraPct;
      let proceeds=grossOffer-quotaSaleTransferFee-quotaSaleExtraCost;
      if(payLoan){
        proceeds -= quotaSaleLoan;
        cotas.forEach(q=>{
          if(q.loanBalance>0){q.totalLoanPayments+=q.loanBalance;totalLoanPayments+=q.loanBalance;}
          q.loanBalance=0;q.loanMonthsPaid=q.loanTerm;
        });
      }
      if(proceeds<0){quotaSaleTopUp=-proceeds;cashObrigacoes+=quotaSaleTopUp;proceeds=0;} else quotaSaleTopUp=0;
      quotaSaleNetCash=proceeds;
      quotaSaleCashThisMonth=proceeds;
      cotas.forEach(q=>{q.outstanding=0;q.fullInstall=0;q.letterBalance=0;});
      quotaSold=true;
    }

    if(m===N){
      const remaining=sumQ(q=>q.outstanding);
      if(remaining>0){
        finalSettlement=remaining;
        cashObrigacoes += remaining;
        cotas.forEach(q=>{q.outstanding=0;q.fullInstall=0;});
      }
    }

    const monthlyStrategyCdbYieldThisMonth=strategyCash*cdbMonthly;
    cdbBal *= (1+cdbMonthly);
    strategyCash *= (1+cdbMonthly);
    strategyCash += quotaSaleCashThisMonth;
    strategyCash += redeemCashThisMonth;
    strategyCash += propertySaleCashThisMonth;
    strategyCash += purchaseCashbackThisMonth;

    const aporteDoBolso=Math.max(0,cashObrigacoes-rendaEstrategia);
    const excedenteDaEstrategia=Math.max(0,rendaEstrategia-cashObrigacoes);
    cdbBal += aporteDoBolso;
    strategyCash += excedenteDaEstrategia;
    cumulativeExternal += aporteDoBolso;

    const aporteRealHoje=aporteDoBolso/Math.pow(1+inflationMonthly,m);
    realContributionsToday += aporteRealHoje;
    externalCashFlowsReal[m]=-(aporteRealHoje);

    const anyContemplated=cotas.some(q=>q.contemplated);
    const allContemplated=cotas.every(q=>q.contemplated);
    const aggregateLetterBalance=sumQ(q=>q.letterBalance);
    const aggregateOutstanding=sumQ(q=>q.outstanding);
    // Cotas ainda não contempladas e não usadas na compra não entram como
    // dívida comparável sem ativo correspondente. Após compra parcial, somente
    // cotas usadas no imóvel ou já contempladas entram no passivo comparável.
    const comparableOutstanding = purchased
      ? sumQ(q=>(q.usedInPurchase || q.contemplated) ? q.outstanding : 0)
      : sumQ(q=>q.contemplated ? q.outstanding : 0);
    const aggregateLoanBalance=sumQ(q=>q.loanBalance);

    let grossAsset=0;
    let comparableAsset=0;
    let propertyNetRealizationThisMonth=0;

    if(quotaSold || !anyContemplated){
      grossAsset=0; comparableAsset=0;
    }else if(redeemed){
      grossAsset=0; comparableAsset=0;
    }else if(anyContemplated && !purchased){
      grossAsset=aggregateLetterBalance;
      comparableAsset=aggregateLetterBalance;
    }else if(propertySold){
      grossAsset=aggregateLetterBalance+residualComparableAsset;
      comparableAsset=aggregateLetterBalance+residualComparableAsset;
    }else{
      grossAsset=propertyValue+aggregateLetterBalance+residualComparableAsset;
      const hypotheticalBrokerage=propertyValue*cfg.sellerBrokeragePct;
      const hypotheticalOtherCosts=cfg.sellerOtherCosts;
      const simplifiedTaxBasis=price+purchaseCostsGross;
      const hypotheticalGain=Math.max(0,propertyValue-simplifiedTaxBasis);
      const hypotheticalTax=hypotheticalGain*cfg.sellerCapitalGainTaxPct;
      propertyNetRealizationThisMonth=Math.max(0,propertyValue-hypotheticalBrokerage-hypotheticalOtherCosts-hypotheticalTax);
      comparableAsset=propertyNetRealizationThisMonth+aggregateLetterBalance+residualComparableAsset;
      if(m===N){
        finalPropertyMarketValue=propertyValue;
        finalPropertyNetRealization=propertyNetRealizationThisMonth;
        finalPropertyExitCosts=hypotheticalBrokerage+hypotheticalOtherCosts;
        finalPropertyExitTax=hypotheticalTax;
      }
    }

    const equityGross=grossAsset-comparableOutstanding-aggregateLoanBalance;
    const equity=comparableAsset-comparableOutstanding-aggregateLoanBalance;
    const totalStrategyGross=equityGross+strategyCash;
    const totalStrategy=equity+strategyCash;

    hist.push({
      m,
      cdb:cdbBal,
      equity,
      equityGross,
      strategyCash,
      totalStrategy:anyContemplated ? totalStrategy : null,
      totalStrategyGross:anyContemplated ? totalStrategyGross : null,
      preCredit:(!quotaSold ? sumQ(q=>!q.contemplated ? q.credit : 0) : null),
      debt:aggregateOutstanding,
      comparableDebt:comparableOutstanding,
      debtByQuota:Object.fromEntries(cotas.map(q=>[q.id,q.outstanding])),
      loanDebt:aggregateLoanBalance,
      gross:grossAsset,
      comparableAsset,
      propertyNetRealization:propertyNetRealizationThisMonth,
      outflow:cumulativeExternal,
      monthlyOutflow:aporteDoBolso,
      monthlyLoanPayment:currentLoanPayment,
      loanPaymentsByQuota:Object.fromEntries(cotas.map(q=>[q.id,q.monthlyLoanPayment])),
      loanDebtByQuota:Object.fromEntries(cotas.map(q=>[q.id,q.loanBalance])),
      monthlyInsurancePayment:currentInsurancePayment,
      monthlyConsortiumInstallment:installment,
      monthlyConsortiumInstallmentByQuota:Object.fromEntries(cotas.map(q=>[q.id,q.monthlyInstallment])),
      monthlyLetterYield:monthlyLetterYieldThisMonth,
      monthlyLetterYieldByQuota:Object.fromEntries(cotas.map(q=>[q.id,q.monthlyLetterYield])),
      monthlyYieldUsedByQuota:Object.fromEntries(cotas.map(q=>[q.id,q.monthlyYieldUsedForInstallment])),
      monthlyNetRent:netRent,
      monthlyStrategyCdbYield:monthlyStrategyCdbYieldThisMonth,
      purchaseCashbackReceived:purchaseCashbackThisMonth,
      contemplatedCount:cotas.filter(q=>q.contemplated).length,
      allContemplated
    });
  }

  const last=hist[hist.length-1];
  const horizonYears=N/12;
  const inflationFactor=Math.pow(1+cfg.inflationAnnual,horizonYears);
  const totalStrategyToday=last.totalStrategy/inflationFactor;
  const benchmarkToday=last.cdb/inflationFactor;

  const realGainStrategy=realContributionsToday>0 ? (totalStrategyToday/realContributionsToday-1)*100 : null;
  const realGainBenchmark=realContributionsToday>0 ? (benchmarkToday/realContributionsToday-1)*100 : null;
  const annualizedStrategyReal=realContributionsToday>0 && totalStrategyToday>=0 ? Math.pow(totalStrategyToday/realContributionsToday,1/horizonYears)-1 : null;
  const annualizedBenchmarkReal=realContributionsToday>0 && benchmarkToday>=0 ? Math.pow(benchmarkToday/realContributionsToday,1/horizonYears)-1 : null;

  const strategyRealCashFlows=externalCashFlowsReal.slice();
  const benchmarkRealCashFlows=externalCashFlowsReal.slice();
  while(strategyRealCashFlows.length<=N) strategyRealCashFlows.push(0);
  while(benchmarkRealCashFlows.length<=N) benchmarkRealCashFlows.push(0);
  strategyRealCashFlows[N]=(strategyRealCashFlows[N]||0)+totalStrategyToday;
  benchmarkRealCashFlows[N]=(benchmarkRealCashFlows[N]||0)+benchmarkToday;

  const realIrrStrategyMonthly=irrMonthly(strategyRealCashFlows);
  const realIrrBenchmarkMonthly=irrMonthly(benchmarkRealCashFlows);
  const realIrrStrategyAnnual=annualizeMonthlyRate(realIrrStrategyMonthly);
  const realIrrBenchmarkAnnual=annualizeMonthlyRate(realIrrBenchmarkMonthly);

  const credit=sumQ(q=>q.credit);
  const outstanding=sumQ(q=>q.outstanding);
  const fullInstall=sumQ(q=>q.fullInstall);
  const letterBalance=sumQ(q=>q.letterBalance);
  const letterPrincipalAtCont=sumQ(q=>q.letterPrincipalAtCont);
  const loanBalance=sumQ(q=>q.loanBalance);
  const loanMonthsPaid=sumQ(q=>q.loanMonthsPaid);
  const contemplated=cotas.some(q=>q.contemplated);
  const allContemplated=cotas.every(q=>q.contemplated);
  const requestedEmbeddedAtCont=sumQ(q=>q.requestedEmbeddedAtCont||0);
  const embeddedLanceAtCont=sumQ(q=>q.embeddedLanceAtCont||0);
  const embeddedWasLimitedByTotal=cotas.some(q=>q.embeddedWasLimitedByTotal);
  const embeddedLimitedCotas=cotas
    .filter(q=>q.embeddedWasLimitedByTotal)
    .map(q=>({id:q.id,requested:q.requestedEmbeddedAtCont,effective:q.embeddedLanceAtCont,lance:q.effectiveLanceAtCont}));

  const cotaDetails=cotas.map(q=>({
    id:q.id,
    credit0:q.credit0,
    cont:q.cont,
    useInPurchase:q.useInPurchase,
    usedInPurchase:q.usedInPurchase,
    contemplated:q.contemplated,
    lanceMode:q.lanceMode,
    bidPct:q.bidPct,
    embPct:q.embPct,
    letterBalance:q.letterBalance,
    outstanding:q.outstanding,
    requestedLanceAtCont:q.requestedLanceAtCont,
    effectiveLanceAtCont:q.effectiveLanceAtCont,
    requestedEmbeddedAtCont:q.requestedEmbeddedAtCont,
    embeddedLanceAtCont:q.embeddedLanceAtCont,
    embeddedWasLimitedByTotal:q.embeddedWasLimitedByTotal,
    cashLanceAtCont:q.cashLanceAtCont,
    letterPrincipalAtCont:q.letterPrincipalAtCont,
    postInstall:q.postInstall,
    loanReleaseMonth:q.loanReleaseMonth,
    loanFundPct:q.loanFundPct,
    loanRateMonthly:q.loanRateMonthly,
    loanTrAnnual:q.loanTrAnnual,
    loanTerm:q.loanTerm,
    loanSystem:q.loanSystem,
    loanPrincipal:q.loanPrincipal,
    loanInitialPayment:q.loanInitialPayment,
    loanBalance:q.loanBalance,
    loanMonthsPaid:q.loanMonthsPaid,
    totalLoanPayments:q.totalLoanPayments,
    totalLoanInterest:q.totalLoanInterest,
    totalLoanTrCorrection:q.totalLoanTrCorrection,
    ownCashLance:q.ownCashLance,
    totalLetterYieldAccrued:q.totalLetterYieldAccrued,
    totalYieldUsedForInstallments:q.totalYieldUsedForInstallments
  }));

  return {
    cfg,N,cont,firstCont,lastCont:cont,buy,sellMonth,redeemMonth,lancePct,embPct,cotaDetails,
    hist,last,
    strategy:last.totalStrategy,
    benchmark:last.cdb,
    delta:last.totalStrategy-last.cdb,

    contemplated,allContemplated,purchased,redeemed,propertySold,quotaSold,
    credit,outstanding,fullInstall,initialReduced,postInstall,
    letterBalance,letterPrincipalAtCont,propertyValue,residualCredit,residualGross,residualAppliedToCosts,residualUnallocated,residualComparableAsset,
    price,rgi,rent0,currentRent,fixedOwner,lastFixedOwner,
    priceAtPurchase,rentAtPurchase,rgiAtPurchase,fixedOwnerAtPurchase,

    cashLanceTotal,requestedLanceAtCont,effectiveLanceAtCont,requestedEmbeddedAtCont,embeddedLanceAtCont,
    lanceWasLimitedByOutstanding,embeddedWasLimitedByTotal,embeddedLimitedCotas,
    loanPrincipal,loanBalance,loanInitialPayment,loanMonthsPaid,totalLoanPayments,totalLoanInterest,totalLoanTrCorrection,
    loanTrAnnual,loanTrMonthly,earlyLoanPayoff,ownCashLance,

    totalInsurancePayments,firstInsurancePayment,firstPostContInsurancePayment,firstFullInsurancePayment,

    totalYieldUsedForInstallments,totalLetterYieldAccrued,firstYieldUsedForInstallment,firstGrossLetterYield,
    firstPostContConsortiumPayment,firstPostContLoanPayment,firstPostContGrossConsortiumPayment,firstPostContYieldUsed,

    creditAtBuy,principalCreditAtBuy,cashbackEligibleBase,complement,purchaseCostsGross,purchaseCostsOutOfPocket,
    purchaseCashback,purchaseCashbackReceiptMonth,purchaseTransactionNet,
    initialNetRent,initialPostCashFlow,firstFullConsortiumPayment,firstFullLoanPayment,firstFullNetRent,totalNetRent,

    redeemCredit,redeemConsortiumPayoff,redeemLanceLoanPayoff,redeemBridgeCost,redeemTaxCost,
    redeemNetCash,redeemTopUp,redeemAportesAte,redeemNetPosition,

    propertySalePrice,propertySaleBrokerage,propertySaleTax,propertySaleOtherCosts,propertySaleTotalCosts,
    propertySaleConsortiumPayoff,propertySaleLoanPayoff,propertySaleNetCash,propertySaleTopUp,
    finalPropertyMarketValue,finalPropertyNetRealization,finalPropertyExitCosts,finalPropertyExitTax,

    quotaSaleCredit,quotaSaleDebt,quotaSaleLoan,quotaSaleDebtByQuota,quotaSaleTransferFeeByQuota,
    quotaSaleTransferFee,quotaSaleExtraCost,quotaSaleNetCash,quotaSaleTopUp,

    finalSettlement,cdbBal,strategyCash,cumulativeExternal,realContributionsToday,externalCashFlowsReal,
    totalStrategyToday,benchmarkToday,realGainStrategy,realGainBenchmark,annualizedStrategyReal,annualizedBenchmarkReal,
    realIrrStrategyMonthly,realIrrBenchmarkMonthly,realIrrStrategyAnnual,realIrrBenchmarkAnnual
  };
}

  return {runScenario,irrMonthly,annualizeMonthlyRate};
});
