const e=(v="")=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
export function renderProcurementApproval({approval=null,requisition=null}={}){
 if(!approval||!requisition)return '<section class="buyer-workspace"><h1>Satın Alma Onayı</h1><p role="status">Bekleyen onay yok.</p></section>';
 return '<section class="buyer-workspace" aria-labelledby="approval-title"><h1 id="approval-title">Satın Alma Onayı</h1><p>Talep: '+e(requisition.id)+'</p><p>Durum: '+e(approval.status)+'</p><button data-decision="APPROVED">Onayla</button><button data-decision="REJECTED">Reddet</button></section>';
}
