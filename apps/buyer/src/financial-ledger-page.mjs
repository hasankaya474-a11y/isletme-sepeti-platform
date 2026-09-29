const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
const money=(v,c)=>(Math.abs(v)/100).toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2})+" "+e(c);
export function renderFinancialLedger({entries=[],loading=false,error=null}={}){
 if(loading)return '<section class="buyer-workspace"><h1>Finansal Kayıtlar</h1><p role="status">Kayıtlar yükleniyor.</p></section>';
 if(error)return '<section class="buyer-workspace"><h1>Finansal Kayıtlar</h1><p role="alert">Kayıtlar yüklenemedi.</p></section>';
 return '<section class="buyer-workspace" aria-labelledby="ledger-title"><h1 id="ledger-title">Finansal Kayıtlar</h1><p>Bu ekran kayıt ve mutabakat bilgisidir; ödeme işlemi yapmaz.</p>'+(entries.length?entries.map(x=>'<article><strong>'+e(x.accountCode)+'</strong><span>'+e(x.amountMinor>0?"+":"-")+money(x.amountMinor,x.currency)+'</span></article>').join(""):'<p role="status">Ledger kaydı yok.</p>')+'</section>';
}
