const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const requiredScripts=['model-core.js','contract-policies.js','property-economics.js','scenario-engine.js'];
const loaded=[...html.matchAll(/<script src="([^"]+)"\s*><\/script>/g)].map(m=>m[1]);
assert.deepEqual(loaded,requiredScripts,'políticas e adaptador imobiliário precisam carregar antes do motor');
const inline=[...html.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/g)]
  .map(m=>m[1]).filter(Boolean);
assert.equal(inline.length,1);
assert.doesNotThrow(()=>new Function(inline[0]),'script inline não pode conter sintaxe inválida');
const ids=[
  'perfilContrato','assetType','ajusteModelo','reajusteSerie','ajusteTeto','ajustePiso',
  'baseLanceFixo','baseLanceLivre','tetoEmbGrupo','embFixoPermitido',
  'adminAntecipada','fimParcelaReduzida','amortizacaoLance',
  'cartaYieldMode','cartaYieldNetAnnual','cartaYieldSeries',
  'rendimentoAbatimentoModo','abatimentoAutorizado','mesesAbatimento',
  'tarifaTransferenciaModelo','tarifaTransferenciaFixa','cadastroTransferenciaPorCota',
  'cessaoExigeAprovacao','cessaoAprovada','contractPolicyError'
];
ids.forEach(id=>assert.ok(html.includes('id="'+id+'"'),`campo ausente: ${id}`));
assert.ok(html.includes("contractProfile:$('perfilContrato')"),'perfil precisa ser passado ao motor');
assert.ok(html.includes("assetType:$('assetType')"),'tipo de ativo precisa ser passado ao motor');
assert.ok(html.includes("cashback:'0'"),'perfil genérico não pode herdar promoção de cashback Bamaq');
assert.ok(html.includes("prazo:'',reduzida:'100',adm:'',reserva:'',reajuste:''"),'perfil genérico não pode herdar taxas específicas');
assert.ok(html.includes("lastContractProfile=profile"),'troca de perfis deve preservar a origem da seleção');
console.log('UI wiring static contract tests: ok');
