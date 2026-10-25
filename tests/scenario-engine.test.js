const assert=require('node:assert/strict');
const {runScenario}=require('../scenario-engine.js');

function close(actual,expected,tolerance=0.01){
  assert.ok(Math.abs(actual-expected)<=tolerance,`expected ${expected}, got ${actual}`);
}

function makeConfig({
  conts=[4,4,4,4],
  lancePct=0.73,
  financedPct=0,
  buyRaw=Math.max(...conts),
  price=1000000,
  lockPropertyPrice=false,
  cdiAnnual=0.1365,
  cartaPctCdi=0.80,
  cashbackBasePolicy='principal',
  lanceMode='free',
  fixedLancePct=0.30,
  residualCreditPolicy='unallocated',
  residualExpenseCapPct=0.10
}={}){
  const credits=[400000,400000,370000,200000];
  const loanTerms={fundPct:financedPct,rateMonthly:0.0155,trAnnual:0,term:120,system:'price'};
  const cotas=credits.map((credit0,i)=>({
    id:String.fromCharCode(65+i),
    credit0,
    cont:conts[i],
    loanTerms:{...loanTerms}
  }));
  const lastCont=Math.max(...conts);

  return {
    credit0:credits.reduce((a,b)=>a+b,0),
    N:214,
    cotas,
    firstCont:Math.min(...conts),
    cont:lastCont,
    buyRaw,
    buy:buyRaw,
    sellMonth:215,

    reduced:0.50,
    adm:0.24,
    reserva:0.01,
    reaj:0.03,
    firstAdj:7,
    adjustmentBeforeContemplation:true,

    lanceMode,
    lancePct,
    fixedLancePct,
    embMaxPct:0.30,

    usarEmprestimoLance:financedPct>0,
    emprestimoTermosPorCota:false,
    emprestimoLancePct:financedPct,
    emprestimoTaxaMes:0.0155,
    emprestimoTrAnnual:0,
    emprestimoPrazo:120,
    emprestimoSistema:'price',

    seguroAtivo:false,
    seguroBase:'fixed',
    seguroValorRaw:0,

    cdbAnnual:0.115,
    cdiAnnual,
    inflationAnnual:0.04,
    cartaPctCdi,
    rendimentoPagaParcela:true,

    resgateAtivo:false,
    redeemMonth:215,
    minResgate:lastCont+6,
    resgateComPonte:false,
    ponteTaxaMes:0.0155,
    ponteDias:10,
    ponteIofFixo:0.0038,
    ponteIofDia:0.000082,
    quitarEmpLanceNoResgate:true,
    irResgatePct:0,

    priceInput:price,
    lockPropertyPrice,
    itbi:0.03,
    rgiInput:6000,
    lockRgi:true,
    rgiPctOfProperty:0.006,
    outros:0,
    cashbackPct:0.10,
    cashbackBasePolicy,
    cashbackDelayMonths:1,
    residualCreditPolicy,
    residualExpenseCapPct,

    rentInput:5500,
    lockRent:true,
    rentPctOfProperty:0.005,
    rentAdj:0.04,
    vacancy:0.083,
    adminRent:0.08,
    manut:0.05,
    rentTax:0.275,
    fixedOwnerInput:350,
    lockOwnerCosts:true,
    ownerCostsPctOfRent:0.07,
    propAdj:0.04,

    sellPropertyPayoff:true,
    payLanceLoanOnPropertySale:true,
    propertySaleBase:'market',
    propertySalePctOfPurchase:1,
    sellerBrokeragePct:0.05,
    sellerCapitalGainTaxPct:0.15,
    sellerOtherCosts:0,

    saleFeePct:0.01,
    saleFeeCap:1000,
    saleExtraCostPct:0,
    payLanceLoanOnQuotaSale:true
  };
}

// Operação multi-cota canônica antes do primeiro reajuste.
{
  const r=runScenario(makeConfig());
  assert.equal(r.cotaDetails.length,4);
  assert.equal(r.buy,4);
  close(r.creditAtBuy,959000);
  close(r.principalCreditAtBuy,959000);
  close(r.cashbackEligibleBase,959000);
  close(r.purchaseCashback,95900);
  assert.equal(r.purchaseCashbackReceiptMonth,5);
  close(r.hist.find(h=>h.m===4).purchaseCashbackReceived,0);
  close(r.hist.find(h=>h.m===5).purchaseCashbackReceived,95900);
  close(r.cotaDetails[0].letterPrincipalAtCont,280000);
  close(r.totalLetterYieldAccrued,0);

  // Cota A: após contemplar no mês 4, restam exatamente 210 meses.
  const q=r.cotaDetails[0];
  const initialDebt=400000*(1+0.24+0.01);
  const reducedInstallment=(initialDebt/214)*0.50;
  const debtBeforeBid=initialDebt-reducedInstallment*4;
  const debtAfterBid=debtBeforeBid-q.effectiveLanceAtCont;
  close(q.postInstall,debtAfterBid/(214-4));
}


// Sensibilidade de timing: delay 0 permite receber no mesmo mês, mas não é default.
{
  const cfg=makeConfig();
  cfg.cashbackDelayMonths=0;
  const r=runScenario(cfg);
  assert.equal(r.purchaseCashbackReceiptMonth,4);
  close(r.hist.find(h=>h.m===4).purchaseCashbackReceived,95900);
}

// Lance Fixo usa 30% da carta atualizada e pode ser integralmente embutido.
{
  const r=runScenario(makeConfig({
    conts:[4,4,4,4],
    lanceMode:'fixed',
    fixedLancePct:0.30,
    lancePct:0.73,
    buyRaw:4
  }));
  close(r.cotaDetails[0].requestedLanceAtCont,120000);
  close(r.cotaDetails[0].embeddedLanceAtCont,120000);
  close(r.cotaDetails[0].cashLanceAtCont,0);
  close(r.cashLanceTotal,0);
}

