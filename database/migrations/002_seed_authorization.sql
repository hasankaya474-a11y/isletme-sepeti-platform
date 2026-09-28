INSERT INTO roles(id,code,name,system_role) VALUES
('role_commander','COMMANDER_ADMIN','Komutan Admin',1),
('role_business_admin','BUSINESS_ADMIN','İşletme Yöneticisi',1),
('role_procurement','PROCUREMENT','Satın Alma',1),
('role_chef','CHEF','Şef',1),
('role_accounting','ACCOUNTING','Muhasebe',1),
('role_branch_manager','BRANCH_MANAGER','Şube Yöneticisi',1),
('role_supplier_admin','SUPPLIER_ADMIN','Toptancı Yöneticisi',1),
('role_supplier_sales','SUPPLIER_SALES','Toptancı Satış',1),
('role_supplier_warehouse','SUPPLIER_WAREHOUSE','Toptancı Depo',1);

INSERT INTO permissions(id,code,description) VALUES
('p1','business.profile.manage','İşletme profilini yönetir'),
('p2','business.branch.manage','İşletme şubelerini yönetir'),
('p3','supplier.profile.manage','Toptancı profilini yönetir'),
('p4','catalog.offer.manage_own','Kendi tedarikçi tekliflerini yönetir'),
('p5','pricing.manage_own','Kendi fiyatlarını yönetir'),
('p6','stock.manage_own','Kendi stoklarını yönetir'),
('p7','rfq.create','Teklif talebi oluşturur'),
('p8','rfq.respond_own','Kendi firmasına gelen teklif talebini yanıtlar'),
('p9','order.read_own','Kendi kapsamındaki siparişleri görür'),
('p10','order.transition_own','Kendi kapsamındaki sipariş durumunu değiştirir'),
('p11','admin.configuration.manage','Platform yapılandırmasını yönetir'),
('p12','admin.content.publish','İçerik yayınlar'),
('p13','admin.audit.read','Audit kayıtlarını görür'),
('p14','admin.export.execute','Yetkili veri dışa aktarımı yapar');

INSERT INTO role_permissions(role_id,permission_id)
SELECT 'role_commander',id FROM permissions;

INSERT INTO role_permissions(role_id,permission_id) VALUES
('role_business_admin','p1'),('role_business_admin','p2'),('role_business_admin','p7'),('role_business_admin','p9'),
('role_procurement','p7'),('role_procurement','p9'),
('role_supplier_admin','p3'),('role_supplier_admin','p4'),('role_supplier_admin','p5'),('role_supplier_admin','p6'),('role_supplier_admin','p8'),('role_supplier_admin','p9'),('role_supplier_admin','p10'),
('role_supplier_sales','p4'),('role_supplier_sales','p5'),('role_supplier_sales','p8'),('role_supplier_sales','p9'),
('role_supplier_warehouse','p6'),('role_supplier_warehouse','p9'),('role_supplier_warehouse','p10');
