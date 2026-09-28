import test from "node:test";
import assert from "node:assert/strict";
import {ADMIN_A11Y,validateControl} from "../apps/admin/src/accessibility-contract.mjs";
import {ADMIN_BREAKPOINT_BEHAVIOR} from "../apps/admin/src/responsive-contract.mjs";
import {renderConfigurationCenter} from "../apps/admin/src/configuration-page.mjs";
import {renderHelpCenter} from "../apps/admin/src/help-center-page.mjs";
import {renderVitrinStudio} from "../apps/admin/src/vitrin-studio-page.mjs";
import {renderSeoCenter} from "../apps/admin/src/seo-center-page.mjs";

test("admin responsive contract covers mobile tablet desktop",()=>{
 assert.equal(ADMIN_BREAKPOINT_BEHAVIOR.mobile.actions,"sticky_primary");
 assert.equal(ADMIN_BREAKPOINT_BEHAVIOR.tablet.tables,"adaptive");
 assert.equal(ADMIN_BREAKPOINT_BEHAVIOR.desktop.navigation,"sidebar");
});

test("admin accessibility contract preserves minimum interaction rules",()=>{
 assert.equal(ADMIN_A11Y.minTouchTargetPx>=44,true);
 assert.equal(ADMIN_A11Y.keyboardNavigation,true);
 assert.equal(ADMIN_A11Y.visibleFocus,true);
 assert.deepEqual(validateControl({label:"Yayınla",interactive:true,keyboardAction:"Enter"}),[]);
 assert.deepEqual(validateControl({label:"Yayınla",interactive:true}),["KEYBOARD_ACTION_REQUIRED"]);
});

test("phase2 admin centers expose semantic workspace headings and actions",()=>{
 const pages=[
  renderConfigurationCenter(),
  renderHelpCenter(),
  renderVitrinStudio(),
  renderSeoCenter()
 ];
 for(const html of pages){assert.match(html,/<section/);assert.match(html,/<h1>/);assert.doesNotMatch(html,/<script/i);}
 assert.match(pages[0],/Yeni Ayar/);
 assert.match(pages[1],/Yeni Yardım İçeriği/);
 assert.match(pages[2],/Önizle/);
 assert.match(pages[3],/SEO & Redirect Merkezi/);
});

test("phase2 admin renderers escape untrusted display text",()=>{
 assert.doesNotMatch(renderConfigurationCenter({configs:[{id:"1",key:"<script>x</script>",scopeType:"GLOBAL",status:"DRAFT"}]}),/<script>/);
 assert.doesNotMatch(renderHelpCenter({articles:[{id:"1",title:"<img src=x onerror=1>",status:"DRAFT"}]}),/<img /);
 assert.doesNotMatch(renderVitrinStudio({page:{title:"<script>x</script>"}}),/<script>/);
 assert.doesNotMatch(renderSeoCenter({redirects:[{fromPath:"<script>x</script>",toPath:"/safe"}]}),/<script>/);
});