// Primeiro reajuste no mês 7 deve afetar cartas que contemplam no mês 12.
{
  const r=runScenario(makeConfig({
    conts:[12,12,12,12],
    lancePct:0.70,
    buyRaw:12
  }));
  close(r.principalCreditAtBuy,987770);
  close(r.creditAtBuy,987770);
  close(r.cashbackEligibleBase,987770);
  close(r.purchaseCashback,98777);
}

// Contemplações escalonadas: rendimentos ficam identificados por cota e não são
// somados à base conservadora do cashback.
{
  const r=runScenario(makeConfig({
    conts:[4,8,12,16],
    lancePct:0.69,
    buyRaw:16,
    cashbackBasePolicy:'principal'
  }));

  assert.ok(r.creditAtBuy>r.principalCreditAtBuy);
  close(r.principalCreditAtBuy,979370);
  close(r.cashbackEligibleBase,979370);
  close(r.purchaseCashback,97937);
  assert.ok(r.cotaDetails[0].totalLetterYieldAccrued>0);
  assert.ok(r.cotaDetails[1].totalLetterYieldAccrued>0);
  assert.ok(r.cotaDetails[2].totalLetterYieldAccrued>0);
  close(r.cotaDetails[3].totalLetterYieldAccrued,0);
  close(
    r.totalYieldUsedForInstallments,
    r.cotaDetails.reduce((sum,q)=>sum+q.totalYieldUsedForInstallments,0)
  );

  // Invariante anti-pooling: em todo mês, cada cota só usa o próprio rendimento
  // e nunca mais do que a própria parcela daquele mês.
  for(const h of r.hist){
    for(const q of r.cotaDetails){
      const y=h.monthlyLetterYieldByQuota?.[q.id] || 0;
      const inst=h.monthlyConsortiumInstallmentByQuota?.[q.id] || 0;
      const used=h.monthlyYieldUsedByQuota?.[q.id] || 0;
      assert.ok(used<=y+0.01,`cota ${q.id}, mês ${h.m}: abatimento excedeu rendimento próprio`);
      assert.ok(used<=inst+0.01,`cota ${q.id}, mês ${h.m}: abatimento excedeu parcela própria`);
    }
  }
}

// Residual sem política explícita é rastreado, mas não vira ativo comparável.
{
  const r=runScenario(makeConfig({
    conts:[4,8,12,16],
    lancePct:0.69,
    buyRaw:16,
    price:1000000,
    residualCreditPolicy:'unallocated'
  }));
  assert.ok(r.residualGross>0);
  close(r.residualUnallocated,r.residualGross);
  close(r.residualAppliedToCosts,0);
  close(r.residualComparableAsset,0);
}

// Política de custos: usa o residual para reduzir desembolso de aquisição,
// respeitando o teto configurado, e deixa eventual sobra como não alocada.
{
  const r=runScenario(makeConfig({
    conts:[4,8,12,16],
    lancePct:0.69,
    buyRaw:16,
    price:950000,
    residualCreditPolicy:'costs',
    residualExpenseCapPct:0.10
  }));
  const cap=r.principalCreditAtBuy*0.10;
  const expected=Math.min(r.residualGross,r.purchaseCostsGross,cap);
  close(r.residualAppliedToCosts,expected);
  close(r.purchaseCostsOutOfPocket,r.purchaseCostsGross-expected);
  close(r.residualUnallocated,r.residualGross-expected);
  close(r.residualComparableAsset,0);
}

// A sensibilidade inclusiva pode usar rendimentos, mas é explicitamente distinta.
{
  const r=runScenario(makeConfig({
    conts:[4,8,12,16],
    lancePct:0.69,
    buyRaw:16,
    cashbackBasePolicy:'available'
  }));
  close(r.cashbackEligibleBase,1000000);
  close(r.purchaseCashback,100000);
}

// Taxa de transferência: depende do saldo devedor de cada cota, não da oferta.
{
  const cfg=makeConfig({
    conts:[4,4,4,4],
    lancePct:0.73,
    buyRaw:215
  });

  const runSale=offer=>runScenario(cfg,{
    quotaSale:{
      month:5,
      grossOffer:offer,
      saleFeePct:0.01,
      saleFeeCap:1000,
      saleExtraCostPct:0,
      payLanceLoanOnSale:false
    }
  });

  const a=runSale(100000);
  const b=runSale(500000);
  const expected=Object.values(a.quotaSaleDebtByQuota)
    .reduce((sum,debt)=>sum+Math.min(debt*0.01,1000),0);

  close(a.quotaSaleTransferFee,expected);
  close(b.quotaSaleTransferFee,expected);
  close(a.quotaSaleTransferFee,b.quotaSaleTransferFee);
  assert.deepEqual(Object.keys(a.quotaSaleTransferFeeByQuota).sort(),['A','B','C','D']);
}

// Financiamento por cota: 100% da parte em dinheiro do lance gera principal
// bancário exatamente igual ao cash lance agregado.
{
  const r=runScenario(makeConfig({
    conts:[12,12,12,12],
    lancePct:0.70,
    financedPct:1,
    buyRaw:12
  }));
  close(r.loanPrincipal,r.cashLanceTotal);
  assert.ok(r.totalLoanInterest>0);
  assert.equal(r.cotaDetails.every(q=>q.loanReleaseMonth===12),true);
}

console.log('scenario-engine integration tests: ok');
