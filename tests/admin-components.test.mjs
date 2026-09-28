import test from "node:test";import assert from "node:assert/strict";import {membershipTable,filterBar,helpPanel,approvalQueue} from "../apps/admin/src/components.mjs";import {renderIdentityWorkspace} from "../apps/admin/src/identity-page.mjs";import {memberDrawer} from "../apps/admin/src/member-drawer.mjs";import {IDENTITY_HELP} from "../apps/admin/src/help-identity.mjs";
test("membership empty state exists",()=>assert.match(membershipTable([]),/Henüz üyelik yok/));
test("membership data escaped",()=>assert.doesNotMatch(membershipTable([{id:"1",userId:"<script>x</script>",organizationType:"BUSINESS",organizationId:"b",status:"ACTIVE"}]),/<script>/));
test("filter bar labels controls",()=>{const h=filterBar();assert.match(h,/Üyelik filtreleri/);assert.match(h,/<label>Ara/);});
test("contextual help is populated",()=>assert.match(helpPanel(IDENTITY_HELP),/Çok Faktörlü Doğrulama/));
test("approval queue has explicit empty state",()=>assert.match(approvalQueue([]),/Bekleyen onay yok/));
test("workspace includes codeless admin controls",()=>{const h=renderIdentityWorkspace();assert.match(h,/Kullanıcı Davet Et/);assert.match(h,/Onay Kuyruğu/);assert.match(h,/Bu ekranda ne yapabilirim/);});
test("member drawer exposes role and session actions",()=>{const h=memberDrawer({member:{userId:"u",organizationType:"BUSINESS",organizationId:"b",status:"ACTIVE"}});assert.match(h,/Rol \/ Kapsam Değiştir/);assert.match(h,/Tüm Oturumları Kapat/);});
