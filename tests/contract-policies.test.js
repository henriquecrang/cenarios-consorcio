const assert=require('node:assert/strict');
const {parseRateSeries,rateAtAdjustment,letterMonthlyRateAt}=require('../contract-policies.js');

const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`expected ${b} got ${a}`);
assert.deepEqual(parseRateSeries('6;4;-1','annual_series'),[0.06,0.04,-0.01]);
assert.deepEqual(parseRateSeries('19:4;7:6','event_series'),[{month:7,rate:0.06},{month:19,rate:0.04}]);
assert.throws(()=>parseRateSeries('7:6;7:4','event_series'),/únicos/);
assert.throws(()=>parseRateSeries('7:abc','event_series'),/mês:percentual/);
assert.throws(()=>parseRateSeries('-100','annual_series'),/100/);
const legacy={firstAdj:7,reaj:0.03};
assert.deepEqual(rateAtAdjustment(legacy,7),{applies:true,rate:0.03});
assert.deepEqual(rateAtAdjustment(legacy,8),{applies:false,rate:0});
assert.deepEqual(rateAtAdjustment(legacy,19),{applies:true,rate:0.03});
assert.deepEqual(rateAtAdjustment({...legacy,adjustmentMode:'annual_series',adjustmentSeries:[0.06,0.04]},19),{applies:true,rate:0.04});
assert.deepEqual(rateAtAdjustment({...legacy,adjustmentMode:'event_series',adjustmentSeries:parseRateSeries('7:6;11:-2','event_series'),adjustmentFloor:-0.01},11),{applies:true,rate:-0.01});
assert.throws(()=>rateAtAdjustment({...legacy,adjustmentMode:'annual_series',adjustmentSeries:[0.06]},19),/não cobre/);
close(letterMonthlyRateAt({cdiAnnual:0.1365,cartaPctCdi:0.8},2),Math.pow(1.1092,1/12)-1);
close(letterMonthlyRateAt({letterYieldMode:'fixed_net',letterNetAnnual:0.07},2),Math.pow(1.07,1/12)-1);
close(letterMonthlyRateAt({letterYieldMode:'monthly_series',letterMonthlyRates:[0.01,0.02]},2),0.02);
assert.throws(()=>letterMonthlyRateAt({letterYieldMode:'monthly_series',letterMonthlyRates:[0.01]},2),/não cobre/);
console.log('contract-policies regression tests: ok');

assert.equal(letterMonthlyRateAt({letterYieldMode:'annual_net_series',letterAnnualRates:[0.06,0.08]},12),Math.pow(1.06,1/12)-1);
close(letterMonthlyRateAt({letterYieldMode:'annual_net_series',letterAnnualRates:[0.06,0.08]},13),Math.pow(1.08,1/12)-1);
assert.throws(()=>letterMonthlyRateAt({letterYieldMode:'annual_net_series',letterAnnualRates:[0.06]},13),/não cobre/);

const {parseMonthList,canUseYieldForInstallment}=require('../contract-policies.js');
assert.deepEqual(parseMonthList('9;5;7',12),[5,7,9]);
assert.throws(()=>parseMonthList('5;5',12),/únicos/);
assert.equal(canUseYieldForInstallment({rendimentoPagaParcela:true},5),true);
assert.equal(canUseYieldForInstallment({yieldInstallmentMode:'capitalize',rendimentoPagaParcela:true},5),false);
assert.equal(canUseYieldForInstallment({yieldInstallmentMode:'requested_months',yieldInstallmentApproved:true,yieldRequestMonths:[5,7]},6),false);
assert.equal(canUseYieldForInstallment({yieldInstallmentMode:'requested_months',yieldInstallmentApproved:true,yieldRequestMonths:[5,7]},7),true);
assert.throws(()=>canUseYieldForInstallment({yieldInstallmentMode:'automatic',yieldInstallmentApproved:false},5),/autorização/);

const {calculateTransferFee}=require('../contract-policies.js');
const feeCotas=[{id:'A',credit:400000,outstanding:350000},{id:'B',credit:200000,outstanding:180000}];
assert.equal(calculateTransferFee(feeCotas,{kind:'fixed_per_transfer',fixed:500,registrationPerQuota:150},100000).total,800);
assert.equal(calculateTransferFee(feeCotas,{kind:'fixed_per_quota',fixed:500},100000).total,1000);
assert.equal(calculateTransferFee(feeCotas,{kind:'credit_pct',rate:0.01,cap:1000},100000).total,2000);
assert.equal(calculateTransferFee(feeCotas,{kind:'outstanding_pct',rate:0.01,cap:1000},100000).total,2000);
assert.equal(calculateTransferFee(feeCotas,{kind:'offer_pct',rate:0.02},100000).total,2000);
