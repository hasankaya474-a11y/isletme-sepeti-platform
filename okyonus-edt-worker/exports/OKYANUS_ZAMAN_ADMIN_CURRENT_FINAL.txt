/* OKYANUS ZAMAN RELEASE 2026-10-01 CROSSCHECKED R29 */
/* OKYANUS EDT - SINGLE FILE ZAMAN/ADMIN WORKER
Generated from canonical release sources. No relative imports.
*/
const { commerceAdminApi, commerceAdminPage } = (() => {
const VERIFIED_PRODUCT_IMAGES=Object.freeze({"LEZ-0006":{"name":"Julyen Dilimli Sosis","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0006.jpg"},"LEZ-0019":{"name":"Cheddar&Peynir Dolgulu Pili\u00e7 K\u00f6fte","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0019.jpg"},"LEZ-0023":{"name":"Cordon Bleu","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0023.jpg"},"LEZ-0024":{"name":"\u00c7\u0131t\u0131r K\u0131t\u0131r Fileto","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0024.jpg"},"LEZ-0036":{"name":"Kasap K\u00f6fte","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0036.jpg"},"LEZ-0037":{"name":"Ac\u0131l\u0131 Kebap","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0037.jpg"},"LEZ-0038":{"name":"Parmak K\u00f6fte","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0038.jpg"},"LEZ-0063":{"name":"K\u0131rm\u0131z\u0131 Ye\u015fil Biberli \u00c7\u00f6p \u015ei\u015f","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0063.jpg"},"LEZ-0065":{"name":"G\u00f6\u011f\u00fcs Ku\u015fba\u015f\u0131","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0065.jpg"},"LEZ-0066":{"name":"G\u00f6\u011f\u00fcs \u015ei\u015f","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0066.jpg"},"LEZ-0067":{"name":"But Ku\u015fba\u015f\u0131","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0067.jpg"},"LEZ-0070":{"name":"Mangall\u0131k Bonfile","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0070.jpg"},"LEZ-0072":{"name":"Mangall\u0131k Derili But Pirzola","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0072.jpg"},"LEZ-0073":{"name":"Mangall\u0131k S\u0131rt Pirzola","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0073.jpg"},"LEZ-0075":{"name":"Mangall\u0131k Derisiz But Izgara","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0075.jpg"},"LEZ-0078":{"name":"Yar\u0131m Kanat Grill Pili\u00e7","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0078.jpg"},"LEZ-0082":{"name":"\u00c7atal But","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0082.jpg"},"LEZ-0083":{"name":"S\u0131rts\u0131z But","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0083.jpg"},"LEZ-0085":{"name":"Baget","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0085.jpg"},"LEZ-0092":{"name":"Derili Kemiksiz But","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0092.jpg"},"LEZ-0094":{"name":"B\u00fct\u00fcn G\u00f6\u011f\u00fcs","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0094.jpg"},"LEZ-0096":{"name":"S\u0131rts\u0131z G\u00f6\u011f\u00fcs","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0096.jpg"},"LEZ-0102":{"name":"\u0130nce G\u00f6\u011f\u00fcs","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0102.jpg"},"LEZ-0103":{"name":"Derili Fileto","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0103.jpg"},"LEZ-0105":{"name":"Kelebek (S\u0131rt Pirzola)","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0105.jpg"},"LEZ-0111":{"name":"\u00dcst Kanat","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0111.jpg"},"LEZ-0112":{"name":"Tam (U\u00e7lu) Kanat","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0112.jpg"},"LEZ-0113":{"name":"U\u00e7suz Kanat","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0113.jpg"},"LEZ-0118":{"name":"Ci\u011fer-Y\u00fcrek","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0118.jpg"},"LEZ-0119":{"name":"Ci\u011fer","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0119.jpg"},"LEZ-0120":{"name":"Y\u00fcrek","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0120.jpg"},"LEZ-0121":{"name":"Ta\u015fl\u0131k","brand":"Lezita","amount":"","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/LEZ-0121.jpg"},"OKY-VRF-0100":{"name":"Kasap K\u00f6fte","brand":"Lezita","amount":"300 g","package":"8","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0100.jpg"},"OKY-VRF-0101":{"name":"Burger","brand":"Lezita Pro","amount":"1500 g","package":"4","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0101.jpg"},"OKY-VRF-0102":{"name":"Hamburger K\u00f6fte","brand":"Lezita Pro","amount":"1035 g","package":"10","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0102.jpg"},"OKY-VRF-0103":{"name":"Izgara K\u00f6fte","brand":"Lezita Pro","amount":"1000 g","package":"10","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0103.jpg"},"OKY-VRF-0104":{"name":"Parmak K\u00f6fte","brand":"Lezita Pro","amount":"1000 g","package":"10","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0104.jpg"},"OKY-VRF-0128":{"name":"\u00c7\u0131t\u0131r Kaplamal\u0131 Burger","brand":"Lezita Pro","amount":"1020 g","package":"10","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0128.jpg"},"OKY-VRF-0129":{"name":"\u00c7\u0131t\u0131r Kaplamal\u0131 Burger","brand":"Lezita Pro","amount":"1080 g","package":"10","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0129.jpg"},"OKY-VRF-0130":{"name":"\u00c7\u0131t\u0131r Pi\u015fmi\u015f Bonfile","brand":"Lezita Pro","amount":"1000 g","package":"10","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0130.jpg"},"OKY-VRF-0131":{"name":"Cordon Bleu","brand":"Lezita Pro","amount":"1000 g","package":"10","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0131.jpg"},"OKY-VRF-0132":{"name":"Nugget","brand":"Lezita Pro","amount":"1000 g","package":"10","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0132.jpg"},"OKY-VRF-0133":{"name":"Schnitzel","brand":"Lezita Pro","amount":"1080 g","package":"10","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0133.jpg"},"OKY-VRF-0025":{"name":"Chef Base Et Bulyon","brand":"Knorr Professional","amount":"6.5 kg","package":"2","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0025.jpg"},"OKY-VRF-0027":{"name":"Chef Base Tavuk Bulyon","brand":"Knorr Professional","amount":"5 kg","package":"2","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0027.jpg"},"OKY-VRF-0197":{"name":"Cafe de Paris Sos","brand":"Knorr Professional","amount":"1 kg","package":"\u2014","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0197.jpg"},"OKY-VRF-0198":{"name":"Demi Glace Et Sosu","brand":"Knorr Professional","amount":"1 kg","package":"6","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0198.jpg"},"OKY-VRF-0205":{"name":"Akdeniz Salata Sosu","brand":"Knorr Professional","amount":"1 kg","package":"6","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0205.jpg"},"OKY-VRF-0251":{"name":"\u00c7\u0131t\u0131r Kaplama Harc\u0131","brand":"Knorr Professional","amount":"3 kg","package":"3","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0251.jpg"},"OKY-VRF-0262":{"name":"Sar\u0131msakl\u0131 \u00c7e\u015fni","brand":"Knorr Professional","amount":"750 g","package":"6","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0262.jpg"},"OKY-VRF-0263":{"name":"Tavuk \u00c7e\u015fnisi","brand":"Knorr Professional","amount":"4 kg","package":"2","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0263.jpg"},"OKY-VRF-0264":{"name":"Tavuk \u00c7e\u015fnisi","brand":"Knorr Professional","amount":"750 g","package":"6","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0264.jpg"},"BOOL-030":{"name":"Mantarl\u0131 Sos","brand":"Knorr","amount":"750 Gr","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/BOOL-030.jpg"},"OKY-VRF-0210":{"name":"Ustalar\u0131n Kremas\u0131","brand":"S\u00fcta\u015f","amount":"1 L","package":"12","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0210.png"},"OKY-VRF-0028":{"name":"\u00c7\u0131t\u0131r Bal\u0131k","brand":"Pinar","amount":"400 g","package":"1","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0028.png"},"OKY-VRF-0029":{"name":"Fish Finger","brand":"Pinar","amount":"240 g","package":"1","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0029.jpg"},"OKY-VRF-0058":{"name":"Karides","brand":"Pinar","amount":"400 g","package":"1","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0058.png"},"OKY-VRF-0046":{"name":"Halka Kalamar","brand":"Pinar","amount":"400 g","package":"1","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0046.png"},"OKY-VRF-0060":{"name":"So\u011fan Halkas\u0131","brand":"Feast","amount":"1500 g","package":"1","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0060.jpg"},"OKY-VRF-0030":{"name":"Mezgit Fileto","brand":"Pinar","amount":"500 g","package":"1","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0030.png"},"OKY-VRF-0063":{"name":"Cheese Sticks","brand":"Torku Pratiko","amount":"1500 g","package":"6","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0063.png"},"OKY-VRF-0079":{"name":"Premium Patates Kroket","brand":"Torku Pratiko","amount":"2500 g","package":"5","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0079.png"},"OKY-VRF-0076":{"name":"Panfresh Patates","brand":"Pratiko","amount":"2.5 kg","package":"5","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0076.png"},"OKY-VRF-0077":{"name":"Premium Patates","brand":"Pratiko","amount":"2.5 kg","package":"5","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/OKY-VRF-0077.png"},"EDT-0013":{"name":"AHSAF NATUREL B\u0130R\u0130NC\u0130 ZEYT\u0130NYA\u011eI 5 LT*4","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0013.png"},"EDT-0010":{"name":"ALFA KIZARTMALIK YA\u011e 18 LT*44","brand":"","amount":"Tnk","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0010.png"},"EDT-0490":{"name":"B\u0130NOT ACI TOZ B\u0130BER 1 KG","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0490.png"},"EDT-0491":{"name":"B\u0130NOT AK B\u0130BER TOZ 1 KG","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0491.png"},"EDT-0492":{"name":"B\u0130NOT B\u0130BER\u0130YE 500 GR","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0492.png"},"EDT-0493":{"name":"B\u0130NOT BU\u011eDAY N\u0130\u015eASTA 1 KG","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0493.png"},"EDT-0494":{"name":"B\u0130NOT \u00c7\u00d6REK OTU 1000 GR","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0494.png"},"EDT-0495":{"name":"B\u0130NOT FESLE\u011eEN 500 GR","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0495.png"},"EDT-0497":{"name":"B\u0130NOT GRAN\u00dcL KAPLAMA 1 KG","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0497.png"},"EDT-0009":{"name":"FR\u0130TA KIZARTMA YA\u011e 18 LT","brand":"","amount":"Tnk","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0009.png"},"EDT-0453":{"name":"BAR\u0130LLA MAKARNA BUKLE P\u0130PETTE 500 GR*9","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0453.png"},"EDT-0449":{"name":"BAR\u0130LLA MAKARNA FETTUCC\u0130NE 500 GR*12","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0449.jpg"},"EDT-0454":{"name":"BAR\u0130LLA MAKARNA L\u0130NGU\u0130NE YASSI SPAGETT\u0130 500 GR*16","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0454.png"},"EDT-0451":{"name":"BAR\u0130LLA MAKARNA PENNE(KALEM)500 GR*9","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0451.png"},"EDT-0450":{"name":"BAR\u0130LLA MAKARNA TAGL\u0130ATELLE 500 GR*12","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0450.png"},"EDT-0512":{"name":"B\u0130NOT MISIR N\u0130\u015eASTA 1 KG","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0512.png"},"EDT-0513":{"name":"B\u0130NOT MISIR UNU 1 KG","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0513.png"},"EDT-0308":{"name":"OVA UN 25 KG PASTA VE B\u00d6REKL\u0130K","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0308.png"},"EDT-0456":{"name":"DE CECCO MAKARNA 1 KG SPAGETT\u0130*12","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0456.png"},"EDT-0457":{"name":"DE CECCO MAKARNA 500 GR FETTUC\u0130NE/KURDELE*8","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0457.png"},"EDT-0458":{"name":"DE CECCO MAKARNA 500 GR TAGL\u0130ATELLE*8","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0458.png"},"EDT-0459":{"name":"DE CECCO MAKARNA PENNE 1 KG*12","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0459.png"},"EDT-0530":{"name":"AR\u0130FO\u011eLU FAJ\u0130TA BAHARATI 700 GR*12","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0530.png"},"EDT-0529":{"name":"AR\u0130FO\u011eLU KAJUN BAHARATI 600 GR*12","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0529.png"},"EDT-0499":{"name":"B\u0130NOT H\u0130ND\u0130STAN CEV\u0130Z\u0130 500 GR","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0499.png"},"EDT-0500":{"name":"B\u0130NOT \u0130SOT 1 KG","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0500.png"},"EDT-0504":{"name":"B\u0130NOT KARAB\u0130BER TOZ 1 KG","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0504.png"},"EDT-0505":{"name":"B\u0130NOT KARBONAT TOZ 1 KG","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0505.png"},"EDT-0313":{"name":"NOHUT 25 KG 9 MM TAT","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0313.png"},"EDT-0319":{"name":"BULGUR P\u0130LAVLIK 5 KG TAT","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0319.png"},"EDT-0527":{"name":"B\u0130NOT ZENCEF\u0130L TOZ 1 KG","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0527.png"},"EDT-0496":{"name":"B\u0130NOT GALETA UNU 1 KG","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0496.png"},"EDT-0501":{"name":"B\u0130NOT KABARTMA TOZU 1 KG","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0501.png"},"EDT-0502":{"name":"B\u0130NOT KAKAO 1 KG","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0502.png"},"EDT-0507":{"name":"B\u0130NOT K\u0130MYON 1 KG","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0507.png"},"EDT-0508":{"name":"B\u0130NOT K\u0130\u015eN\u0130\u015e 1 KG","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0508.png"},"EDT-0509":{"name":"B\u0130NOT K\u00d6FTE HARCI 1 KG","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0509.png"},"EDT-0510":{"name":"B\u0130NOT K\u00d6R\u0130 1 KG","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0510.png"},"EDT-0511":{"name":"B\u0130NOT L\u0130MON TUZU 1 KG","brand":"","amount":"Ad","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0511.png"},"EDT-0517":{"name":"B\u0130NOT SARIMSAK TOZU 1 KG","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0517.png"},"EDT-0276":{"name":"EVDEN KALEM B\u00d6RE\u011e\u0130 PEYN\u0130RL\u0130 3 KG","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0276.png"},"EDT-0277":{"name":"EVDEN PA\u00c7ANGA B\u00d6RE\u011e\u0130 3 KG","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0277.png"},"EDT-0038":{"name":"FEAST DONUK SO\u011eAN HALKA KROKET (6*1,5 KG) 9 KG","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0038.png"},"EDT-0039":{"name":"FEAST MOZARELLA ST\u0130CK 1000 GR* 6","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0039.png"},"EDT-0163":{"name":"F\u0130NE FOOD DONUK BAMYA S\u0130VR\u0130(0-3) 2,5 KG*4","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0163.png"},"EDT-0160":{"name":"F\u0130NE FOOD DONUK BEZELYE 2,5 KG*6","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0160.png"},"EDT-0165":{"name":"F\u0130NE FOOD DONUK BROKOL\u0130 2,5 KG*4","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0165.jpg"},"EDT-0158":{"name":"F\u0130NE FOOD DONUK FASULYE ORB\u0130T 2,5 KG*6","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0158.jpg"},"EDT-0159":{"name":"F\u0130NE FOOD DONUK FASULYE TAZE 2,5 KG*6","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0159.jpg"},"EDT-0161":{"name":"F\u0130NE FOOD DONUK ISPANAK 2,5 KG*4","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0161.jpg"},"EDT-0164":{"name":"F\u0130NE FOOD DONUK KARNABAHAR 2,5 KG*4","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0164.png"},"EDT-0168":{"name":"F\u0130NE FOOD ENG\u0130NAR 5-7 CM 4*50","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0168.png"},"EDT-0169":{"name":"F\u0130NE FOOD SEBZE M\u0130X 4*2,5 KG","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0169.png"},"EDT-0035":{"name":"F\u0130NE FOOD PATATES 9*18 2,5 KG*6 (15 KG) SAPPH\u0130RE","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0035.png"},"EDT-0018":{"name":"GOLDEN FRIES DONUK PATATES 7*7 (2,5*5) 12,50 KG","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0018.jpg"},"EDT-0020":{"name":"GOLDEN FRIES DONUK PATATES 9*18 (2,5*5) 12,50 KG","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0020.jpg"},"EDT-0019":{"name":"GOLDEN FRIES DONUK PATATES 9*9 (2,5*5) 12,50 KG","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0019.jpg"},"EDT-0480":{"name":"NAMET DANA JAMBON D\u0130L\u0130ML\u0130 300 GR*24","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0480.png"},"EDT-0486":{"name":"NAMET SUCUK DANA 500 GR D\u0130L\u0130ML\u0130*8","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0486.png"},"EDT-0431":{"name":"S\u00dcTA\u015e KAYMAKSIZ YO\u011eURT Y.Y 5 KG","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0431.png"},"EDT-0432":{"name":"S\u00dcTA\u015e KAYMAKSIZ YO\u011eURT Y.YA\u011eLI 10 KG ED","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0432.png"},"EDT-0433":{"name":"S\u00dcTA\u015e YO\u011eURT S\u00dcZME 10 KG","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0433.jpg"},"EDT-0406":{"name":"AY\u00c7A LOR PEYN\u0130R\u0130 1000 GR","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0406.png"},"EDT-0395":{"name":"BAH\u00c7IVAN MOZARELLA RENDE K\u00dcP 2 KG * 6","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0395.png"},"EDT-0402":{"name":"ATASOY \u00c7E\u00c7\u0130L PEYN\u0130R\u0130 2,5 KG*4 ADET","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0402.png"},"EDT-0026":{"name":"S\u00dcPERFRESH PATATES CATERING 9*9 (2,5 KG*5)","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0026.png"},"EDT-0024":{"name":"MERPAT DONUK PATATES 7*7 (2,5 KG*4) 10 KG","brand":"","amount":"Kg","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0024.png"},"EDT-0429":{"name":"ATE\u015eO\u011eLU YO\u011eURT 10 KG Y.YA\u011eLI","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0429.png"},"EDT-0428":{"name":"ATE\u015eO\u011eLU YO\u011eURT 5 KG S\u00dcZME","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0428.png"},"EDT-0430":{"name":"ATE\u015eO\u011eLU YO\u011eURT 5 KG Y.YA\u011eLI NATUREL","brand":"","amount":"Ad.","package":"","image":"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/b1408866079633e0d05e119ab3d4fccff7a76ece/okyonus-edt-worker/assets/storefront/verified-products/EDT-0430.png"}}); // __VERIFIED_PRODUCT_IMAGES__
function adminProductImage(product){
 if(!product||product.image_url===""||product.image===""||product.imageUrl==="")return "";
 const current=product.image_url||product.image||product.imageUrl;
 if(current&&!/\/seafood-[a-z-]+\.svg(?:\?|$)/i.test(String(current)))return String(current);
 const entry=VERIFIED_PRODUCT_IMAGES[String(product.source_product_id||product.id||"")];
 const normalize=v=>String(v||"").normalize("NFC").trim().toLocaleLowerCase("tr-TR").replace(/\s+/g," ");
 if(!entry||normalize(product.name)!==normalize(entry.name))return "";
 const brand=product.brand_name||product.brand;
 if(brand&&entry.brand&&normalize(brand)!==normalize(entry.brand))return "";
 const expected=[entry.amount,entry.package].filter(Boolean).join(" \u2022 ");
 const actual=product.package_text??[product.amount,product.package].filter(Boolean).join(" \u2022 ");
 if(normalize(expected)!==normalize(actual))return "";
 return entry.image;
}
function j(data,status=200,headers={}){const h=new Headers(headers);h.set("content-type","application/json; charset=utf-8");h.set("cache-control","no-store");return new Response(JSON.stringify(data),{status,headers:h})}
function page(body,headers={}){const h=new Headers(headers);h.set("content-type","text/html; charset=utf-8");h.set("cache-control","no-store");return new Response(body,{status:200,headers:h})}
function clean(v,n=500){return String(v==null?"":v).trim().slice(0,n)}
function canWrite(auth){return auth?.user?.role==="owner"}
const SEO_ROUTES=["/edt-restoran-gida-tedarikcisi","/edt-horeca-gida-tedarikcisi","/edt-profesyonel-mutfak-tedarikcisi","/edt-toptan-gida-tedarikcisi","/edt-otel-gida-tedarikcisi","/edt-kafe-gida-tedarikcisi","/edt-lokanta-gida-tedarikcisi","/edt-bufe-gida-tedarikcisi","/edt-catering-gida-tedarikcisi","/edt-endustriyel-mutfak-tedarikcisi","/edt-restoran-urunleri","/edt-kafe-urunleri","/edt-otel-mutfak-urunleri","/edt-catering-urunleri","/edt-profesyonel-mutfak-urunleri","/edt-horeca-urunleri","/edt-toptan-mutfak-urunleri","/edt-isletme-gida-urunleri","/edt-restoran-satin-alma","/edt-horeca-satin-alma","/edt-deniz-urunleri-tedarikcisi","/edt-toptan-deniz-urunleri","/edt-restoran-deniz-urunleri","/edt-horeca-deniz-urunleri","/edt-donuk-deniz-urunleri","/edt-balik-tedarikcisi","/edt-toptan-balik-tedarikcisi","/edt-restoran-balik-tedarikcisi","/edt-profesyonel-mutfak-balik","/edt-deniz-urunleri-teklif","/edt-et-urunleri-tedarikcisi","/edt-toptan-et-urunleri","/edt-restoran-et-tedarikcisi","/edt-horeca-et-tedarikcisi","/edt-dana-eti-tedarikcisi","/edt-kirmizi-et-tedarikcisi","/edt-profesyonel-mutfak-et","/edt-otel-et-tedarikcisi","/edt-catering-et-tedarikcisi","/edt-et-urunleri-teklif","/edt-tavuk-urunleri-tedarikcisi","/edt-toptan-tavuk-urunleri","/edt-restoran-tavuk-tedarikcisi","/edt-horeca-tavuk-tedarikcisi","/edt-kanatli-urunleri-tedarikcisi","/edt-profesyonel-mutfak-tavuk","/edt-otel-tavuk-tedarikcisi","/edt-catering-tavuk-tedarikcisi","/edt-donuk-tavuk-urunleri","/edt-tavuk-urunleri-teklif","/edt-donuk-gida-tedarikcisi","/edt-toptan-donuk-gida","/edt-restoran-donuk-gida","/edt-horeca-donuk-gida","/edt-donuk-patates-tedarikcisi","/edt-patates-urunleri-tedarikcisi","/edt-restoran-patates-tedarikcisi","/edt-horeca-patates-tedarikcisi","/edt-profesyonel-mutfak-donuk-urunler","/edt-donuk-urunler-teklif","/edt-bakliyat-tedarikcisi","/edt-toptan-bakliyat","/edt-restoran-bakliyat","/edt-horeca-bakliyat","/edt-mercimek-tedarikcisi","/edt-nohut-tedarikcisi","/edt-kuru-fasulye-tedarikcisi","/edt-bulgur-tedarikcisi","/edt-pirinc-tedarikcisi","/edt-profesyonel-mutfak-bakliyat","/edt-yag-tedarikcisi","/edt-toptan-yag-tedarikcisi","/edt-restoran-yag-tedarikcisi","/edt-horeca-yag-tedarikcisi","/edt-aycicek-yagi-tedarikcisi","/edt-zeytinyagi-tedarikcisi","/edt-kizartmalik-yag-tedarikcisi","/edt-profesyonel-mutfak-yaglari","/edt-otel-mutfak-yaglari","/edt-yag-urunleri-teklif","/edt-sut-urunleri-tedarikcisi","/edt-toptan-sut-urunleri","/edt-restoran-sut-urunleri","/edt-horeca-sut-urunleri","/edt-peynir-tedarikcisi","/edt-tereyagi-tedarikcisi","/edt-krema-tedarikcisi","/edt-profesyonel-mutfak-sut-urunleri","/edt-otel-sut-urunleri","/edt-sut-urunleri-teklif","/edt-sos-tedarikcisi","/edt-toptan-sos","/edt-restoran-soslari","/edt-horeca-soslari","/edt-ketcap-tedarikcisi","/edt-mayonez-tedarikcisi","/edt-salca-tedarikcisi","/edt-konserve-tedarikcisi","/edt-ithal-gida-tedarikcisi","/edt-ithal-urunler-teklif","/restoran-icin-toptan-gida","/kafeler-icin-toptan-gida","/oteller-icin-toptan-gida","/catering-icin-toptan-gida","/lokantalar-icin-toptan-gida","/bufeler-icin-toptan-gida","/profesyonel-mutfak-icin-gida","/isletmeler-icin-toptan-gida","/horeca-icin-toptan-gida","/toplu-yemek-gida-tedariki","/restoran-urun-tedariki","/kafe-urun-tedariki","/otel-urun-tedariki","/catering-urun-tedariki","/lokanta-urun-tedariki","/bufe-urun-tedariki","/profesyonel-mutfak-urun-tedariki","/horeca-urun-tedariki","/isletme-urun-tedariki","/toplu-gida-urun-tedariki","/restoran-toplu-satin-alma","/kafe-toplu-satin-alma","/otel-toplu-satin-alma","/catering-toplu-satin-alma","/lokanta-toplu-satin-alma","/horeca-toplu-satin-alma","/profesyonel-mutfak-satin-alma","/isletme-satin-alma-listesi","/toplu-gida-satin-alma","/mutfak-satin-alma-urunleri","/restoran-teklif-al","/kafe-teklif-al","/otel-teklif-al","/catering-teklif-al","/lokanta-teklif-al","/horeca-teklif-al","/profesyonel-mutfak-teklif-al","/gida-urunleri-teklif-al","/toptan-gida-teklif-al","/isletme-urunleri-teklif-al","/deniz-urunleri-teklif-al","/balik-teklif-al","/et-urunleri-teklif-al","/dana-eti-teklif-al","/tavuk-urunleri-teklif-al","/kanatli-urunleri-teklif-al","/donuk-gida-teklif-al","/patates-urunleri-teklif-al","/bakliyat-teklif-al","/yag-urunleri-teklif-al","/sut-urunleri-teklif-al","/peynir-teklif-al","/tereyagi-teklif-al","/sos-urunleri-teklif-al","/ketcap-teklif-al","/mayonez-teklif-al","/salca-teklif-al","/konserve-teklif-al","/ithal-gida-teklif-al","/profesyonel-mutfak-urunleri-teklif-al","/istanbul-restoran-gida-tedariki","/istanbul-kafe-gida-tedariki","/istanbul-otel-gida-tedariki","/istanbul-catering-gida-tedariki","/istanbul-lokanta-gida-tedariki","/istanbul-bufe-gida-tedariki","/istanbul-profesyonel-mutfak-tedariki","/istanbul-toptan-gida-tedariki","/istanbul-isletme-gida-tedariki","/istanbul-toplu-yemek-tedariki","/istanbul-deniz-urunleri-tedarikcisi","/istanbul-balik-tedarikcisi","/istanbul-et-tedarikcisi","/istanbul-tavuk-tedarikcisi","/istanbul-donuk-gida-tedarikcisi","/istanbul-patates-tedarikcisi","/istanbul-bakliyat-tedarikcisi","/istanbul-yag-tedarikcisi","/istanbul-sut-urunleri-tedarikcisi","/istanbul-sos-tedarikcisi","/restoran-mutfak-tedariki","/otel-mutfak-tedariki","/kafe-mutfak-tedariki","/catering-mutfak-tedariki","/lokanta-mutfak-tedariki","/endustriyel-mutfak-gida-tedariki","/profesyonel-mutfak-gida-urunleri","/horeca-mutfak-urunleri","/toplu-tuketim-gida-urunleri","/toplu-tuketim-tedarikcisi","/restoran-haftalik-gida-tedariki","/restoran-toplu-urun-teklifi","/otel-toplu-urun-teklifi","/kafe-toplu-urun-teklifi","/horeca-toplu-urun-teklifi","/profesyonel-mutfak-toplu-teklif","/isletmelere-gida-teklifi","/toplu-gida-fiyat-teklifi","/horeca-fiyat-teklifi","/profesyonel-mutfak-fiyat-teklifi"];
async function read(request){try{return await request.json()}catch{return {}}}
async function upsertProductMeta(env,productId,b){
 const old=await env.DB.prepare("SELECT * FROM oky_product_meta_v1 WHERE product_id=?").bind(productId).first();
 const pick=(k,alt,def="")=>Object.prototype.hasOwnProperty.call(b,k)?b[k]:(alt&&Object.prototype.hasOwnProperty.call(b,alt)?b[alt]:(old?.[def||k]??""));
 const brandId=clean(pick("brandId","brand_id","brand_id"),120)||null;
 const description=clean(pick("description",null,"description"),5000);
 const seoTitle=clean(pick("seoTitle","seo_title","seo_title"),220);
 const seoDescription=clean(pick("seoDescription","seo_description","seo_description"),500);
 const sortOrder=Object.prototype.hasOwnProperty.call(b,"sortOrder")?Number(b.sortOrder||0):Number(old?.sort_order||0);
 const featured=Object.prototype.hasOwnProperty.call(b,"featured")?(b.featured?1:0):Number(old?.featured||0);
 await env.DB.prepare(`INSERT INTO oky_product_meta_v1(product_id,brand_id,description,seo_title,seo_description,sort_order,featured,updated_at)
 VALUES(?,?,?,?,?,?,?,datetime('now'))
 ON CONFLICT(product_id) DO UPDATE SET brand_id=excluded.brand_id,description=excluded.description,seo_title=excluded.seo_title,seo_description=excluded.seo_description,sort_order=excluded.sort_order,featured=excluded.featured,updated_at=datetime('now')`)
 .bind(productId,brandId,description,seoTitle,seoDescription,sortOrder,featured).run();
}

async function upsertProductCommerce(env,productId,b){
 const old=await env.DB.prepare("SELECT * FROM oky_product_commerce_v1 WHERE product_id=?").bind(productId).first();
 const has=k=>Object.prototype.hasOwnProperty.call(b,k);
 const txt=(k,db,n=500)=>clean(has(k)?b[k]:(old?.[db]??""),n);
 const num=(k,db,def=null)=>has(k)?(b[k]===""||b[k]==null?null:Number(b[k])):(old?.[db]??def);
 const flag=(k,db)=>has(k)?(b[k]?1:0):Number(old?.[db]||0);
 const sku=txt("sku","sku",120),barcode=txt("barcode","barcode",120),subcategory=txt("subcategory","subcategory",180),origin=txt("origin","origin",180),storage=txt("storageConditions","storage_conditions",1000);
 const cold=flag("coldChain","cold_chain"),minOrder=Math.max(0.001,Number(num("minOrderQty","min_order_qty",1)||1)),step=Math.max(0.001,Number(num("qtyStep","qty_step",1)||1));
 const listPrice=num("listPrice","list_price",null),salePrice=num("salePrice","sale_price",null),newUntil=txt("newUntil","new_until",80)||null,best=flag("bestSeller","best_seller");
 if(listPrice!=null&&!Number.isFinite(listPrice))throw new Error("INVALID_LIST_PRICE");
 if(salePrice!=null&&!Number.isFinite(salePrice))throw new Error("INVALID_SALE_PRICE");
 await env.DB.prepare(`INSERT INTO oky_product_commerce_v1(product_id,sku,barcode,subcategory,origin,storage_conditions,cold_chain,min_order_qty,qty_step,list_price,sale_price,new_until,best_seller,updated_at)
 VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))
 ON CONFLICT(product_id) DO UPDATE SET sku=excluded.sku,barcode=excluded.barcode,subcategory=excluded.subcategory,origin=excluded.origin,storage_conditions=excluded.storage_conditions,cold_chain=excluded.cold_chain,min_order_qty=excluded.min_order_qty,qty_step=excluded.qty_step,list_price=excluded.list_price,sale_price=excluded.sale_price,new_until=excluded.new_until,best_seller=excluded.best_seller,updated_at=datetime('now')`)
 .bind(productId,sku||null,barcode||null,subcategory||null,origin||null,storage||null,cold,minOrder,step,listPrice,salePrice,newUntil,best).run();
}

async function ensure(env){
 if(!env?.DB) throw new Error("D1_DB_BINDING_MISSING");
 await env.DB.prepare("CREATE TABLE IF NOT EXISTS oky_schema_meta_v1(key TEXT PRIMARY KEY,value TEXT,updated_at TEXT NOT NULL DEFAULT (datetime('now')))").run();
 const schemaKey="commerce-admin-v25-price-parity-2026-10-01";
 const ready=await env.DB.prepare("SELECT value FROM oky_schema_meta_v1 WHERE key=?").bind(schemaKey).first();
 if(ready?.value==="ready") return;
 const q=[
 `CREATE TABLE IF NOT EXISTS b2b_products_v1(id TEXT PRIMARY KEY,source_product_id TEXT,name TEXT NOT NULL,category TEXT NOT NULL,unit TEXT NOT NULL DEFAULT 'Adet',package_text TEXT,image_url TEXT,stock_status TEXT NOT NULL DEFAULT 'ORDER',active INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE INDEX IF NOT EXISTS idx_b2b_products_v1_source ON b2b_products_v1(source_product_id)`,
 `CREATE TABLE IF NOT EXISTS b2b_prices_v1(id TEXT PRIMARY KEY,product_id TEXT NOT NULL,price REAL NOT NULL,currency TEXT NOT NULL DEFAULT 'TRY',active INTEGER NOT NULL DEFAULT 1,valid_from TEXT NOT NULL DEFAULT (datetime('now')),valid_until TEXT,created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE INDEX IF NOT EXISTS idx_b2b_prices_v1_product ON b2b_prices_v1(product_id,active,valid_from)`,
 `CREATE TABLE IF NOT EXISTS b2b_price_history_v1(id TEXT PRIMARY KEY,product_id TEXT NOT NULL,old_price REAL,new_price REAL,actor TEXT,created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE TABLE IF NOT EXISTS oky_storefront_categories_v1(id TEXT PRIMARY KEY,parent_id TEXT,name TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,image_url TEXT,icon TEXT,description TEXT,sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,seo_title TEXT,seo_description TEXT,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE TABLE IF NOT EXISTS oky_storefront_banners_v1(id TEXT PRIMARY KEY,title TEXT NOT NULL,subtitle TEXT,desktop_image TEXT,mobile_image TEXT,cta_text TEXT,cta_url TEXT,start_at TEXT,end_at TEXT,sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,audience TEXT NOT NULL DEFAULT 'ALL',device_target TEXT NOT NULL DEFAULT 'ALL',updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE TABLE IF NOT EXISTS oky_storefront_sections_v1(id TEXT PRIMARY KEY,title TEXT NOT NULL,kind TEXT NOT NULL,source TEXT,image_url TEXT,payload_json TEXT NOT NULL DEFAULT '{}',sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE TABLE IF NOT EXISTS oky_help_articles_v1(id TEXT PRIMARY KEY,title TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,category TEXT NOT NULL DEFAULT 'GENEL',body TEXT NOT NULL,sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE TABLE IF NOT EXISTS oky_storefront_settings_v1(key TEXT PRIMARY KEY,value TEXT,updated_by TEXT,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE TABLE IF NOT EXISTS oky_brands_v1(id TEXT PRIMARY KEY,name TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,logo_url TEXT,description TEXT,sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`
,
 `CREATE TABLE IF NOT EXISTS oky_campaigns_v1(id TEXT PRIMARY KEY,title TEXT NOT NULL,description TEXT,image_url TEXT,cta_text TEXT,cta_url TEXT,start_at TEXT,end_at TEXT,priority INTEGER NOT NULL DEFAULT 0,sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`
,
 `CREATE TABLE IF NOT EXISTS oky_delivery_rules_v1(id TEXT PRIMARY KEY,region TEXT NOT NULL DEFAULT '\u0130stanbul',district TEXT,min_order REAL,fee REAL,free_threshold REAL,cutoff TEXT,delivery_days TEXT,cold_chain INTEGER NOT NULL DEFAULT 1,sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`
,
 `CREATE TABLE IF NOT EXISTS oky_media_assets_v1(id TEXT PRIMARY KEY,name TEXT NOT NULL,url TEXT NOT NULL,kind TEXT NOT NULL DEFAULT 'product',alt_text TEXT,tags TEXT,sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE TABLE IF NOT EXISTS oky_product_meta_v1(product_id TEXT PRIMARY KEY,brand_id TEXT,description TEXT,seo_title TEXT,seo_description TEXT,sort_order INTEGER NOT NULL DEFAULT 0,featured INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE TABLE IF NOT EXISTS oky_product_commerce_v1(product_id TEXT PRIMARY KEY,sku TEXT,barcode TEXT,subcategory TEXT,origin TEXT,storage_conditions TEXT,cold_chain INTEGER NOT NULL DEFAULT 0,min_order_qty REAL NOT NULL DEFAULT 1,qty_step REAL NOT NULL DEFAULT 1,list_price REAL,sale_price REAL,new_until TEXT,best_seller INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE TABLE IF NOT EXISTS oky_seo_links_v1(id TEXT PRIMARY KEY,path TEXT NOT NULL UNIQUE,label TEXT NOT NULL,group_name TEXT NOT NULL DEFAULT 'EDT Rehberi',sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE TABLE IF NOT EXISTS oky_campaign_rules_v1(id TEXT PRIMARY KEY,campaign_id TEXT NOT NULL,campaign_type TEXT NOT NULL DEFAULT 'product_discount',target_type TEXT NOT NULL DEFAULT 'PRODUCT',target_value TEXT,discount_type TEXT NOT NULL DEFAULT 'PERCENT',discount_value REAL NOT NULL DEFAULT 0,min_cart REAL,customer_segment TEXT,delivery_zone TEXT,combinable INTEGER NOT NULL DEFAULT 0,sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE TABLE IF NOT EXISTS oky_newsletter_subscribers_v1(id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE,name TEXT,consent_version TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'ACTIVE',created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`
 ];
 if(typeof env.DB.batch==="function") await env.DB.batch(q.map(s=>env.DB.prepare(s)));
 else for(const s of q) await env.DB.prepare(s).run();
 const ensureColumn=async(table,column,definition)=>{
  const cols=(await env.DB.prepare("PRAGMA table_info("+table+")").all()).results||[];
  if(!cols.some(x=>x.name===column)) await env.DB.prepare("ALTER TABLE "+table+" ADD COLUMN "+column+" "+definition).run();
 };
 await ensureColumn("oky_storefront_sections_v1","image_url","TEXT");
 await ensureColumn("oky_campaigns_v1","image_url","TEXT");
 await ensureColumn("b2b_prices_v1","valid_until","TEXT");
 await ensureColumn("b2b_prices_v1","created_at","TEXT");
 await env.DB.prepare("UPDATE b2b_prices_v1 SET created_at=valid_from WHERE created_at IS NULL").run();
 // Upgrade existing installations without re-seeding deleted products or restoring removed images.
 const prior=await env.DB.prepare("SELECT value FROM oky_schema_meta_v1 WHERE key LIKE 'commerce-admin-%' AND value='ready' LIMIT 1").first();
 if(prior){await env.DB.prepare("INSERT INTO oky_schema_meta_v1(key,value,updated_at) VALUES(?, 'ready', datetime('now')) ON CONFLICT(key) DO UPDATE SET value='ready',updated_at=datetime('now')").bind(schemaKey).run();return;}
 const cats=[
 ["deniz-urunleri","Deniz \u00dcr\u00fcnleri","\ud83d\udc1f","https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/aa44f1cddbfe31ac67a37c8766b2fd4f92b89510/okyonus-edt-worker/assets/storefront/cat-deniz-ai.webp"],
 ["donuk-urunler","Donuk \u00dcr\u00fcnler","\u2744","https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/aa44f1cddbfe31ac67a37c8766b2fd4f92b89510/okyonus-edt-worker/assets/storefront/cat-donuk-ai.webp"],
 ["et-kanatli","Et & Kanatl\u0131","\ud83e\udd69","https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/aa44f1cddbfe31ac67a37c8766b2fd4f92b89510/okyonus-edt-worker/assets/storefront/cat-et-ai.webp"],
 ["sut-sarkuteri","S\u00fct & \u015eark\u00fcteri","\ud83e\uddc0","https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/aa44f1cddbfe31ac67a37c8766b2fd4f92b89510/okyonus-edt-worker/assets/storefront/cat-sut-ai.webp"],
 ["yaglar","Ya\u011flar","\ud83e\uded7","https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/aa44f1cddbfe31ac67a37c8766b2fd4f92b89510/okyonus-edt-worker/assets/storefront/cat-yag-ai.webp"],
 ["soslar","Soslar","\ud83e\udd6b","https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/aa44f1cddbfe31ac67a37c8766b2fd4f92b89510/okyonus-edt-worker/assets/storefront/cat-sos-ai.webp"],
 ["kuru-gida","Kuru G\u0131da","\ud83c\udf3e","https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/aa44f1cddbfe31ac67a37c8766b2fd4f92b89510/okyonus-edt-worker/assets/storefront/cat-kuru-ai.webp"],
 ["baharat","Baharat","\u2726","https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/aa44f1cddbfe31ac67a37c8766b2fd4f92b89510/okyonus-edt-worker/assets/storefront/cat-baharat-ai.webp"]
 ];
 for(let i=0;i<cats.length;i++){
  await env.DB.prepare("INSERT OR IGNORE INTO oky_storefront_categories_v1(id,name,slug,image_url,icon,sort_order,active) VALUES(?,?,?,?,?,?,1)").bind(crypto.randomUUID(),cats[i][1],cats[i][0],cats[i][3],cats[i][2],i).run();
  await env.DB.prepare("UPDATE oky_storefront_categories_v1 SET image_url=? WHERE slug=? AND (image_url IS NULL OR trim(image_url)='' OR image_url LIKE '%/assets/storefront/cat-%.svg')").bind(cats[i][3],cats[i][0]).run();
 }
 const hasProducts=await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='b2b_products_v1'").first();
 const hasPrices=await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='b2b_prices_v1'").first();
 if(hasProducts&&hasPrices){
  const seafood=[["sea-gigas-u5-10","Gigas Kalamar T\u00fcp U5 %10 Glaze",285.66,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-kalamar.svg"],["sea-gigas-u5-30","Gigas Kalamar T\u00fcp U5 %30 Glaze",235.98,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-kalamar.svg"],["sea-halka-kalamar-30","Halka Kalamar %30 Glaze",316.71,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-kalamar.svg"],["sea-loligo-aa-u3","Loligo Kalamar AA U3",683.1,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-kalamar.svg"],["sea-loligo-aa-3-6","Loligo Kalamar AA 3/6",602.37,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-kalamar.svg"],["sea-loligo-aa-u2","Loligo Kalamar AA U2",695.52,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-kalamar.svg"],["sea-butun-kalamar-u5","B\u00fct\u00fcn Temiz Kalamar U5",738.99,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-kalamar.svg"],["sea-butun-kalamar-u10","B\u00fct\u00fcn Temiz Kalamar U10",614.79,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-kalamar.svg"],["sea-butun-kalamar-10-20","B\u00fct\u00fcn Temiz Kalamar 10/20",540.27,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-kalamar.svg"],["sea-et-karides-16-20-10","Et Karides 16/20 Kuyruklu %10 Glaze",658.26,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-karides.svg"],["sea-et-karides-21-25-10","Et Karides 21/25 Kuyruklu %10 Glaze",621,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-karides.svg"],["sea-et-karides-31-40-10","Et Karides 31/40 Kuyruklu %10 Glaze",534.06,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-karides.svg"],["sea-et-karides-41-50-10","Et Karides 41/50 Kuyruklu %10 Glaze",509.22,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-karides.svg"],["sea-et-karides-16-20-30","Et Karides 16/20 %30 Glaze",471.96,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-karides.svg"],["sea-et-karides-21-25-30","Et Karides 21/25 %30 Glaze",447.12,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-karides.svg"],["sea-et-karides-31-40-30","Et Karides 31/40 %30 Glaze",422.28,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-karides.svg"],["sea-et-karides-41-50-30","Et Karides 41/50 %30 Glaze",397.44,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-karides.svg"],["sea-et-karides-51-60-30","Et Karides 51/60 %30 Glaze",378.81,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-karides.svg"],["sea-black-tiger-8-12","Black Tiger Karides 8/12",683.1,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-black-tiger.svg"],["sea-black-tiger-16-20","Black Tiger Karides 16/20",471.96,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-black-tiger.svg"],["sea-pangasius-fileto","Pangasius Fileto 4'l\u00fc %10 Glaze",242.19,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-balik.svg"],["sea-unagi-13-15","Unagi 13-15 oz",1738.8,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-unagi.svg"],["sea-ahtapot-2-3","Ahtapot 2/3",943.92,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-ahtapot.svg"],["sea-ahtapot-3-5","Ahtapot 3/5",1012.23,"https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/storefront/seafood-ahtapot.svg"]];
  for(const x of seafood){
   let p=await env.DB.prepare("SELECT id,image_url FROM b2b_products_v1 WHERE source_product_id=? LIMIT 1").bind(x[0]).first();
   if(!p){const pid=crypto.randomUUID();await env.DB.prepare("INSERT INTO b2b_products_v1(id,source_product_id,name,category,unit,package_text,image_url,stock_status,active,updated_at) VALUES(?,?,?,?,?,?,?,?,1,datetime('now'))").bind(pid,x[0],x[1],"Deniz \u00dcr\u00fcnleri","Kg","Kg",x[3],"ORDER").run();p={id:pid,image_url:x[3]};}
   else if(p.image_url==null)await env.DB.prepare("UPDATE b2b_products_v1 SET image_url=?,updated_at=datetime('now') WHERE id=?").bind(x[3],p.id).run();
   const pr=await env.DB.prepare("SELECT id FROM b2b_prices_v1 WHERE product_id=? AND active=1 ORDER BY valid_from DESC LIMIT 1").bind(p.id).first();
   if(!pr)await env.DB.prepare("INSERT INTO b2b_prices_v1(id,product_id,price,currency,active) VALUES(?,?,?,?,1)").bind(crypto.randomUUID(),p.id,x[2],"TRY").run();
  }
 }
 const seoGroups=["HORECA & \u0130\u015fletme","\u00dcr\u00fcn & Kategori","\u0130stanbul & Tedarik","EDT Rehberi"];
 const seoStatements=SEO_ROUTES.map((path,i)=>{
  const label=path.replace(/^\//,"").split("-").map(x=>x==="edt"?"EDT":x.charAt(0).toLocaleUpperCase("tr-TR")+x.slice(1)).join(" ");
  return env.DB.prepare("INSERT OR IGNORE INTO oky_seo_links_v1(id,path,label,group_name,sort_order,active) VALUES(?,?,?,?,?,1)").bind(crypto.randomUUID(),path,label,seoGroups[Math.min(3,Math.floor(i/50))],i);
 });
 if(typeof env.DB.batch==="function"){
  for(let i=0;i<seoStatements.length;i+=50) await env.DB.batch(seoStatements.slice(i,i+50));
 }else{
  for(const st of seoStatements) await st.run();
 }
 await env.DB.prepare("INSERT INTO oky_schema_meta_v1(key,value,updated_at) VALUES(?, 'ready', datetime('now')) ON CONFLICT(key) DO UPDATE SET value='ready',updated_at=datetime('now')").bind(schemaKey).run();

}

async function commerceAdminApi(request,env,auth,headers){
 await ensure(env);const u=new URL(request.url),p=u.pathname.split("/").filter(Boolean),resource=p[2],id=p[3];
 const tables={categories:"oky_storefront_categories_v1",banners:"oky_storefront_banners_v1",sections:"oky_storefront_sections_v1",help:"oky_help_articles_v1",brands:"oky_brands_v1",campaigns:"oky_campaigns_v1",delivery:"oky_delivery_rules_v1",media:"oky_media_assets_v1",seo:"oky_seo_links_v1","campaign-rules":"oky_campaign_rules_v1"};
 if(resource==="product-featured"&&id){
  if(!canWrite(auth))return j({ok:false,error:"OWNER_ONLY"},403,headers);
  if(request.method!=="POST")return j({ok:false,error:"METHOD_NOT_ALLOWED"},405,headers);
  if(!await env.DB.prepare("SELECT id FROM b2b_products_v1 WHERE id=?").bind(id).first())return j({ok:false,error:"PRODUCT_NOT_FOUND"},404,headers);
  const b=await read(request);await upsertProductMeta(env,id,{featured:b.featured===true});return j({ok:true},200,headers);
 }
 if(resource==="bulk-products"){
  if(!canWrite(auth))return j({ok:false,error:"OWNER_ONLY"},403,headers);
  if(request.method!=="POST")return j({ok:false,error:"METHOD_NOT_ALLOWED"},405,headers);
  const b=await read(request),items=b.items;
  if(!Array.isArray(items)||!items.length||items.length>500)return j({ok:false,error:"1\u2013500 sat\u0131r y\u00fckleyin."},400,headers);
  const seen=new Set(),errors=[],valid=[];
  for(let i=0;i<items.length;i++){
   const x=items[i];if(!x||typeof x!=="object"||Array.isArray(x)){errors.push({row:i+2,error:"Ge\u00e7ersiz \u00fcr\u00fcn sat\u0131r\u0131"});continue}const id=clean(x.id,120);let error="";
   if(!id||seen.has(id))error="\u00dcr\u00fcn kodu bo\u015f veya tekrarlanm\u0131\u015f";seen.add(id);
   const old=id?await env.DB.prepare("SELECT p.*,m.description,m.featured,(SELECT price FROM b2b_prices_v1 pr WHERE pr.product_id=p.id AND pr.active=1 ORDER BY valid_from DESC LIMIT 1) current_price FROM b2b_products_v1 p LEFT JOIN oky_product_meta_v1 m ON m.product_id=p.id WHERE p.id=?").bind(id).first():null;
   if(!old)error="\u00dcr\u00fcn kodu bulunamad\u0131";
   else if(clean(x.name,220)!==old.name)error="\u00dcr\u00fcn kodu ve ad\u0131 e\u015fle\u015fmiyor; g\u00fcncel tabloyu indirin";
   const price=String(x.price??"").trim()===""?null:Number(String(x.price).replace(",","."));
   if(price!==null&&(!Number.isFinite(price)||price<0))error="Fiyat s\u0131f\u0131r veya pozitif say\u0131 olmal\u0131";
   const image=clean(x.imageUrl,1500);if(image&&!/^https:\/\//i.test(image))error="G\u00f6rsel HTTPS adresi olmal\u0131";
   if(!["0","1"].includes(String(x.active))||!["0","1"].includes(String(x.featured)))error="Aktif ve anasayfa s\u00fctunlar\u0131 0 veya 1 olmal\u0131";
   if(error)errors.push({row:i+2,error});else valid.push({id,name:old.name,price,imageUrl:image,description:clean(x.description,5000),active:Number(x.active),featured:Number(x.featured),oldPrice:old.current_price??null});
  }
  if(errors.length)return j({ok:false,error:"Tablo kaydedilmedi. Hatal\u0131 sat\u0131rlar\u0131 d\u00fczeltin.",errors},400,headers);
  if(b.preview===true)return j({ok:true,data:valid,count:valid.length},200,headers);
  if(typeof env.DB.batch!=="function")return j({ok:false,error:"Toplu kay\u0131t i\u00e7in D1 batch gerekli."},503,headers);
  const statements=[];
  for(const x of valid){
   statements.push(env.DB.prepare("UPDATE b2b_products_v1 SET image_url=?,active=?,updated_at=datetime('now') WHERE id=?").bind(x.imageUrl,x.active,x.id));
   statements.push(env.DB.prepare("INSERT INTO oky_product_meta_v1(product_id,description,featured,updated_at) VALUES(?,?,?,datetime('now')) ON CONFLICT(product_id) DO UPDATE SET description=excluded.description,featured=excluded.featured,updated_at=datetime('now')").bind(x.id,x.description,x.featured));
   if(x.price!==null&&x.price!==x.oldPrice){
    statements.push(env.DB.prepare("UPDATE oky_product_commerce_v1 SET sale_price=NULL,updated_at=datetime('now') WHERE product_id=?").bind(x.id));
    statements.push(env.DB.prepare("UPDATE b2b_prices_v1 SET active=0 WHERE product_id=? AND active=1").bind(x.id));
    statements.push(env.DB.prepare("INSERT INTO b2b_prices_v1(id,product_id,price,currency,active) VALUES(?,?,?,'TRY',1)").bind(crypto.randomUUID(),x.id,x.price));
    statements.push(env.DB.prepare("INSERT INTO b2b_price_history_v1(id,product_id,old_price,new_price,actor) VALUES(?,?,?,?,?)").bind(crypto.randomUUID(),x.id,x.oldPrice,x.price,auth.user.id));
   }
  }
  await env.DB.batch(statements);return j({ok:true,updated:valid.length},200,headers);
 }
 if(resource==="summary"){
  const out={};for(const [k,t] of Object.entries(tables))out[k]=Number((await env.DB.prepare("SELECT COUNT(*) n FROM "+t).first())?.n||0);
  out.products=Number((await env.DB.prepare("SELECT COUNT(*) n FROM b2b_products_v1").first())?.n||0);
  out.settings=Number((await env.DB.prepare("SELECT COUNT(*) n FROM oky_storefront_settings_v1").first())?.n||0);out.newsletter=Number((await env.DB.prepare("SELECT COUNT(*) n FROM oky_newsletter_subscribers_v1 WHERE status=\'ACTIVE\'").first())?.n||0);
  return j({ok:true,data:out},200,headers);
 }
 if(resource==="newsletter"){
  if(request.method==="GET"){const rows=(await env.DB.prepare("SELECT id,email,name,consent_version,status,created_at,updated_at FROM oky_newsletter_subscribers_v1 ORDER BY updated_at DESC LIMIT 1000").all()).results||[];return j({ok:true,data:rows},200,headers)}
  if(!canWrite(auth))return j({ok:false,error:"READ_ONLY_ROLE"},403,headers);
  if(request.method==="DELETE"&&id){await env.DB.prepare("UPDATE oky_newsletter_subscribers_v1 SET status='UNSUBSCRIBED',updated_at=datetime('now') WHERE id=?").bind(id).run();return j({ok:true,id,status:"UNSUBSCRIBED"},200,headers)}
  return j({ok:false,error:"METHOD_NOT_ALLOWED"},405,headers);
 }
 if(resource==="settings"){
  if(request.method==="GET"){const rows=(await env.DB.prepare("SELECT key,value,updated_at FROM oky_storefront_settings_v1 ORDER BY key").all()).results||[];return j({ok:true,data:Object.fromEntries(rows.map(x=>[x.key,x.value])),rows},200,headers)}
  if(request.method!=="POST")return j({ok:false,error:"METHOD_NOT_ALLOWED"},405,headers);
  if(!canWrite(auth))return j({ok:false,error:"READ_ONLY_ROLE"},403,headers);
  const b=await read(request),allowed=["siteTitle","logoUrl","contactName","phone","whatsapp","secondContactName","secondPhone","secondWhatsapp","email","adminUrl","announcement","heroTitle","heroSubtitle","address","footerText","openingCampaignEnabled","openingCampaignImage","openingCampaignTitle","openingCampaignDescription","openingCampaignCtaText","openingCampaignCtaUrl","openingCampaignPhotoCtaText","openingCampaignPhotoCtaUrl"];
  if(Object.prototype.hasOwnProperty.call(b,'openingCampaignImage')){
   const image=String(b.openingCampaignImage??'').trim();
   if(image.length>8192)return j({ok:false,error:'IMAGE_URL_TOO_LONG'},400,headers);
   if(image&&!/^https:\/\//i.test(image)&&!/^\/(?!\/)/.test(image))return j({ok:false,error:'INVALID_IMAGE_URL'},400,headers);
  }
  for(const key of allowed)if(Object.prototype.hasOwnProperty.call(b,key))await env.DB.prepare("INSERT INTO oky_storefront_settings_v1(key,value,updated_by,updated_at) VALUES(?,?,?,datetime('now')) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_by=excluded.updated_by,updated_at=datetime('now')").bind(key,clean(b[key],key==="openingCampaignImage"?8192:key==="heroSubtitle"||key==="footerText"||key==="openingCampaignDescription"?1000:500),auth.user.id).run();
  return j({ok:true},200,headers);
 }
 if(resource==="legacy-catalog-sync"){
  if(request.method!=="POST")return j({ok:false,error:"METHOD_NOT_ALLOWED"},405,headers);
  if(!canWrite(auth))return j({ok:false,error:"READ_ONLY_ROLE"},403,headers);
  const origin=clean(env.PUBLIC_SITE_URL||"https://www.okyonusedt.com",500).replace(/\/$/,"");
  let payload;try{const rr=await fetch(origin+"/api/products",{headers:{accept:"application/json"}});if(!rr.ok)return j({ok:false,error:"LEGACY_CATALOG_FETCH_FAILED",status:rr.status},502,headers);payload=await rr.json()}catch{return j({ok:false,error:"LEGACY_CATALOG_FETCH_FAILED"},502,headers)}
  const items=Array.isArray(payload?.products)?payload.products.slice(0,1000):[];
  let created=0,updated=0,failed=0;
  for(const x of items){
    const sourceId=clean(x.id,120),name=clean(x.name,220);if(!sourceId||!name){failed++;continue}
    const txt=[x.category,x.masterCategory,x.subCategory,x.name].filter(Boolean).join(" ").toLocaleLowerCase("tr-TR");
    let category=clean(x.category,120)||"Di\u011fer \u00dcr\u00fcnler";
    if(/deniz|bal\u0131k|karides|kalamar|ahtapot|su \u00fcr\u00fcn/.test(txt))category="Deniz \u00dcr\u00fcnleri";
    else if(/donuk|patates|dondur/.test(txt))category="Donuk \u00dcr\u00fcnler";
    else if(/et|kanat|tavuk|pili\u00e7|k\u00f6fte|\u015fark\u00fcteri|sucuk|sosis/.test(txt))category="Et & \u015eark\u00fcteri";
    else if(/s\u00fct|peynir|krema|tereya\u011f|yo\u011furt/.test(txt))category="S\u00fct & \u015eark\u00fcteri";
    else if(/ya\u011f/.test(txt))category="Ya\u011flar";
    else if(/sos|ket\u00e7ap|mayonez|hardal|sirke/.test(txt))category="Soslar";
    else if(/baharat|\u00e7e\u015fni/.test(txt))category="Baharat";
    else if(/bakliyat|pirin\u00e7|bulgur|makarna|un|\u015feker|tuz|kuru/.test(txt))category="Kuru G\u0131da";
    const pack=[clean(x.amount,100),clean(x.package,100)].filter(Boolean).join(" \u2022 "),unit=/kg/i.test(pack)?"Kg":/litre|\bL\b/i.test(pack)?"Litre":"Adet";
    try{
      const row=await env.DB.prepare("SELECT id FROM b2b_products_v1 WHERE source_product_id=? LIMIT 1").bind(sourceId).first();
      if(row){await env.DB.prepare("UPDATE b2b_products_v1 SET name=?,category=?,unit=?,package_text=?,active=1,updated_at=datetime('now') WHERE id=?").bind(name,category,unit,pack,row.id).run();updated++}
      else{await env.DB.prepare("INSERT INTO b2b_products_v1(id,source_product_id,name,category,unit,package_text,image_url,stock_status,active,updated_at) VALUES(?,?,?,?,?,?,NULL,'ORDER',1,datetime('now'))").bind(crypto.randomUUID(),sourceId,name,category,unit,pack).run();created++}
    }catch{failed++}
  }
  return j({ok:true,source:origin,count:items.length,created,updated,failed},200,headers);
 }
 if(resource==="product-history"&&id&&request.method==="GET"){
  const rows=(await env.DB.prepare("SELECT old_price,new_price,actor,created_at FROM b2b_price_history_v1 WHERE product_id=? ORDER BY created_at DESC LIMIT 50").bind(id).all()).results||[];
  return j({ok:true,data:rows},200,headers);
 }
 if(resource==="catalog-import"){
  if(request.method!=="POST")return j({ok:false,error:"METHOD_NOT_ALLOWED"},405,headers);
  if(!canWrite(auth))return j({ok:false,error:"READ_ONLY_ROLE"},403,headers);
  const b=await read(request),items=Array.isArray(b.items)?b.items:[];
  if(!items.length||items.length>500)return j({ok:false,error:"INVALID_IMPORT_SIZE"},400,headers);
  let created=0,updated=0;const failed=[];
  for(let i=0;i<items.length;i++){
    const x=items[i]||{},name=clean(x.name,220),category=clean(x.category,120),unit=clean(x.unit,30)||"Adet",sourceId=clean(x.sourceProductId||x.source_product_id,120),hasImage=Object.prototype.hasOwnProperty.call(x,"imageUrl")||Object.prototype.hasOwnProperty.call(x,"image_url"),image=clean(Object.prototype.hasOwnProperty.call(x,"imageUrl")?x.imageUrl:x.image_url,1500);
    if(!name||!category){failed.push({index:i,error:"NAME_CATEGORY_REQUIRED"});continue}
    if(image&&!/^https:\/\//i.test(image)){failed.push({index:i,error:"INVALID_IMAGE_URL"});continue}
    try{
      let row=null;
      if(sourceId)row=await env.DB.prepare("SELECT * FROM b2b_products_v1 WHERE source_product_id=? LIMIT 1").bind(sourceId).first();
      if(!row)row=await env.DB.prepare("SELECT * FROM b2b_products_v1 WHERE name=? AND category=? LIMIT 1").bind(name,category).first();
      const id=row?.id||crypto.randomUUID();
      if(row){
        await env.DB.prepare("UPDATE b2b_products_v1 SET source_product_id=?,name=?,category=?,unit=?,package_text=?,image_url=?,stock_status=?,active=?,updated_at=datetime('now') WHERE id=?")
          .bind(sourceId||row.source_product_id||null,name,category,unit,clean(x.packageText||x.package_text,140),hasImage?image:row.image_url,clean(x.stockStatus||x.stock_status,30)||row.stock_status||"ORDER",x.active===false?0:1,id).run();
        updated++;
      }else{
        await env.DB.prepare("INSERT INTO b2b_products_v1(id,source_product_id,name,category,unit,package_text,image_url,stock_status,active,updated_at) VALUES(?,?,?,?,?,?,?,?,?,datetime('now'))")
          .bind(id,sourceId||null,name,category,unit,clean(x.packageText||x.package_text,140),hasImage?image:null,clean(x.stockStatus||x.stock_status,30)||"ORDER",x.active===false?0:1).run();
        created++;
      }
      await upsertProductMeta(env,id,x);
      await upsertProductCommerce(env,id,x);
      if(x.price!==undefined&&Number.isFinite(Number(x.price))){
        const current=await env.DB.prepare("SELECT price FROM b2b_prices_v1 WHERE product_id=? AND active=1 ORDER BY valid_from DESC LIMIT 1").bind(id).first();
        if(Number(current?.price)!==Number(x.price)){
          await env.DB.prepare("UPDATE b2b_prices_v1 SET active=0 WHERE product_id=? AND active=1").bind(id).run();
          await env.DB.prepare("INSERT INTO b2b_prices_v1(id,product_id,price,currency,active) VALUES(?,?,?,?,1)").bind(crypto.randomUUID(),id,Number(x.price),"TRY").run();
          await env.DB.prepare("INSERT INTO b2b_price_history_v1(id,product_id,old_price,new_price,actor) VALUES(?,?,?,?,?)").bind(crypto.randomUUID(),id,current?.price??null,Number(x.price),auth.user.id).run();
        }
      }
    }catch(e){failed.push({index:i,error:"IMPORT_ROW_FAILED"})}
  }
  return j({ok:failed.length===0,created,updated,failed},failed.length?207:200,headers);
 }
 if(resource==="products"){
  if(request.method==="GET"){const rows=(await env.DB.prepare(`SELECT p.*,
 (SELECT price FROM b2b_prices_v1 pr WHERE pr.product_id=p.id AND pr.active=1 ORDER BY valid_from DESC LIMIT 1) current_price,
 m.brand_id,m.description,m.seo_title,m.seo_description,m.sort_order,m.featured,
 pc.sku,pc.barcode,pc.subcategory,pc.origin,pc.storage_conditions,pc.cold_chain,pc.min_order_qty,pc.qty_step,pc.list_price,pc.sale_price,pc.new_until,pc.best_seller,
 (SELECT name FROM oky_brands_v1 b WHERE b.id=m.brand_id LIMIT 1) brand_name
 FROM b2b_products_v1 p LEFT JOIN oky_product_meta_v1 m ON m.product_id=p.id LEFT JOIN oky_product_commerce_v1 pc ON pc.product_id=p.id
 ORDER BY p.active DESC,m.featured DESC,pc.best_seller DESC,m.sort_order,p.name`).all()).results||[];return j({ok:true,data:rows.map(product=>({...product,image_url:adminProductImage(product)}))},200,headers)}
  if(!canWrite(auth))return j({ok:false,error:"READ_ONLY_ROLE"},403,headers);
  const b=await read(request);
  if(request.method==="DELETE"&&id){
    const old=await env.DB.prepare("SELECT id FROM b2b_products_v1 WHERE id=?").bind(id).first();
    if(!old)return j({ok:false,error:"PRODUCT_NOT_FOUND"},404,headers);
    await env.DB.prepare("UPDATE b2b_products_v1 SET active=0,updated_at=datetime('now') WHERE id=?").bind(id).run();
    await env.DB.prepare("UPDATE b2b_prices_v1 SET active=0 WHERE product_id=? AND active=1").bind(id).run();
    return j({ok:true,id,softDeleted:true},200,headers);
  }
  if(request.method==="POST"&&!id){
    const name=clean(b.name,220),category=clean(b.category,120),unit=clean(b.unit,30)||"Adet",image=clean(b.imageUrl,1500),rid=crypto.randomUUID();
    if(!name||!category)return j({ok:false,error:"NAME_CATEGORY_REQUIRED"},400,headers);
    if(image&&!/^https:\/\//i.test(image))return j({ok:false,error:"INVALID_IMAGE_URL"},400,headers);
    await env.DB.prepare("INSERT INTO b2b_products_v1(id,source_product_id,name,category,unit,package_text,image_url,stock_status,active,updated_at) VALUES(?,?,?,?,?,?,?,?,?,datetime('now'))")
      .bind(rid,null,name,category,unit,clean(b.packageText,140),Object.prototype.hasOwnProperty.call(b,"imageUrl")?image:null,clean(b.stockStatus,30)||"ORDER",b.active===false?0:1).run();
    await upsertProductMeta(env,rid,b);
    await upsertProductCommerce(env,rid,b);
    if(b.price!==undefined&&Number.isFinite(Number(b.price))){
      await env.DB.prepare("INSERT INTO b2b_prices_v1(id,product_id,price,currency,active) VALUES(?,?,?,?,1)").bind(crypto.randomUUID(),rid,Number(b.price),"TRY").run();
      await env.DB.prepare("INSERT INTO b2b_price_history_v1(id,product_id,old_price,new_price,actor) VALUES(?,?,?,?,?)").bind(crypto.randomUUID(),rid,null,Number(b.price),auth.user.id).run();
    }
    return j({ok:true,id:rid},201,headers);
  }
  if(request.method==="POST"&&id){
    const old=await env.DB.prepare("SELECT * FROM b2b_products_v1 WHERE id=?").bind(id).first();if(!old)return j({ok:false,error:"PRODUCT_NOT_FOUND"},404,headers);
    const image=Object.prototype.hasOwnProperty.call(b,"imageUrl")?clean(b.imageUrl,1500):old.image_url;if(image&&!/^https:\/\//i.test(image))return j({ok:false,error:"INVALID_IMAGE_URL"},400,headers);
    await env.DB.prepare("UPDATE b2b_products_v1 SET name=?,category=?,unit=?,package_text=?,image_url=?,stock_status=?,active=?,updated_at=datetime('now') WHERE id=?").bind(clean(b.name,220)||old.name,clean(b.category,120)||old.category,clean(b.unit,30)||old.unit,clean(b.packageText,140),image,clean(b.stockStatus,30)||old.stock_status,b.active===false?0:1,id).run();
    await upsertProductMeta(env,id,b);
    await upsertProductCommerce(env,id,b);
    if(b.price!==undefined&&Number.isFinite(Number(b.price))){
      const oldPrice=await env.DB.prepare("SELECT price FROM b2b_prices_v1 WHERE product_id=? AND active=1 ORDER BY valid_from DESC LIMIT 1").bind(id).first();
      await env.DB.prepare("UPDATE b2b_prices_v1 SET active=0 WHERE product_id=? AND active=1").bind(id).run();
      await env.DB.prepare("INSERT INTO b2b_prices_v1(id,product_id,price,currency,active) VALUES(?,?,?,?,1)").bind(crypto.randomUUID(),id,Number(b.price),"TRY").run();
      await env.DB.prepare("INSERT INTO b2b_price_history_v1(id,product_id,old_price,new_price,actor) VALUES(?,?,?,?,?)").bind(crypto.randomUUID(),id,oldPrice?.price??null,Number(b.price),auth.user.id).run();
    }
    return j({ok:true,id},200,headers);
  }
  return j({ok:false,error:"METHOD_NOT_ALLOWED"},405,headers);
 }
 const table=tables[resource];if(!table)return j({ok:false,error:"NOT_FOUND"},404,headers);
 if(request.method==="GET"){const rows=(await env.DB.prepare("SELECT * FROM "+table+" ORDER BY sort_order,rowid").all()).results||[];return j({ok:true,data:rows},200,headers)}
 if(!canWrite(auth))return j({ok:false,error:"READ_ONLY_ROLE"},403,headers);
 if(request.method==="DELETE"&&id){await env.DB.prepare("DELETE FROM "+table+" WHERE id=?").bind(id).run();return j({ok:true,id},200,headers)}
 if(request.method==="POST"){
  const b=await read(request),rid=id||crypto.randomUUID();
  if(resource==="categories"){await env.DB.prepare(`INSERT INTO oky_storefront_categories_v1(id,parent_id,name,slug,image_url,icon,description,sort_order,active,seo_title,seo_description,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET parent_id=excluded.parent_id,name=excluded.name,slug=excluded.slug,image_url=excluded.image_url,icon=excluded.icon,description=excluded.description,sort_order=excluded.sort_order,active=excluded.active,seo_title=excluded.seo_title,seo_description=excluded.seo_description,updated_at=datetime('now')`).bind(rid,clean(b.parentId,100)||null,clean(b.name,180),clean(b.slug,180),clean(b.imageUrl,1500)||null,clean(b.icon,20),clean(b.description,1200),Number(b.sortOrder||0),b.active===false?0:1,clean(b.seoTitle,220),clean(b.seoDescription,500)).run()}
  if(resource==="banners"){await env.DB.prepare(`INSERT INTO oky_storefront_banners_v1(id,title,subtitle,desktop_image,mobile_image,cta_text,cta_url,start_at,end_at,sort_order,active,audience,device_target,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET title=excluded.title,subtitle=excluded.subtitle,desktop_image=excluded.desktop_image,mobile_image=excluded.mobile_image,cta_text=excluded.cta_text,cta_url=excluded.cta_url,start_at=excluded.start_at,end_at=excluded.end_at,sort_order=excluded.sort_order,active=excluded.active,audience=excluded.audience,device_target=excluded.device_target,updated_at=datetime('now')`).bind(rid,clean(b.title,220),clean(b.subtitle,600),clean(b.desktopImage,1500)||null,clean(b.mobileImage,1500)||null,clean(b.ctaText,100),clean(b.ctaUrl,500),b.startAt||null,b.endAt||null,Number(b.sortOrder||0),b.active===false?0:1,clean(b.audience,50)||"ALL",clean(b.deviceTarget,20)||"ALL").run()}
  if(resource==="sections"){let payload={};if(b.payload&&typeof b.payload==="object")payload=b.payload;else if(b.payloadJson){try{payload=JSON.parse(String(b.payloadJson))}catch{return j({ok:false,error:"INVALID_SECTION_PAYLOAD_JSON"},400,headers)}}const imageUrl=clean(b.imageUrl,1500);if(imageUrl&&!/^https:\/\//i.test(imageUrl))return j({ok:false,error:"INVALID_IMAGE_URL"},400,headers);await env.DB.prepare(`INSERT INTO oky_storefront_sections_v1(id,title,kind,source,image_url,payload_json,sort_order,active,updated_at) VALUES(?,?,?,?,?,?,?,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET title=excluded.title,kind=excluded.kind,source=excluded.source,image_url=excluded.image_url,payload_json=excluded.payload_json,sort_order=excluded.sort_order,active=excluded.active,updated_at=datetime('now')`).bind(rid,clean(b.title,180),clean(b.kind,60),clean(b.source,100),imageUrl||null,JSON.stringify(payload),Number(b.sortOrder||0),b.active===false?0:1).run()}
  if(resource==="help"){await env.DB.prepare(`INSERT INTO oky_help_articles_v1(id,title,slug,category,body,sort_order,active,updated_at) VALUES(?,?,?,?,?,?,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET title=excluded.title,slug=excluded.slug,category=excluded.category,body=excluded.body,sort_order=excluded.sort_order,active=excluded.active,updated_at=datetime('now')`).bind(rid,clean(b.title,220),clean(b.slug,180),clean(b.category,80)||"GENEL",clean(b.body,20000),Number(b.sortOrder||0),b.active===false?0:1).run()}
  if(resource==="brands"){await env.DB.prepare("INSERT INTO oky_brands_v1(id,name,slug,logo_url,description,sort_order,active,updated_at) VALUES(?,?,?,?,?,?,?,datetime(\'now\')) ON CONFLICT(id) DO UPDATE SET name=excluded.name,slug=excluded.slug,logo_url=excluded.logo_url,description=excluded.description,sort_order=excluded.sort_order,active=excluded.active,updated_at=datetime(\'now\')").bind(rid,clean(b.name,180),clean(b.slug,180),clean(b.logoUrl,1500)||null,clean(b.description,2000),Number(b.sortOrder||0),b.active===false?0:1).run()}
  if(resource==="campaigns"){const imageUrl=clean(b.imageUrl,1500);if(imageUrl&&!/^https:\/\//i.test(imageUrl))return j({ok:false,error:"INVALID_IMAGE_URL"},400,headers);await env.DB.prepare("INSERT INTO oky_campaigns_v1(id,title,description,image_url,cta_text,cta_url,start_at,end_at,priority,sort_order,active,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,datetime(\'now\')) ON CONFLICT(id) DO UPDATE SET title=excluded.title,description=excluded.description,image_url=excluded.image_url,cta_text=excluded.cta_text,cta_url=excluded.cta_url,start_at=excluded.start_at,end_at=excluded.end_at,priority=excluded.priority,sort_order=excluded.sort_order,active=excluded.active,updated_at=datetime(\'now\')").bind(rid,clean(b.title,220),clean(b.description,2000),imageUrl||null,clean(b.ctaText,120),clean(b.ctaUrl,500),b.startAt||null,b.endAt||null,Number(b.priority||0),Number(b.sortOrder||0),b.active===false?0:1).run()}
  if(resource==="campaign-rules"){const campaignId=clean(b.campaignId,120),targetType=clean(b.targetType,30).toUpperCase()||"PRODUCT",discountType=clean(b.discountType,30).toUpperCase()||"PERCENT",discountValue=Number(b.discountValue||0);if(!campaignId)return j({ok:false,error:"CAMPAIGN_REQUIRED"},400,headers);if(!["PRODUCT","CATEGORY","BRAND","ALL"].includes(targetType))return j({ok:false,error:"INVALID_CAMPAIGN_TARGET"},400,headers);if(!["PERCENT","FIXED"].includes(discountType)||!Number.isFinite(discountValue)||discountValue<0)return j({ok:false,error:"INVALID_CAMPAIGN_DISCOUNT"},400,headers);await env.DB.prepare("INSERT INTO oky_campaign_rules_v1(id,campaign_id,campaign_type,target_type,target_value,discount_type,discount_value,min_cart,customer_segment,delivery_zone,combinable,sort_order,active,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET campaign_id=excluded.campaign_id,campaign_type=excluded.campaign_type,target_type=excluded.target_type,target_value=excluded.target_value,discount_type=excluded.discount_type,discount_value=excluded.discount_value,min_cart=excluded.min_cart,customer_segment=excluded.customer_segment,delivery_zone=excluded.delivery_zone,combinable=excluded.combinable,sort_order=excluded.sort_order,active=excluded.active,updated_at=datetime('now')").bind(rid,campaignId,clean(b.campaignType,50)||"product_discount",targetType,clean(b.targetValue,220)||null,discountType,discountValue,Number(b.minCart||0),clean(b.customerSegment,120)||null,clean(b.deliveryZone,120)||null,Number(b.combinable||0)?1:0,Number(b.sortOrder||0),b.active===false?0:1).run()}
  if(resource==="delivery"){await env.DB.prepare("INSERT INTO oky_delivery_rules_v1(id,region,district,min_order,fee,free_threshold,cutoff,delivery_days,cold_chain,sort_order,active,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,datetime(\'now\')) ON CONFLICT(id) DO UPDATE SET region=excluded.region,district=excluded.district,min_order=excluded.min_order,fee=excluded.fee,free_threshold=excluded.free_threshold,cutoff=excluded.cutoff,delivery_days=excluded.delivery_days,cold_chain=excluded.cold_chain,sort_order=excluded.sort_order,active=excluded.active,updated_at=datetime(\'now\')").bind(rid,clean(b.region,120)||"\u0130stanbul",clean(b.district,120)||null,Number(b.minOrder||0),Number(b.fee||0),Number(b.freeThreshold||0),clean(b.cutoff,20),clean(b.deliveryDays,120),b.coldChain===false?0:1,Number(b.sortOrder||0),b.active===false?0:1).run()}
  if(resource==="media"){const mediaUrl=clean(b.url,1500);if(!/^https:\/\//i.test(mediaUrl))return j({ok:false,error:"INVALID_MEDIA_URL"},400,headers);await env.DB.prepare("INSERT INTO oky_media_assets_v1(id,name,url,kind,alt_text,tags,sort_order,active,updated_at) VALUES(?,?,?,?,?,?,?,?,datetime(\'now\')) ON CONFLICT(id) DO UPDATE SET name=excluded.name,url=excluded.url,kind=excluded.kind,alt_text=excluded.alt_text,tags=excluded.tags,sort_order=excluded.sort_order,active=excluded.active,updated_at=datetime(\'now\')").bind(rid,clean(b.name,220),mediaUrl,clean(b.kind,50)||"product",clean(b.altText,500),clean(b.tags,500),Number(b.sortOrder||0),b.active===false?0:1).run()}
  if(resource==="seo"){const seoPath=clean(b.path,300).toLowerCase(),label=clean(b.label,300),groupName=clean(b.groupName,120)||"EDT Rehberi";if(!/^\/[a-z0-9-]+$/.test(seoPath))return j({ok:false,error:"INVALID_SEO_PATH"},400,headers);if(!label)return j({ok:false,error:"SEO_LABEL_REQUIRED"},400,headers);await env.DB.prepare("INSERT INTO oky_seo_links_v1(id,path,label,group_name,sort_order,active,updated_at) VALUES(?,?,?,?,?,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET path=excluded.path,label=excluded.label,group_name=excluded.group_name,sort_order=excluded.sort_order,active=excluded.active,updated_at=datetime('now')").bind(rid,seoPath,label,groupName,Number(b.sortOrder||0),b.active===false?0:1).run()}
  return j({ok:true,id:rid},id?200:201,headers);
 }
 return j({ok:false,error:"METHOD_NOT_ALLOWED"},405,headers);
}

function commerceAdminPage(headers={}){
return page(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ticaret Y\u00f6netimi | Okyanus EDT</title><style>*{box-sizing:border-box}body{margin:0;font-family:Arial;background:#f3f7fa;color:#0b3150}.top{padding:18px 22px;background:#fff;border-bottom:1px solid #dce8f0;display:flex;justify-content:space-between;align-items:center}.top h1{margin:0}.tabs{display:flex;gap:8px;overflow:auto;padding:12px 22px;background:#fff}.tabs button{border:1px solid #cfe0ea;background:#fff;border-radius:10px;padding:10px 14px;font-weight:800;cursor:pointer}.tabs button.active{background:#0768b2;color:#fff}.wrap{padding:22px}.stats{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.stat,.panel{background:#fff;border:1px solid #dce8f0;border-radius:15px;padding:16px}.stat b{font-size:28px;display:block}.panel{margin-top:14px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.form{display:grid;gap:8px}.form input,.form textarea,.form select{width:100%;padding:10px;border:1px solid #bfd2df;border-radius:9px}.form button{padding:11px;border:0;border-radius:9px;background:#0768b2;color:#fff;font-weight:800}.fieldBlock{display:grid;gap:5px}.fieldBlock>label{font-size:12px;font-weight:800;color:#234b69}.fieldHelp{font-size:11px;color:#627d90;line-height:1.35}.moduleInfo{background:#eef7fd;border:1px solid #cfe4f2;border-radius:12px;padding:12px;margin-bottom:12px;line-height:1.5}.imageEditor{display:grid;grid-template-columns:1fr auto;gap:7px;align-items:center}.imageEditor input[type=file]{grid-column:1/2;padding:7px;background:#fff}.imageEditor .uploadImage{background:#0b7a55}.imageEditor img{grid-column:1/-1;width:100%;max-width:280px;height:150px;object-fit:contain;border:1px solid #d7e5ee;border-radius:10px;background:#fff}.imageEditor .removeImage{background:#9d2635}.miniVisual{width:72px;height:52px;object-fit:cover;border-radius:8px;border:1px solid #dce8f0}.table{overflow:auto}.table table{border-collapse:collapse;width:100%;font-size:12px}.table th,.table td{padding:9px;border-bottom:1px solid #edf3f7;text-align:left}.table img{width:60px;height:45px;object-fit:cover;border-radius:6px}.tabs button,.form button,.table button{min-height:44px}.table button{margin:2px;padding:8px 10px;border:0;border-radius:8px;background:#0768b2;color:#fff;font-weight:800}.table{max-width:100%;-webkit-overflow-scrolling:touch}@media(max-width:800px){.top{padding:12px;gap:10px;align-items:flex-start;flex-direction:column}.tabs{padding:8px 12px}.stats{grid-template-columns:1fr 1fr}.grid{grid-template-columns:1fr}.wrap{padding:12px}.panel{padding:10px}.table table{min-width:760px}.form input,.form textarea,.form select{min-height:44px}}</style></head><body><header class="top"><h1>Ticaret Y\u00f6netimi</h1><a href="/">\u2190 Y\u00f6netici Ana Sayfa</a></header><nav class="tabs"><button data-r="opening" class="active">\u0130lk A\u00e7\u0131l\u0131\u015f Reklam\u0131</button><button data-r="products">\u00dcr\u00fcn & Fiyat</button><button data-r="bulk">Toplu \u00dcr\u00fcn Tablosu</button><button data-r="settings">Site Ayarlar\u0131</button><button data-r="categories">Kategoriler</button><button data-r="banners">Banner</button><button data-r="sections">Vitrin</button><button data-r="brands">Markalar</button><button data-r="campaigns">Kampanyalar</button><button data-r="campaign-rules">Kampanya Kurallar\u0131</button><button data-r="delivery">Teslimat</button><button data-r="media">Medya</button><button data-r="seo">SEO 200 Link</button><button data-r="newsletter">E-b\u00fclten</button><button data-r="help">Site Yard\u0131m</button></nav><main class="wrap"><div id="stats" class="stats"></div><section class="panel"><div id="content">Y\u00fckleniyor\u2026</div></section></main><script>
const root='/api/commerce-admin/';let current='opening';
const stats=document.getElementById('stats');
const content=document.getElementById('content');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function api(path,opt){const r=await fetch(root+path,{headers:{'content-type':'application/json','accept':'application/json','X-CSRF-Token':csrfToken()},credentials:'same-origin',...opt});const raw=await r.text();let j={};try{j=raw?JSON.parse(raw):{}}catch{throw Error('Y\u00f6netim API ge\u00e7ersiz yan\u0131t verdi: HTTP '+r.status)}if(!r.ok)throw Error((j.error||('Y\u00f6netim API hatas\u0131: HTTP '+r.status))+(Array.isArray(j.errors)?' '+j.errors.map(x=>'Sat\u0131r '+x.row+': '+x.error).join(' \u2022 '):''));return j}
async function summary(){const j=await api('summary');stats.innerHTML=Object.entries(j.data).map(([k,v])=>'<article class="stat"><b>'+v+'</b><span>'+esc(k)+'</span></article>').join('')}
function productForm(x={}){
 const img=esc(x.image_url||'');
 return '<div class="grid"><form class="form" id="pf"><h3>'+(x.id?'\u00dcr\u00fcn\u00fc D\u00fczenle':'Yeni \u00dcr\u00fcn Ekle')+'</h3>'+
 '<div class="moduleInfo"><b>\u00dcr\u00fcn kart\u0131 y\u00f6netimi</b><br>Burada girdi\u011finiz \u00fcr\u00fcn ad\u0131, kategori, g\u00f6rsel, paket, fiyat ve stok bilgileri vitrindeki \u00fcr\u00fcn kart\u0131n\u0131 olu\u015fturur. G\u00f6rsel URL\u2019sini Medya sekmesinden alabilir veya HTTPS ba\u011flant\u0131s\u0131 kullanabilirsiniz.</div>'+
 '<div class="fieldBlock"><label>\u00dcr\u00fcn Ad\u0131</label><input name="name" value="'+esc(x.name||'')+'" placeholder="\u00d6rn. Gigas Kalamar T\u00fcp U5" required></div>'+
 '<div class="fieldBlock"><label>SKU / \u00dcr\u00fcn Kodu</label><input name="sku" value="'+esc(x.sku||'')+'" placeholder="\u0130\u00e7 \u00fcr\u00fcn kodu"></div>'+
 '<div class="fieldBlock"><label>Barkod</label><input name="barcode" value="'+esc(x.barcode||'')+'" placeholder="Varsa barkod"></div>'+
 '<div class="fieldBlock"><label>Kategori</label><input name="category" value="'+esc(x.category||'')+'" placeholder="\u00d6rn. Deniz \u00dcr\u00fcnleri" required></div>'+
 '<div class="fieldBlock"><label>Alt Kategori</label><input name="subcategory" value="'+esc(x.subcategory||'')+'" placeholder="\u00d6rn. Kalamar"></div>'+
 '<div class="fieldBlock"><label>Sat\u0131\u015f Birimi</label><input name="unit" value="'+esc(x.unit||'Adet')+'" placeholder="Kg, Koli, Adet" required></div>'+
 '<div class="fieldBlock"><label>Paket / Gramaj</label><input name="packageText" value="'+esc(x.package_text||'')+'" placeholder="\u00d6rn. 4 x 2,5 kg"></div>'+
 '<div class="fieldBlock"><label>Minimum Sipari\u015f</label><input name="minOrderQty" type="number" step="0.001" min="0.001" value="'+esc(x.min_order_qty??1)+'"></div>'+
 '<div class="fieldBlock"><label>Miktar Art\u0131\u015f Ad\u0131m\u0131</label><input name="qtyStep" type="number" step="0.001" min="0.001" value="'+esc(x.qty_step??1)+'"></div>'+
 '<div class="fieldBlock"><label>\u00dcr\u00fcn G\u00f6rseli</label><div class="imageEditor" data-image-editor><input data-image-url name="imageUrl" value="'+img+'" placeholder="https://... \u00fcr\u00fcn g\u00f6rseli"><button type="button" class="removeImage" data-clear-image>G\u00f6rseli Kald\u0131r</button><input data-image-file type="file" accept="image/jpeg,image/png,image/webp"><button type="button" class="uploadImage" data-upload-image>G\u00f6rsel Y\u00fckle</button><img data-image-preview src="'+img+'" alt="\u00dcr\u00fcn g\u00f6rseli \u00f6nizleme" '+(img?'':'hidden')+'></div><small class="fieldHelp">Bilgisayardan JPEG/PNG/WebP y\u00fckleyebilir veya HTTPS ba\u011flant\u0131s\u0131 girebilirsiniz. En fazla 8 MB. Bo\u015f b\u0131rak\u0131p kaydederseniz mevcut g\u00f6rsel kald\u0131r\u0131l\u0131r.</small></div>'+
 '<div class="fieldBlock"><label>Ana Sat\u0131\u015f Fiyat\u0131 (TL)</label><input name="price" type="number" step="0.01" min="0" value="'+esc(x.current_price??'')+'" placeholder="\u00d6rn. 285,66"></div>'+
 '<div class="fieldBlock"><label>Liste / Eski Fiyat (TL)</label><input name="listPrice" type="number" step="0.01" min="0" value="'+esc(x.list_price??'')+'"></div>'+
 '<div class="fieldBlock"><label>\u0130ndirimli Fiyat (TL)</label><input name="salePrice" type="number" step="0.01" min="0" value="'+esc(x.sale_price??'')+'"></div>'+
 '<div class="fieldBlock"><label>Marka</label><input name="brandId" list="brandIds" value="'+esc(x.brand_id||'')+'" placeholder="Marka se\u00e7in"><datalist id="brandIds"></datalist></div>'+
 '<div class="fieldBlock"><label>\u00dcr\u00fcn A\u00e7\u0131klamas\u0131</label><textarea name="description" placeholder="K\u0131sa sat\u0131\u015f a\u00e7\u0131klamas\u0131">'+esc(x.description||'')+'</textarea></div>'+
 '<div class="fieldBlock"><label>Men\u015fei</label><input name="origin" value="'+esc(x.origin||'')+'" placeholder="\u00dcretim / men\u015fe bilgisi"></div>'+
 '<div class="fieldBlock"><label>Saklama Ko\u015fullar\u0131</label><textarea name="storageConditions" placeholder="\u00d6rn. -18 \u00b0C\u2019de muhafaza ediniz">'+esc(x.storage_conditions||'')+'</textarea></div>'+
 '<label><input type="checkbox" name="coldChain" '+(Number(x.cold_chain)===1?'checked':'')+' style="width:auto;display:inline-block;margin-right:8px">So\u011fuk zincir \u00fcr\u00fcn\u00fc</label>'+
 '<div class="fieldBlock"><label>Yeni \u00dcr\u00fcn Etiketi Biti\u015fi</label><input name="newUntil" type="datetime-local" value="'+esc((x.new_until||'').replace(' ','T').slice(0,16))+'"></div>'+
 '<label><input type="checkbox" name="bestSeller" '+(Number(x.best_seller)===1?'checked':'')+' style="width:auto;display:inline-block;margin-right:8px">\u00c7ok satan etiketi</label>'+
 '<div class="fieldBlock"><label>SEO Ba\u015fl\u0131\u011f\u0131</label><input name="seoTitle" value="'+esc(x.seo_title||'')+'" placeholder="Arama sonucu ba\u015fl\u0131\u011f\u0131"></div>'+
 '<div class="fieldBlock"><label>SEO A\u00e7\u0131klamas\u0131</label><textarea name="seoDescription" placeholder="Arama motoru a\u00e7\u0131klamas\u0131">'+esc(x.seo_description||'')+'</textarea></div>'+
 '<div class="fieldBlock"><label>Vitrin S\u0131ras\u0131</label><input name="sortOrder" type="number" value="'+esc(x.sort_order??0)+'"></div>'+
 '<label><input type="checkbox" name="featured" '+(Number(x.featured)===1?'checked':'')+' style="width:auto;display:inline-block;margin-right:8px">Anasayfada yay\u0131nla</label>'+
 '<div class="fieldBlock"><label>Stok Durumu</label><select name="stockStatus"><option value="'+esc(x.stock_status||'ORDER')+'">'+esc(x.stock_status||'ORDER')+'</option><option value="AVAILABLE">Stokta</option><option value="LIMITED">S\u0131n\u0131rl\u0131 stok</option><option value="ORDER">Sipari\u015fe uygun</option><option value="OUT">Stok d\u0131\u015f\u0131</option></select></div>'+
 '<label><input type="checkbox" name="active" '+(Number(x.active)!==0?'checked':'')+' style="width:auto;display:inline-block;margin-right:8px">\u00dcr\u00fcn aktif</label>'+
 '<div style="display:flex;gap:8px;flex-wrap:wrap"><button>\u00dcr\u00fcn\u00fc Kaydet</button>'+(x.id?'<button type="button" id="cancelProduct" style="background:#60778a">Vazge\u00e7</button>':'')+'</div></form>'+
 '<div><h3>\u00dcr\u00fcn Y\u00f6netimi Nas\u0131l \u00c7al\u0131\u015f\u0131r?</h3><p><b>G\u00f6rsel:</b> \u00fcr\u00fcn kart\u0131ndaki foto\u011fraf\u0131 belirler.</p><p><b>Fiyat:</b> ana fiyat\u0131 de\u011fi\u015ftirir ve fiyat ge\u00e7mi\u015fine kay\u0131t a\u00e7ar.</p><p><b>Etiketler:</b> \u00e7ok satan, yeni \u00fcr\u00fcn ve vitrin g\u00f6r\u00fcn\u00fcrl\u00fc\u011f\u00fcn\u00fc y\u00f6netir.</p><p><b>Pasife alma:</b> \u00fcr\u00fcn\u00fc silmez; sat\u0131\u015ftan ve aktif fiyat ak\u0131\u015f\u0131ndan \u00e7\u0131kar\u0131r.</p></div></div>';
}
function catalogImportUI(){return '<div class="panel" style="margin:0 0 14px"><h3>Katalog Y\u00f6netimi \u2022 Toplu Katalog \u0130\u00e7e Aktar</h3><p>Eski Okyanus \u00fcr\u00fcn havuzunu tek t\u0131kla y\u00f6netilebilir D1 \u00fcr\u00fcnlerine aktarabilirsiniz. En fazla 500 \u00fcr\u00fcn JSON ile ayr\u0131ca i\u00e7e al\u0131nabilir. Desteklenen alanlar: name, category, subcategory, sku, barcode, unit, packageText, imageUrl, price, listPrice, salePrice, brandId, description, origin, storageConditions, coldChain, minOrderQty, qtyStep, newUntil, bestSeller, seoTitle, seoDescription, featured ve sortOrder. Fiyat ve g\u00f6rsel uydurulmaz; y\u00f6netim panelinden siz belirlersiniz.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px"><button type="button" onclick="runLegacyCatalogSync()">Eski Okyanus Katalo\u011funu D1\u2019e Aktar</button><span id="legacySyncResult"></span></div><textarea id="catalogImportJson" style="width:100%;min-height:150px" placeholder=\\'[{"name":"Donuk Patates","category":"Donuk \u00dcr\u00fcnler","unit":"Koli","packageText":"4x2,5 kg","imageUrl":"https://...","stockStatus":"AVAILABLE","price":0}]\\'></textarea><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button type="button" onclick="runCatalogImport()">JSON \u0130\u00e7e Aktar</button><span id="catalogImportResult"></span></div></div>'}
function productUI(rows){return '<details><summary>Yeni \u00dcr\u00fcn Ekle</summary>'+productForm()+'</details><details><summary>Geli\u015fmi\u015f Katalog Aktar\u0131m\u0131</summary>'+catalogImportUI()+'</details>'+'<div class="moduleInfo" style="margin-top:14px"><b>Mevcut \u00dcr\u00fcnler</b><br>Her sat\u0131rdaki D\u00fczenle d\u00fc\u011fmesiyle \u00fcr\u00fcn kart\u0131n\u0131n g\u00f6rselini, fiyat\u0131n\u0131, etiketini ve stok bilgisini de\u011fi\u015ftirebilirsiniz.</div><div class="table"><table><thead><tr><th>Anasayfa</th><th>G\u00f6rsel</th><th>\u00dcr\u00fcn</th><th>Kategori</th><th>Paket</th><th>Ana Fiyat</th><th>\u0130ndirimli Fiyat</th><th>Stok</th><th>Durum</th><th>\u0130\u015flem</th></tr></thead><tbody>'+rows.map(x=>'<tr><td><input type="checkbox" aria-label="Anasayfada yay\u0131nla" '+(Number(x.featured)===1?'checked':'')+' data-featured-id="'+esc(x.id)+'"></td><td>'+(x.image_url?'<img class="miniVisual" src="'+esc(x.image_url)+'" alt="">':'G\u00f6rsel yok')+'</td><td>'+esc(x.name)+'</td><td>'+esc(x.category)+'</td><td>'+esc(x.package_text||'\u2014')+'</td><td>'+esc(x.current_price??'\u2014')+'</td><td>'+esc(x.sale_price??'\u2014')+'</td><td>'+esc(stockLabel(x.stock_status))+'</td><td>'+(Number(x.active)!==0?'Aktif':'Pasif')+'</td><td><button type="button" onclick="editProduct(\\''+esc(x.id)+'\\')">D\u00fczenle</button><button type="button" onclick="showPriceHistory(\\''+esc(x.id)+'\\')">Fiyat Ge\u00e7mi\u015fi</button><button type="button" onclick="disableProduct(\\''+esc(x.id)+'\\')" style="background:#9d2635">Pasife Al</button></td></tr>').join('')+'</tbody></table></div>'}
function bulkUI(){return '<h3>Toplu \u00dcr\u00fcn Tablosu</h3><p>1. CSV tabloyu indirin. 2. Excel veya LibreOffice ile fiyat, a\u00e7\u0131klama, g\u00f6rsel, aktif ve anasayfa s\u00fctunlar\u0131n\u0131 d\u00fczenleyin. \u00dcr\u00fcn kodu ve \u00fcr\u00fcn ad\u0131 de\u011fi\u015fmesin. 3. CSV olarak kaydedip y\u00fckleyin; \u00f6nizlemeyi kontrol ederek Kaydet deyin. Yeni fiyat, eski manuel indirimli fiyat\u0131 kald\u0131r\u0131r; kampanya kurallar\u0131 devam eder. Bo\u015f fiyat mevcut fiyat\u0131 korur; bo\u015f g\u00f6rsel g\u00f6rseli kald\u0131r\u0131r. Aktif / anasayfa: 1 evet, 0 hay\u0131r. Tek y\u00fckleme en fazla 500 sat\u0131rd\u0131r.</p><button id="bulkDownload">CSV Tablosunu \u0130ndir</button><p><label>G\u00fcncellenmi\u015f CSV <input id="bulkFile" type="file" accept=".csv,text/csv"></label></p><div id="bulkStatus" role="status"></div><div id="bulkPreview" class="table"></div><button id="bulkSave" disabled>De\u011fi\u015fiklikleri Kaydet</button>';}
function parseCsv(text){const rows=[];let row=[],v='',quoted=false;const delimiter=text.split('\\n')[0].includes(';')?';':',';text=text.replace(/^\\uFEFF/,'');for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){v+='"';i++}else quoted=!quoted;}else if(c===delimiter&&!quoted){row.push(v);v='';}else if((c==='\\n'||c==='\\r')&&!quoted){if(c==='\\r'&&text[i+1]==='\\n')i++;row.push(v);if(row.some(x=>x!==''))rows.push(row);row=[];v='';}else v+=c;}if(quoted)throw Error('CSV i\u00e7inde kapanmam\u0131\u015f t\u0131rnak var.');if(v||row.length){row.push(v);rows.push(row)}return rows;}
function csvCell(v){v=String(v??'');if(/^[=+@\\-]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"';}
function bindBulk(products){const keys=['id','name','price','description','imageUrl','active','featured'];let pending=null;const status=document.getElementById('bulkStatus'),save=document.getElementById('bulkSave');document.getElementById('bulkDownload').onclick=()=>{const rows=[keys,...products.map(x=>[x.id,x.name,x.current_price??'',x.description||'',x.image_url||'',Number(x.active)!==0?1:0,Number(x.featured)===1?1:0])];const blob=new Blob(['\\uFEFF'+rows.map(r=>r.map(csvCell).join(';')).join('\\r\\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='okyanus-urun-tablosu.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};document.getElementById('bulkFile').onchange=async e=>{pending=null;save.disabled=true;document.getElementById('bulkPreview').innerHTML='';try{const file=e.target.files[0];if(!file)return;if(file.size>4*1024*1024)throw Error('CSV en fazla 4 MB olabilir.');const rows=parseCsv(await file.text());if(rows[0]?.join('|')!==keys.join('|'))throw Error('S\u00fctun ba\u015fl\u0131klar\u0131 indirilen tabloyla ayn\u0131 olmal\u0131.');const items=rows.slice(1).map(r=>{if(r.length!==keys.length)throw Error('Eksik veya fazla s\u00fctun var.');return Object.fromEntries(keys.map((k,i)=>[k,r[i].replace(/^\\x27(?=[=+@\\-])/,'')]))});const out=await api('bulk-products',{method:'POST',body:JSON.stringify({items,preview:true})});pending=items;status.textContent=out.count+' \u00fcr\u00fcn do\u011fruland\u0131. Kaydet ile uygulan\u0131r.';document.getElementById('bulkPreview').innerHTML='<table><thead><tr><th>\u00dcr\u00fcn</th><th>Eski fiyat</th><th>Yeni fiyat</th><th>Aktif</th><th>Anasayfa</th></tr></thead><tbody>'+out.data.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+esc(x.oldPrice??'\u2014')+'</td><td>'+esc(x.price??'Korunur')+'</td><td>'+x.active+'</td><td>'+x.featured+'</td></tr>').join('')+'</tbody></table>';save.disabled=false;}catch(err){status.textContent=err.message}};save.onclick=async()=>{if(!pending)return;save.disabled=true;try{const out=await api('bulk-products',{method:'POST',body:JSON.stringify({items:pending})});pending=null;status.textContent=out.updated+' \u00fcr\u00fcn kaydedildi \u2713';await summary()}catch(err){status.textContent=err.message;save.disabled=false}};}

async function runLegacyCatalogSync(){
 const out=document.getElementById('legacySyncResult');if(!out)return;
 out.textContent='Eski katalog taran\u0131yor...';
 try{const j=await api('legacy-catalog-sync',{method:'POST',body:'{}'});out.textContent='Toplam: '+(j.count||0)+' \u2022 Yeni: '+(j.created||0)+' \u2022 G\u00fcncel: '+(j.updated||0)+' \u2022 Hatal\u0131: '+(j.failed||0);await load();await summary()}catch(e){out.textContent='Aktar\u0131m hatas\u0131: '+e.message}
}
function openingUI(x={}){
 const image=Object.prototype.hasOwnProperty.call(x,'openingCampaignImage')?x.openingCampaignImage:'https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/feature/okyanus-personal-commerce-2026-10-01/okyonus-edt-worker/assets/storefront/opening-post-2026-10-01.jpeg',enabled=!['false','0'].includes(String(x.openingCampaignEnabled??'true'));
 return '<div class="moduleInfo"><b>\u0130lk A\u00e7\u0131l\u0131\u015f Reklam\u0131</b><br>Ana sayfa ilk a\u00e7\u0131ld\u0131\u011f\u0131nda g\u00f6r\u00fcnen reklam\u0131 burada y\u00f6netin. Ziyaret\u00e7i kapatt\u0131\u011f\u0131nda ayn\u0131 taray\u0131c\u0131 oturumunda tekrar a\u00e7\u0131lmaz. G\u00f6rseli kald\u0131rmak i\u00e7in G\u00f6rseli Kald\u0131r d\u00fc\u011fmesine bas\u0131p kaydedin.</div><form class="form" id="openingForm"><div class="fieldBlock"><label>Reklam durumu</label><select name="openingCampaignEnabled"><option value="true" '+(enabled?'selected':'')+'>Aktif \u2014 ana sayfada g\u00f6ster</option><option value="false" '+(!enabled?'selected':'')+'>Pasif \u2014 g\u00f6sterme</option></select></div><div class="fieldBlock"><label>Reklam G\u00f6rseli</label><div class="imageEditor" data-image-editor><input data-image-url name="openingCampaignImage" value="'+esc(image)+'" placeholder="Varsay\u0131lan reklam g\u00f6rseli; de\u011fi\u015ftirmek i\u00e7in y\u00fckleyin"><button type="button" class="removeImage" data-clear-image>G\u00f6rseli Kald\u0131r</button><input data-image-file type="file" accept="image/jpeg,image/png,image/webp"><button type="button" class="uploadImage" data-upload-image>G\u00f6rsel Y\u00fckle / De\u011fi\u015ftir</button><img data-image-preview src="'+esc(image)+'" alt="A\u00e7\u0131l\u0131\u015f reklam\u0131 g\u00f6rsel \u00f6nizleme" '+(image?'':'hidden')+'></div><small class="fieldHelp">JPEG, PNG veya WebP; en fazla 8 MB. G\u00f6rsel kald\u0131rma kaydedildi\u011finde kal\u0131c\u0131d\u0131r.</small></div><label>Ba\u015fl\u0131k<input name="openingCampaignTitle" value="'+esc(x.openingCampaignTitle??'Okyanus EDT')+'"></label><label>A\u00e7\u0131klama<textarea name="openingCampaignDescription">'+esc(x.openingCampaignDescription??'Deniz \u00fcr\u00fcnleri, donuk \u00fcr\u00fcnler ve temel g\u0131dada \u00fcr\u00fcnlerinizi se\u00e7in, teklifinizi al\u0131n.')+'</textarea></label><label>Birinci d\u00fc\u011fme yaz\u0131s\u0131<input name="openingCampaignCtaText" value="'+esc(x.openingCampaignCtaText??'\u00dcr\u00fcn Se\u00e7 \u2022 Teklif Al')+'"></label><label>Birinci d\u00fc\u011fme ba\u011flant\u0131s\u0131<input name="openingCampaignCtaUrl" value="'+esc(x.openingCampaignCtaUrl??'/urunler')+'"></label><label>Foto\u011fraf d\u00fc\u011fmesi yaz\u0131s\u0131<input name="openingCampaignPhotoCtaText" value="'+esc(x.openingCampaignPhotoCtaText??'Listeni Foto\u011frafla G\u00f6nder')+'"></label><label>Foto\u011fraf d\u00fc\u011fmesi ba\u011flant\u0131s\u0131<input name="openingCampaignPhotoCtaUrl" value="'+esc(x.openingCampaignPhotoCtaUrl??'/fotografla-teklif')+'"></label><button type="submit">\u0130lk A\u00e7\u0131l\u0131\u015f Reklam\u0131n\u0131 Kaydet</button><div id="openingResult" role="status"></div></form>';
}
function bindOpening(x={}){
 const form=document.getElementById('openingForm'),out=document.getElementById('openingResult'),image=form.elements.openingCampaignImage;let imageTouched=Object.prototype.hasOwnProperty.call(x,'openingCampaignImage');
 image.addEventListener('input',()=>imageTouched=true);form.querySelector('[data-clear-image]').addEventListener('click',()=>imageTouched=true);bindImageEditors(form);
 form.onsubmit=async e=>{e.preventDefault();const b=Object.fromEntries(new FormData(form));if(!imageTouched)delete b.openingCampaignImage;const button=form.querySelector('[type="submit"]');button.disabled=true;out.textContent='Kaydediliyor\u2026';try{await api('settings',{method:'POST',body:JSON.stringify(b)});out.textContent='\u0130lk a\u00e7\u0131l\u0131\u015f reklam\u0131 kaydedildi \u2713';await summary()}catch(err){out.textContent=err.message}finally{button.disabled=false}};
}
function settingsUI(x={}){
 const d={siteTitle:'Okyanus EDT',logoUrl:'https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/main/okyonus-edt-worker/assets/okyanus-logo.webp',contactName:'Hasan Kaya',phone:'+90 532 346 99 25',whatsapp:'905323469925',secondContactName:'Orhan G\u00fcng\u00f6r',secondPhone:'+90 535 881 32 64',secondWhatsapp:'905358813264',email:'info@okyonusedt.com',adminUrl:'https://okyanus-edt-admin.hasan-kaya474.workers.dev/commerce',announcement:'\u0130stanbul HORECA tedariki \u2022 Profesyonel \u00fcr\u00fcn \u2022 H\u0131zl\u0131 teklif \u2022 G\u00fcvenli ileti\u015fim',heroTitle:'Profesyonel mutfa\u011f\u0131n al\u0131\u015fveri\u015fi burada ba\u015flar.',heroSubtitle:'\u00dcr\u00fcnleri kategori kategori inceleyin, miktar\u0131 belirleyin ve sepetten sipari\u015f veya teklif ak\u0131\u015f\u0131na ge\u00e7in.',address:'\u0130stanbul',footerText:'Restoran, kafe, otel, catering ve profesyonel mutfaklar i\u00e7in \u00fcr\u00fcn, teklif ve tedarik \u00e7\u00f6z\u00fcmleri.',...x};
 return '<div class="grid"><form class="form" id="settingsForm"><h3>Site Ayarlar\u0131</h3><input name="siteTitle" value="'+esc(d.siteTitle)+'" placeholder="Site ad\u0131"><input name="logoUrl" value="'+esc(d.logoUrl)+'" placeholder="Logo URL"><input name="contactName" value="'+esc(d.contactName||'Hasan Kaya')+'" placeholder="1. Sat\u0131\u015f yetkilisi"><input name="phone" value="'+esc(d.phone)+'" placeholder="1. Telefon"><input name="whatsapp" value="'+esc(d.whatsapp)+'" placeholder="1. WhatsApp numaras\u0131"><input name="secondContactName" value="'+esc(d.secondContactName||'Orhan G\u00fcng\u00f6r')+'" placeholder="2. Sat\u0131\u015f yetkilisi"><input name="secondPhone" value="'+esc(d.secondPhone)+'" placeholder="2. Telefon"><input name="secondWhatsapp" value="'+esc(d.secondWhatsapp)+'" placeholder="2. WhatsApp numaras\u0131"><input name="email" value="'+esc(d.email)+'" placeholder="E-posta"><input name="adminUrl" value="'+esc(d.adminUrl)+'" placeholder="Y\u00f6netici paneli URL"><textarea name="announcement" placeholder="\u00dcst duyuru">'+esc(d.announcement)+'</textarea><input name="heroTitle" value="'+esc(d.heroTitle)+'" placeholder="Ana banner ba\u015fl\u0131\u011f\u0131"><textarea name="heroSubtitle" placeholder="Ana banner a\u00e7\u0131klamas\u0131">'+esc(d.heroSubtitle)+'</textarea><input name="address" value="'+esc(d.address)+'" placeholder="Adres / b\u00f6lge"><textarea name="footerText" placeholder="Footer a\u00e7\u0131klamas\u0131">'+esc(d.footerText)+'</textarea><button>Site Ayarlar\u0131n\u0131 Kaydet</button><div id="settingsResult" role="status"></div></form><div><h3>Merkezi Y\u00f6netim</h3><p>Logo, iki sat\u0131\u015f yetkilisi, telefon/WhatsApp, y\u00f6netici paneli ba\u011flant\u0131s\u0131, duyuru, ana banner metni ve alt bilgi bu ekrandan de\u011fi\u015fir.</p><p>\u00dcr\u00fcn g\u00f6rseli/fiyat\u0131 \u00dcr\u00fcn & Fiyat; kategori, banner, vitrin, kampanya, marka, teslimat, medya ve yard\u0131m i\u00e7erikleri \u00fcst sekmelerden y\u00f6netilir.</p><p><b>Not:</b> Logo i\u00e7in GitHub\u2019daki resm\u00ee Okyanus EDT g\u00f6rseli varsay\u0131lan olarak ba\u011fl\u0131d\u0131r.</p><p><b>Varsay\u0131lan ekip:</b> Hasan Kaya \u00b7 +90 532 346 99 25 / Orhan G\u00fcng\u00f6r \u00b7 +90 535 881 32 64</p><p><a href="'+esc(d.adminUrl)+'" target="_blank" rel="noopener">Y\u00f6netici panelini yeni sekmede a\u00e7 \u2192</a></p></div></div>';
}
async function bindSettings(){
 const f=document.getElementById('settingsForm');if(!f)return;
 f.onsubmit=async e=>{e.preventDefault();const b=Object.fromEntries(new FormData(f)),out=document.getElementById('settingsResult');if(out)out.textContent='Kaydediliyor...';try{await api('settings',{method:'POST',body:JSON.stringify(b)});if(out)out.textContent='Site ayarlar\u0131 kaydedildi \u2713';await summary()}catch(err){if(out)out.textContent=err.message}}
}
async function runCatalogImport(){
 const out=document.getElementById('catalogImportResult'),ta=document.getElementById('catalogImportJson');if(!out||!ta)return;
 let items;try{items=JSON.parse(ta.value)}catch(_){out.textContent='Ge\u00e7ersiz JSON';return}
 if(!Array.isArray(items)){out.textContent='JSON bir dizi olmal\u0131';return}
 out.textContent='\u0130\u00e7e aktar\u0131l\u0131yor...';
 try{const j=await api('catalog-import',{method:'POST',body:JSON.stringify({items})});out.textContent='Olu\u015fturulan: '+(j.created||0)+' \u2022 G\u00fcncellenen: '+(j.updated||0)+' \u2022 Hatal\u0131: '+((j.failed||[]).length);await load();await summary()}catch(e){out.textContent=e.message}
}
async function bindProductForm(id=''){
 const f=document.getElementById('pf');if(!f)return;bindImageEditors(f);
 try{const bj=await api('brands'),dl=document.getElementById('brandIds');if(dl&&Array.isArray(bj.data))dl.innerHTML=bj.data.filter(x=>Number(x.active)!==0).map(x=>'<option value="'+esc(x.id)+'">'+esc(x.name)+'</option>').join('')}catch(_){}
 const cancel=document.getElementById('cancelProduct');if(cancel)cancel.onclick=()=>load();
 f.onsubmit=async e=>{e.preventDefault();const b=Object.fromEntries(new FormData(f));b.active=!!f.elements.active?.checked;b.featured=!!f.elements.featured?.checked;b.coldChain=!!f.elements.coldChain?.checked;b.bestSeller=!!f.elements.bestSeller?.checked;b.sortOrder=Number(b.sortOrder||0);for(const k of ['price','listPrice','salePrice','minOrderQty','qtyStep']){if(b[k]!=='')b[k]=Number(b[k]);else delete b[k]}await api('products'+(id?'/'+encodeURIComponent(id):''),{method:'POST',body:JSON.stringify(b)});await load();await summary()}
}
async function editProduct(id){const j=await api('products'),x=j.data.find(v=>String(v.id)===String(id));if(!x)return;content.innerHTML=productForm(x)+'<div style="margin-top:12px"><button type="button" onclick="load()">\u2190 \u00dcr\u00fcn listesine d\u00f6n</button></div>';await bindProductForm(id)}
async function disableProduct(id){if(!confirm('Bu \u00fcr\u00fcn pasife al\u0131ns\u0131n m\u0131?'))return;await api('products/'+encodeURIComponent(id),{method:'DELETE'});await load();await summary()}
async function showPriceHistory(id){
 const j=await api('product-history/'+encodeURIComponent(id));
 const rows=Array.isArray(j.data)?j.data:[];
 const box='<div class="panel"><h3>Fiyat Ge\u00e7mi\u015fi</h3><div class="table"><table><thead><tr><th>Tarih</th><th>Eski</th><th>Yeni</th><th>\u0130\u015flemi Yapan</th></tr></thead><tbody>'+rows.map(x=>'<tr><td>'+esc(x.created_at||'')+'</td><td>'+esc(x.old_price??'\u2014')+'</td><td>'+esc(x.new_price??'\u2014')+'</td><td>'+esc(x.actor||'\u2014')+'</td></tr>').join('')+'</tbody></table></div><p><button type="button" onclick="load()">\u2190 \u00dcr\u00fcn listesine d\u00f6n</button></p></div>';
 content.innerHTML=box;
}
const resourceMeta={
 products:['\u00dcr\u00fcn & Fiyat','\u00dcr\u00fcn kartlar\u0131, g\u00f6rseller, fiyatlar, stoklar ve etiketler burada y\u00f6netilir.'],
 settings:['Site Ayarlar\u0131','Logo, ileti\u015fim, y\u00f6netici ba\u011flant\u0131s\u0131, duyuru ve ana vitrin metinleri.'],
 categories:['Kategoriler','Kategori ad\u0131, ikon ve kategori g\u00f6rseli. G\u00f6rseli bo\u015falt\u0131p kaydederek kald\u0131rabilirsiniz.'],
 banners:['Banner','Masa\u00fcst\u00fc ve mobil banner g\u00f6rselleri, ba\u015fl\u0131k, a\u00e7\u0131klama ve y\u00f6nlendirme d\u00fc\u011fmesi.'],
 sections:['Vitrin','Ana sayfa vitrin bloklar\u0131n\u0131n s\u0131ras\u0131, t\u00fcr\u00fc, kayna\u011f\u0131 ve vitrin g\u00f6rseli.'],
 brands:['Markalar','Marka ad\u0131, logosu, a\u00e7\u0131klamas\u0131 ve g\u00f6r\u00fcn\u00fcrl\u00fck s\u0131ras\u0131.'],
 campaigns:['Kampanyalar','Kampanya metni, kampanya g\u00f6rseli, tarih aral\u0131\u011f\u0131 ve y\u00f6nlendirme d\u00fc\u011fmesi.'],
 'campaign-rules':['Kampanya Kurallar\u0131','\u0130ndirimin hangi \u00fcr\u00fcn, kategori veya markaya uygulanaca\u011f\u0131n\u0131 belirler.'],
 delivery:['Teslimat','B\u00f6lge, minimum sipari\u015f, teslimat \u00fccreti ve so\u011fuk zincir ko\u015fullar\u0131.'],
 media:['Medya','\u00dcr\u00fcn, kategori, vitrin ve kampanyalarda kullanaca\u011f\u0131n\u0131z g\u00f6rsel ba\u011flant\u0131lar\u0131n\u0131 saklar.'],
 seo:['SEO 200 Link','Arama motoru indeks ba\u011flant\u0131lar\u0131n\u0131 y\u00f6netir; m\u00fc\u015fteri vitrini i\u00e7inde kapal\u0131 mod\u00fcllerde g\u00f6sterilir.'],
 newsletter:['E-b\u00fclten','\u0130zinli e-b\u00fclten aboneliklerini g\u00f6r\u00fcnt\u00fcler ve pasife al\u0131r.'],
 help:['Site Yard\u0131m','M\u00fc\u015fteri yard\u0131m sayfas\u0131nda g\u00f6sterilen ba\u015fl\u0131k ve a\u00e7\u0131klamalar\u0131 y\u00f6netir.']
};
const fieldLabels={title:'Ba\u015fl\u0131k',subtitle:'Alt Ba\u015fl\u0131k / A\u00e7\u0131klama',desktopImage:'Masa\u00fcst\u00fc G\u00f6rseli',mobileImage:'Mobil G\u00f6rseli',ctaText:'D\u00fc\u011fme Yaz\u0131s\u0131',ctaUrl:'D\u00fc\u011fme Ba\u011flant\u0131s\u0131',startAt:'Ba\u015flang\u0131\u00e7 Tarihi',endAt:'Biti\u015f Tarihi',audience:'Hedef Kitle',deviceTarget:'Cihaz Hedefi',sortOrder:'S\u0131ralama',parentId:'\u00dcst Kategori',name:'Ad',slug:'Ba\u011flant\u0131 K\u0131sa Ad\u0131',icon:'\u0130kon',imageUrl:'G\u00f6rsel',description:'A\u00e7\u0131klama',seoTitle:'SEO Ba\u015fl\u0131\u011f\u0131',seoDescription:'SEO A\u00e7\u0131klamas\u0131',logoUrl:'Logo G\u00f6rseli',priority:'\u00d6ncelik',campaignId:'Kampanya',campaignType:'Kampanya T\u00fcr\u00fc',targetType:'Hedef T\u00fcr\u00fc',targetValue:'Hedef \u00dcr\u00fcn / Kategori / Marka',discountType:'\u0130ndirim T\u00fcr\u00fc',discountValue:'\u0130ndirim De\u011feri',minCart:'Minimum Sepet',customerSegment:'M\u00fc\u015fteri Segmenti',deliveryZone:'Teslimat B\u00f6lgesi',combinable:'Di\u011fer kampanyalarla birle\u015febilir',region:'B\u00f6lge',district:'\u0130l\u00e7e',minOrder:'Minimum Sipari\u015f',fee:'Teslimat \u00dccreti',freeThreshold:'\u00dccretsiz Teslimat Limiti',cutoff:'Sipari\u015f Son Saati',deliveryDays:'Teslimat G\u00fcnleri',coldChain:'So\u011fuk Zincir',url:'G\u00f6rsel / Dosya Ba\u011flant\u0131s\u0131',kind:'T\u00fcr',altText:'G\u00f6rsel Alternatif Metni',tags:'Etiketler',path:'SEO Ba\u011flant\u0131s\u0131',label:'Ba\u011flant\u0131 Ba\u015fl\u0131\u011f\u0131',groupName:'SEO Mod\u00fcl\u00fc',category:'Kategori',body:'Yard\u0131m Metni',source:'Kaynak / Filtre',payloadJson:'Geli\u015fmi\u015f Vitrin Ayar\u0131 (JSON)'};
const fieldHelp={desktopImage:'Geni\u015f ekranlarda g\u00f6sterilen banner g\u00f6rseli.',mobileImage:'Telefon ekranlar\u0131nda kullan\u0131lacak dikey veya kare g\u00f6rsel.',imageUrl:'Vitrin/kategori/kampanya g\u00f6rseli. HTTPS ba\u011flant\u0131s\u0131 kullan\u0131n.',logoUrl:'Marka logosunun HTTPS ba\u011flant\u0131s\u0131.',payloadJson:'Geli\u015fmi\u015f ayar. Bilmiyorsan\u0131z bo\u015f b\u0131rakabilirsiniz.',targetValue:'\u00dcr\u00fcn hedefinde \u00fcr\u00fcn ID, SKU veya \u00fcr\u00fcn ad\u0131 kullan\u0131labilir.',discountValue:'Y\u00fczde indirimde \u00f6rn. 10 = %10.',sortOrder:'K\u00fc\u00e7\u00fck say\u0131 daha \u00f6nce g\u00f6r\u00fcn\u00fcr.'};
const fieldSets={
 banners:['title','subtitle','desktopImage','mobileImage','ctaText','ctaUrl','startAt','endAt','audience','deviceTarget','sortOrder'],
 categories:['parentId','name','slug','icon','imageUrl','description','seoTitle','seoDescription','sortOrder'],
 brands:['name','slug','logoUrl','description','sortOrder'],
 campaigns:['title','description','imageUrl','ctaText','ctaUrl','startAt','endAt','priority','sortOrder'],
 'campaign-rules':['campaignId','campaignType','targetType','targetValue','discountType','discountValue','minCart','customerSegment','deliveryZone','combinable','sortOrder'],
 delivery:['region','district','minOrder','fee','freeThreshold','cutoff','deliveryDays','coldChain','sortOrder'],
 media:['name','url','kind','altText','tags','sortOrder'],
 seo:['path','label','groupName','sortOrder'],
 help:['title','slug','category','body','sortOrder'],
 sections:['title','kind','source','imageUrl','payloadJson','sortOrder']
};
function stockLabel(v){return ({AVAILABLE:'Stokta',LIMITED:'S\u0131n\u0131rl\u0131 stok',ORDER:'Sipari\u015fe uygun',OUT:'Stok d\u0131\u015f\u0131'})[v]||v||'\u2014'}
function isImageField(resource,f){return ['imageUrl','logoUrl','desktopImage','mobileImage'].includes(f)||(resource==='media'&&f==='url')}
function csrfToken(){const m=document.cookie.match(/(?:^|; )__Host-oky_csrf=([^;]+)/);return m?decodeURIComponent(m[1]):''}
async function uploadImageToEditor(box){
 const input=box.querySelector('[data-image-url]'),fileInput=box.querySelector('[data-image-file]'),button=box.querySelector('[data-upload-image]');
 const file=fileInput?.files?.[0];if(!file)throw Error('\u00d6nce bir g\u00f6rsel se\u00e7in.');
 if(file.size>8*1024*1024)throw Error('G\u00f6rsel en fazla 8 MB olabilir.');
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Yaln\u0131z JPEG, PNG veya WebP y\u00fcklenebilir.');
 const fd=new FormData();fd.append('file',file);if(button){button.disabled=true;button.textContent='Y\u00fckleniyor...'}
 try{
  const r=await fetch('/api/studio-media',{method:'POST',headers:{'X-CSRF-Token':csrfToken()},body:fd,credentials:'same-origin'});
  const raw=await r.text();let j={};try{j=raw?JSON.parse(raw):{}}catch{}
  if(!r.ok)throw Error(j.error||j.message||('Y\u00fckleme hatas\u0131: HTTP '+r.status));
  input.value=j.url||'';input.dispatchEvent(new Event('input',{bubbles:true}));
 }finally{if(button){button.disabled=false;button.textContent='G\u00f6rsel Y\u00fckle'}}
}
const imageEditorBindings=new WeakSet();
function bindImageEditors(root=document){
 root.querySelectorAll('[data-image-editor]').forEach(box=>{
  const input=box.querySelector('[data-image-url]')||box.querySelector('input'),img=box.querySelector('[data-image-preview]'),clear=box.querySelector('[data-clear-image]'),upload=box.querySelector('[data-upload-image]');
  const paint=()=>{const v=(input?.value||'').trim();if(img){img.src=v;img.hidden=!v}};
  if(imageEditorBindings.has(box)){paint();return}
  imageEditorBindings.add(box);
  input?.addEventListener('input',paint);
  clear?.addEventListener('click',()=>{input.value='';const file=box.querySelector('[data-image-file]');if(file)file.value='';paint()});
  upload?.addEventListener('click',async()=>{try{await uploadImageToEditor(box)}catch(e){alert('G\u00f6rsel y\u00fckleme hatas\u0131: '+(e.message||e))}});
  paint();
 });
}
const dbMap={desktopImage:'desktop_image',mobileImage:'mobile_image',ctaText:'cta_text',ctaUrl:'cta_url',startAt:'start_at',endAt:'end_at',sortOrder:'sort_order',imageUrl:'image_url',logoUrl:'logo_url',minOrder:'min_order',freeThreshold:'free_threshold',deliveryDays:'delivery_days',altText:'alt_text',payloadJson:'payload_json',groupName:'group_name',parentId:'parent_id',seoTitle:'seo_title',seoDescription:'seo_description',audience:'audience',deviceTarget:'device_target',campaignId:'campaign_id',campaignType:'campaign_type',targetType:'target_type',targetValue:'target_value',discountType:'discount_type',discountValue:'discount_value',minCart:'min_cart',customerSegment:'customer_segment',deliveryZone:'delivery_zone'};
let editingId='';
function newsletterUI(rows){return '<div><h3>E-b\u00fclten Aboneleri</h3><p>Yaln\u0131z a\u00e7\u0131k onayla kaydedilmi\u015f aboneler listelenir. Kay\u0131t silmek yerine abonelik durumu pasife al\u0131n\u0131r.</p><div class="table"><table><thead><tr><th>E-posta</th><th>Ad</th><th>Onay</th><th>Durum</th><th>Tarih</th><th>\u0130\u015flem</th></tr></thead><tbody>'+rows.map(x=>'<tr><td>'+esc(x.email)+'</td><td>'+esc(x.name||'\u2014')+'</td><td>'+esc(x.consent_version)+'</td><td>'+esc(x.status)+'</td><td>'+esc(x.updated_at||x.created_at||'')+'</td><td>'+(x.status==='ACTIVE'?'<button type="button" onclick="unsubscribeNewsletter(\\''+esc(x.id)+'\\')">Abonelikten \u00c7\u0131kar</button>':'\u2014')+'</td></tr>').join('')+'</tbody></table></div></div>'}
async function unsubscribeNewsletter(id){if(!confirm('Bu e-b\u00fclten aboneli\u011fi pasife al\u0131ns\u0131n m\u0131?'))return;await api('newsletter/'+encodeURIComponent(id),{method:'DELETE'});await load();await summary()}
function genericUI(resource,rows){
 const fields=fieldSets[resource]||fieldSets.sections,meta=resourceMeta[resource]||['Y\u00f6netim','Bu mod\u00fcl ilgili kay\u0131tlar\u0131 y\u00f6netir.'];
 const fieldHtml=f=>{
  const label=fieldLabels[f]||f,help=fieldHelp[f]?'<small class="fieldHelp">'+fieldHelp[f]+'</small>':'';
  if(f==='coldChain'||f==='combinable')return '<div class="fieldBlock"><label><input type="checkbox" name="'+f+'" style="width:auto;display:inline-block;margin-right:8px">'+label+'</label>'+help+'</div>';
  if(isImageField(resource,f))return '<div class="fieldBlock"><label>'+label+'</label><div class="imageEditor" data-image-editor><input data-image-url name="'+f+'" placeholder="https://..."><button type="button" class="removeImage" data-clear-image>G\u00f6rseli Kald\u0131r</button><input data-image-file type="file" accept="image/jpeg,image/png,image/webp"><button type="button" class="uploadImage" data-upload-image>G\u00f6rsel Y\u00fckle</button><img data-image-preview alt="G\u00f6rsel \u00f6nizleme" hidden></div>'+help+'</div>';
  if(f==='body'||f==='description'||f==='subtitle'||f==='payloadJson'||f==='seoDescription')return '<div class="fieldBlock"><label>'+label+'</label><textarea name="'+f+'" placeholder="'+(f==='payloadJson'?'\u00d6rn. {"limit":5,"ctaText":"T\u00fcm\u00fcn\u00fc G\u00f6r","ctaUrl":"/urunler"}':label)+'"></textarea>'+help+'</div>';
  return '<div class="fieldBlock"><label>'+label+'</label><input name="'+f+'" '+((f==='startAt'||f==='endAt')?'type="datetime-local" ':'')+(f==='kind'&&resource==='sections'?'list="sectionKinds" ':'')+(f==='campaignId'&&resource==='campaign-rules'?'list="campaignIds" ':'')+'placeholder="'+label+'">'+help+'</div>';
 };
 const visual=x=>esc(x.image_url||x.logo_url||x.desktop_image||x.mobile_image||x.url||'');
 return '<div class="moduleInfo"><b>'+meta[0]+'</b><br>'+meta[1]+'</div><div class="grid"><form class="form" id="gf"><h3 id="gfTitle">Yeni Kay\u0131t</h3>'+
 fields.map(fieldHtml).join('')+(resource==='sections'?'<datalist id="sectionKinds"><option value="PRODUCT_GRID"><option value="CATEGORY_STRIP"><option value="CAMPAIGN"><option value="PROMO"><option value="CONTENT"></datalist><small class="fieldHelp">Vitrin t\u00fcrleri: \u00dcr\u00fcn listesi, kategori \u015feridi, kampanya, promosyon veya i\u00e7erik.</small>':'')+(resource==='campaign-rules'?'<datalist id="campaignIds"></datalist><small class="fieldHelp">Hedef t\u00fcr\u00fc PRODUCT, CATEGORY, BRAND veya ALL; indirim t\u00fcr\u00fc PERCENT veya FIXED olabilir.</small>':'')+
 '<label><input type="checkbox" name="active" checked style="width:auto;display:inline-block;margin-right:8px">Aktif</label><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="submit">Kaydet</button><button type="button" id="cancelEdit" style="background:#60778a;display:none">Vazge\u00e7</button></div></form><div class="table"><table><thead><tr><th>G\u00f6rsel</th><th>Kay\u0131t</th><th>Durum</th><th>\u0130\u015flem</th></tr></thead><tbody>'+
 rows.map(x=>'<tr><td>'+(visual(x)?'<img class="miniVisual" src="'+visual(x)+'" alt="">':'\u2014')+'</td><td><b>'+esc(x.title||x.name||x.label||x.target_value||x.region||x.id)+'</b><br><small>'+esc(x.slug||x.kind||x.district||'')+'</small></td><td>'+(Number(x.active)!==0?'Aktif':'Pasif')+'</td><td><button type="button" onclick="startEdit(\\''+esc(resource)+'\\',\\''+esc(x.id)+'\\')">D\u00fczenle</button><button type="button" onclick="removeRow(\\''+esc(resource)+'\\',\\''+esc(x.id)+'\\')" style="background:#9d2635">Sil</button></td></tr>').join('')+
 '</tbody></table></div></div>';
}
async function startEdit(resource,id){
 const j=await api(resource),x=j.data.find(v=>String(v.id)===String(id));if(!x)return;
 editingId=id;current=resource;
 const f=document.getElementById('gf');if(!f)return;
 document.getElementById('gfTitle').textContent='Kayd\u0131 D\u00fczenle';
 document.getElementById('cancelEdit').style.display='inline-block';
 for(const name of fieldSets[resource]||[]){
   const el=f.elements[name];if(!el)continue;
   const key=dbMap[name]||name;if(el.type==='checkbox')el.checked=Number(x[key]||0)!==0;else el.value=x[key]??'';
 }
 if(f.elements.active)f.elements.active.checked=Number(x.active)!==0;
 bindImageEditors(f);f.scrollIntoView({behavior:'smooth',block:'start'});
}
async function removeRow(resource,id){
 if(!confirm('Bu kay\u0131t silinsin mi?'))return;
 await api(resource+'/'+encodeURIComponent(id),{method:'DELETE'});
 editingId='';await load();await summary();
}
async function load(){
 const j=await api(current==='opening'?'settings':current==='bulk'?'products':current);
 if(current==='opening'){content.innerHTML=openingUI(j.data||{});bindOpening(j.data||{});return}
 if(current==='bulk'){content.innerHTML=bulkUI(j.data);bindBulk(j.data);return}
 if(current==='products'){content.innerHTML=productUI(j.data);await bindProductForm();content.querySelectorAll('[data-featured-id]').forEach(box=>box.onchange=async()=>{box.disabled=true;try{await api('product-featured/'+encodeURIComponent(box.dataset.featuredId),{method:'POST',body:JSON.stringify({featured:box.checked})})}catch(e){box.checked=!box.checked;alert(e.message)}finally{box.disabled=false}});return}
 if(current==='settings'){content.innerHTML=settingsUI(j.data||{});await bindSettings();return}
 if(current==='newsletter'){content.innerHTML=newsletterUI(j.data||[]);return}
 content.innerHTML=genericUI(current,j.data);bindImageEditors(content);
 if(current==='campaign-rules'){try{const cj=await api('campaigns'),dl=document.getElementById('campaignIds');if(dl&&Array.isArray(cj.data))dl.innerHTML=cj.data.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.title||x.id)+'</option>').join('')}catch(_){}}
 const f=document.getElementById('gf');
 if(f){
   const cancel=document.getElementById('cancelEdit');
   cancel.onclick=()=>{editingId='';load()};
   f.onsubmit=async e=>{
     e.preventDefault();
     const b=Object.fromEntries(new FormData(f));
     b.active=!!f.elements.active?.checked;if(f.elements.coldChain)b.coldChain=!!f.elements.coldChain.checked;if(f.elements.combinable)b.combinable=!!f.elements.combinable.checked;
     for(const k of ['sortOrder','priority','minOrder','fee','freeThreshold','discountValue','minCart']) if(k in b)b[k]=Number(b[k]||0);
     const target=current+(editingId?'/'+encodeURIComponent(editingId):'');
     let status=f.querySelector('[data-save-status]');if(!status){status=document.createElement('p');status.dataset.saveStatus='';status.setAttribute('role','status');f.append(status)}
     const button=f.querySelector('[type="submit"]');if(button)button.disabled=true;status.textContent='Kaydediliyor\u2026';
     try{await api(target,{method:'POST',body:JSON.stringify(b)});editingId='';await load();await summary()}
     catch(error){status.textContent='Kay\u0131t tamamlanamad\u0131: '+(error.message||error)+'. Bilgileriniz ekranda korundu.'}
     finally{if(button)button.disabled=false}
   };
 }
}
document.querySelectorAll('[data-r]').forEach(b=>b.onclick=async()=>{current=b.dataset.r;editingId='';document.querySelectorAll('[data-r]').forEach(x=>x.classList.toggle('active',x===b));try{await load()}catch(e){content.innerHTML='<div style="padding:18px;border:1px solid #efb4b4;background:#fff5f5;border-radius:12px"><b>Y\u00f6netim verisi y\u00fcklenemedi</b><p>'+esc(e.message||e)+'</p><button type="button" onclick="location.reload()">Tekrar Dene</button></div>'}});async function boot(){try{await summary();await load()}catch(e){stats.innerHTML='';content.innerHTML='<div style="padding:18px;border:1px solid #efb4b4;background:#fff5f5;border-radius:12px"><b>Y\u00f6netim paneli ba\u011flant\u0131 hatas\u0131</b><p>'+esc(e.message||e)+'</p><p>Oturum, D1 veritaban\u0131 ba\u011flant\u0131s\u0131 ve Worker s\u00fcr\u00fcm\u00fcn\u00fc kontrol edin.</p><button type="button" onclick="location.reload()">Tekrar Dene</button></div>'}}boot();
</script></body></html>`,headers)}

return { commerceAdminApi, commerceAdminPage };
})();
/*
OKYANUS EDT \u2014 ZAMAN/ADMIN B2B YONETIM WORKER
v1.40 PRODUCT-CARD + CONTACT-FLOW PASS \u2014 2026-09-23
Mimari: ZAMAN/ADMIN -> D1 -> DENIZ
Not: Mevcut admin, mesaj, studio ve yetki omurgasi korunur.
*/
const APP = 'Okyanus EDT Y\u00f6netici';
    const SESSION_SECONDS = 1800;
    const PASSWORD_ITERATIONS = 100000;
    const enc = new TextEncoder();

    export default {
      async fetch(request, env) {
        try {
          env={...env,DB:env.DB||env['Veritaban\u0131']||env['Veritabani'],PHOTO_TEMP:env['FOTO\u011eRAF_TEMP']||env.PHOTO_TEMP,MEDIA_STORE:env.MEDIA_STORE||env['MEDYA_MA\u011eAZASI']||env['MEDYA_DEPO']};
          const url = new URL(request.url);
          const headers = securityHeaders();
          if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
          if (url.pathname === '/health') return json({
            ok: true,
            app: APP,
            release: '1.13.0-commerce-admin-route-final',
            bindings: {
              database: !!env.DB,
              mediaStore: !!env.MEDIA_STORE,
              photoTemp: !!env.PHOTO_TEMP
            }
          }, 200, headers);
          if (url.pathname === '/setup') return json({ ok: false, error: 'NOT_FOUND' }, 404, headers);
          if (url.pathname.startsWith('/studio-media/')) return await publicStudioMedia(request, env, headers, url);
          if (url.pathname === '/login') return await loginRoute(request, env, headers);
          if (url.pathname === '/logout') return await logoutRoute(request, env, headers);
          if (url.pathname === '/commerce/' || url.pathname === '/yonetici' || url.pathname === '/yonetici/') return redirect('/commerce', headers);

          const auth = await authenticate(request, env);
          if (!auth) return request.method === 'GET' && !url.pathname.startsWith('/api/')
            ? redirect('/login', headers)
            : json({ ok: false, error: 'UNAUTHORIZED' }, 401, headers);

          if (url.pathname === '/') return html(await dashboard(auth, env, url), 200, headers);
          if (url.pathname === '/commerce') { if (auth.user.role !== 'owner') throw http(403, 'OWNER_ONLY'); return commerceAdminPage(headers); }
           if (url.pathname === '/cesni') return html(await cesniAdminPage(auth, env), 200, headers);
          if (url.pathname === '/account/password') return await passwordRoute(request, env, auth, headers);
          if (url.pathname === '/print') return html(printPage(), 200, headers);
          if (url.pathname === '/api/me') return json({ ok: true, user: publicUser(auth.user) }, 200, headers);
          if (url.pathname === '/api/summary') return await summaryRoute(env, headers);
          if (url.pathname.startsWith('/api/')) {
            if (!['GET', 'HEAD'].includes(request.method)) { enforceOrigin(request); await requireCsrf(request, auth, env); }
            return await apiRoute(request, env, auth, headers);
          }
          return json({ ok: false, error: 'NOT_FOUND' }, 404, headers);
        } catch (error) {
          console.error(error?.stack || error);
          const status = error?.status || 500;
          return json({ ok: false, error: status === 500 ? 'INTERNAL_ERROR' : error.message }, status, securityHeaders());
        }
      }
    };

    async function setupRoute(request, env, headers) {
      const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM users').first();
      if (Number(count?.n || 0) > 0) return json({ ok: false, error: 'SETUP_CLOSED' }, 409, headers);
      if (request.method === 'GET') return html(setupPage(), 200, headers);
      if (request.method !== 'POST') return json({ ok: false, error: 'METHOD_NOT_ALLOWED' }, 405, headers);
      enforceOrigin(request);
      const isForm = String(request.headers.get('content-type')||'').includes('application/x-www-form-urlencoded');
      const body = isForm ? Object.fromEntries(await request.formData()) : await readJson(request);
      if (!env.BOOTSTRAP_TOKEN || !timingSafe(body.bootstrapToken || '', env.BOOTSTRAP_TOKEN)) throw http(403, 'INVALID_BOOTSTRAP_TOKEN');
      validateEmail(body.email); validatePassword(body.password);
      const now = new Date().toISOString();
      const id = crypto.randomUUID();
      const passwordHash = await hashPassword(body.password);
      await env.DB.prepare(`INSERT INTO users
        (id,email,display_name,password_hash,role,status,failed_login_count,password_changed_at,created_at,updated_at,version)
        VALUES (?,?,?,?,?,'active',0,?,?,?,1)`)
        .bind(id, body.email.trim().toLowerCase(), clean(body.displayName, 100), passwordHash, 'owner', now, now, now).run();
      await audit(env, { actorUserId: id, action: 'BOOTSTRAP_OWNER', entityType: 'user', entityId: id, after: { email: body.email.trim().toLowerCase(), role: 'owner' } });
      return isForm ? redirect('/login?setup=ok', headers) : json({ ok: true, message: 'OWNER_CREATED' }, 201, headers);
    }

    async function loginRoute(request, env, headers) {
      if (!env.SESSION_PEPPER) throw http(503, 'SESSION_SECRET_MISSING');
      if (request.method === 'GET') return html(loginPage(), 200, headers);
      if (request.method !== 'POST') return json({ ok: false, error: 'METHOD_NOT_ALLOWED' }, 405, headers);
      enforceOrigin(request);
      enforceAccess(request, env);
      const isForm = String(request.headers.get('content-type')||'').includes('application/x-www-form-urlencoded');
      const body = isForm ? Object.fromEntries(await request.formData()) : await readJson(request); validateEmail(body.email);
      const email = body.email.trim().toLowerCase();
      const user = await env.DB.prepare('SELECT * FROM users WHERE email=? LIMIT 1').bind(email).first();
      const suppliedPassword=String(body.password||'');
      if(user&&isFutureSqlite(user.locked_until)) throw http(401,'INVALID_CREDENTIALS');
      const passwordOk=Boolean(user&&await verifyPassword(suppliedPassword,user.password_hash));
      if (!user || user.status !== 'active' || !passwordOk) {
        if (user) await env.DB.prepare(`UPDATE users SET failed_login_count=failed_login_count+1,
          locked_until=CASE WHEN failed_login_count+1>=5 THEN datetime('now','+15 minutes') ELSE locked_until END,
          updated_at=datetime('now') WHERE id=?`).bind(user.id).run();
        throw http(401, 'INVALID_CREDENTIALS');
      }
      await env.DB.prepare(`UPDATE users SET failed_login_count=0,locked_until=NULL,last_login_at=datetime('now'),updated_at=datetime('now') WHERE id=?`).bind(user.id).run();
      const rawToken = randomToken(32), csrf = randomToken(24), now = new Date(), expires = new Date(now.getTime() + SESSION_SECONDS * 1000);
      const tokenHash = await sha256(rawToken + (env.SESSION_PEPPER || ''));
      const csrfHash = await sha256(csrf + (env.SESSION_PEPPER || ''));
      await env.DB.prepare(`INSERT INTO sessions(id,user_id,token_hash,csrf_secret_hash,ip_hash,user_agent,created_at,last_seen_at,expires_at)
        VALUES(?,?,?,?,?,?,?,?,?)`).bind(crypto.randomUUID(), user.id, tokenHash, csrfHash,
          await sha256(request.headers.get('CF-Connecting-IP') || ''), clean(request.headers.get('User-Agent') || '', 500),
          now.toISOString(), now.toISOString(), expires.toISOString()).run();
      await audit(env, { actorUserId: user.id, action: 'LOGIN', entityType: 'session', entityId: tokenHash.slice(0, 16) });
      const out = isForm ? redirect('/', headers) : json({ ok: true, csrf, user: publicUser(user) }, 200, headers);
      out.headers.append('Set-Cookie', `__Host-oky_admin=${rawToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`);
      out.headers.append('Set-Cookie', `__Host-oky_csrf=${csrf}; Path=/; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`);
      return out;
    }

    async function logoutRoute(request, env, headers) {
      if (request.method !== 'POST') return json({ ok: false, error: 'METHOD_NOT_ALLOWED' }, 405, headers);
      enforceOrigin(request);
      const auth = await authenticate(request, env);
      if (auth) { await requireCsrf(request, auth, env); await env.DB.prepare(`UPDATE sessions SET revoked_at=datetime('now'),revoke_reason='logout' WHERE id=?`).bind(auth.session.id).run(); }
      const out = json({ ok: true }, 200, headers);
      out.headers.append('Set-Cookie', '__Host-oky_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
      out.headers.append('Set-Cookie', '__Host-oky_csrf=; Path=/; Secure; SameSite=Strict; Max-Age=0');
      return out;
    }

    async function authenticate(request, env) {
      if (!env.SESSION_PEPPER) return null;
      enforceAccess(request, env);
      const token = cookie(request.headers.get('Cookie') || '', '__Host-oky_admin');
      if (!token) return null;
      const tokenHash = await sha256(token + (env.SESSION_PEPPER || ''));
      const row = await env.DB.prepare(`SELECT s.id session_id,s.user_id,s.csrf_secret_hash,s.expires_at,s.revoked_at,
        u.id,u.email,u.display_name,u.password_hash,u.role,u.status FROM sessions s JOIN users u ON u.id=s.user_id
        WHERE s.token_hash=? LIMIT 1`).bind(tokenHash).first();
      if (!row || row.revoked_at || row.expires_at <= new Date().toISOString() || row.status !== 'active') return null;
      await env.DB.prepare(`UPDATE sessions SET last_seen_at=datetime('now') WHERE id=?`).bind(row.session_id).run();
      return { session: { id: row.session_id }, user: row, csrfHash: row.csrf_secret_hash };
    }

    async function passwordRoute(request,env,auth,headers){
      if(request.method==='GET') return html(passwordPage(),200,headers);
      if(request.method!=='POST') throw http(405,'METHOD_NOT_ALLOWED');
      enforceOrigin(request); await requireCsrf(request,auth,env);
      const b=await readJson(request);
      if(!await verifyPassword(String(b.currentPassword||''),auth.user.password_hash)) throw http(401,'CURRENT_PASSWORD_INVALID');
      validatePassword(b.newPassword);
      if(String(b.currentPassword)===String(b.newPassword)) throw http(400,'PASSWORD_UNCHANGED');
      const hash=await hashPassword(String(b.newPassword));
      await env.DB.prepare(`UPDATE users SET password_hash=?,password_changed_at=datetime('now'),failed_login_count=0,locked_until=NULL,updated_at=datetime('now') WHERE id=?`).bind(hash,auth.user.id).run();
      await env.DB.prepare(`UPDATE sessions SET revoked_at=datetime('now'),revoke_reason='password_changed' WHERE user_id=? AND id<>? AND revoked_at IS NULL`).bind(auth.user.id,auth.session.id).run();
      await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'PASSWORD_CHANGED',entityType:'user',entityId:auth.user.id});
      return json({ok:true,message:'PASSWORD_CHANGED'},200,headers);
    }


    /* ==========================================================================
       DENIZ B2B ADMIN v1.0.0 | 2026-09-23
       ========================================================================== */
    async function adminB2bEnsure(env){
      if(!env||!env.DB) throw http(503,'B2B_DB_NOT_BOUND');
      const q=[
    `CREATE TABLE IF NOT EXISTS b2b_customers_v1(id TEXT PRIMARY KEY,business_id TEXT,company_name TEXT NOT NULL,contact_name TEXT,phone TEXT,email TEXT,delivery_region TEXT,sales_rep_id TEXT,status TEXT NOT NULL DEFAULT 'active',last_order_at TEXT,created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_products_v1(id TEXT PRIMARY KEY,source_product_id TEXT,name TEXT NOT NULL,category TEXT NOT NULL DEFAULT 'Deniz \u00dcr\u00fcnleri',origin TEXT,freshness TEXT,processing TEXT,unit TEXT NOT NULL DEFAULT 'Kg',package_text TEXT,image_url TEXT,min_order REAL,stock_status TEXT NOT NULL DEFAULT 'ORDER',active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_prices_v1(id TEXT PRIMARY KEY,product_id TEXT NOT NULL,price REAL NOT NULL,currency TEXT NOT NULL DEFAULT 'TRY',valid_from TEXT NOT NULL DEFAULT (datetime('now')),valid_until TEXT,active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_customer_prices_v1(id TEXT PRIMARY KEY,business_id TEXT NOT NULL,product_id TEXT NOT NULL,price REAL NOT NULL,currency TEXT NOT NULL DEFAULT 'TRY',valid_from TEXT NOT NULL DEFAULT (datetime('now')),valid_until TEXT,active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')),UNIQUE(business_id,product_id))`,
    `CREATE TABLE IF NOT EXISTS b2b_quotes_v1(id TEXT PRIMARY KEY,quote_no TEXT NOT NULL UNIQUE,business_id TEXT,customer_id TEXT,company_name TEXT NOT NULL,contact_name TEXT,phone TEXT,email TEXT,delivery_region TEXT,note TEXT,status TEXT NOT NULL DEFAULT 'NEW',sales_rep_id TEXT,valid_until TEXT,total REAL NOT NULL DEFAULT 0,currency TEXT NOT NULL DEFAULT 'TRY',created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_quote_items_v1(id TEXT PRIMARY KEY,quote_id TEXT NOT NULL,product_id TEXT,product_name TEXT NOT NULL,unit TEXT NOT NULL DEFAULT 'Kg',quantity REAL NOT NULL,unit_price REAL,line_total REAL,created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_orders_v1(id TEXT PRIMARY KEY,order_no TEXT NOT NULL UNIQUE,quote_id TEXT,business_id TEXT,customer_id TEXT,status TEXT NOT NULL DEFAULT 'NEW',total REAL NOT NULL DEFAULT 0,currency TEXT NOT NULL DEFAULT 'TRY',delivery_region TEXT,created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_b2b_orders_quote_once ON b2b_orders_v1(quote_id) WHERE quote_id IS NOT NULL AND status<>'CANCELLED'`,
    `CREATE TABLE IF NOT EXISTS b2b_order_items_v1(id TEXT PRIMARY KEY,order_id TEXT NOT NULL,product_id TEXT,product_name TEXT NOT NULL,unit TEXT NOT NULL DEFAULT 'Kg',quantity REAL NOT NULL,unit_price REAL,line_total REAL,created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_activity_v1(id TEXT PRIMARY KEY,business_id TEXT,customer_id TEXT,quote_id TEXT,order_id TEXT,action TEXT NOT NULL,detail TEXT,actor TEXT NOT NULL DEFAULT 'system',created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_price_history_v1(id TEXT PRIMARY KEY,product_id TEXT NOT NULL,business_id TEXT,old_price REAL,new_price REAL NOT NULL,actor TEXT,created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_sales_representatives_v1(id TEXT PRIMARY KEY,name TEXT NOT NULL,phone TEXT,email TEXT,region TEXT,active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_showcase_v1(id TEXT PRIMARY KEY,slot TEXT NOT NULL DEFAULT 'seafood_b2b',category TEXT NOT NULL DEFAULT 'Deniz \u00dcr\u00fcnleri',title TEXT NOT NULL,subtitle TEXT,image_url TEXT,cta_text TEXT NOT NULL DEFAULT '\u00dcr\u00fcnleri \u0130ncele',cta_url TEXT NOT NULL DEFAULT '/deniz-urunleri-b2b#urunler',active INTEGER NOT NULL DEFAULT 1,sort_order INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE INDEX IF NOT EXISTS idx_b2b_showcase_active ON b2b_showcase_v1(slot,active,sort_order)`
      ];for(const s of q)await env.DB.prepare(s).run();
      const pcols=((await env.DB.prepare("PRAGMA table_info(b2b_products_v1)").all()).results||[]).map(x=>x.name);if(!pcols.includes("image_url"))await env.DB.prepare("ALTER TABLE b2b_products_v1 ADD COLUMN image_url TEXT").run();
      const qcols=((await env.DB.prepare("PRAGMA table_info(b2b_quotes_v1)").all()).results||[]).map(x=>x.name);
      for(const [name,type] of [["source_channel","TEXT"],["source_landing","TEXT"],["source_title","TEXT"],["source_group","TEXT"]])if(!qcols.includes(name))await env.DB.prepare(`ALTER TABLE b2b_quotes_v1 ADD COLUMN ${name} ${type}`).run();
      await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_b2b_quotes_source_landing ON b2b_quotes_v1(source_landing,created_at)").run();
    }
    async function b2bAdminApi(request,env,auth,headers,id,action,url){
      if(!['owner','admin','editor','viewer'].includes(auth.user.role))throw http(403,'FORBIDDEN');
      await adminB2bEnsure(env);
      const canWrite=['owner','admin','editor'].includes(auth.user.role);
      if(request.method==='GET'&&!id){
        const status=String(url.searchParams.get('status')||'');
        const rows=status?(await env.DB.prepare(`SELECT * FROM b2b_quotes_v1 WHERE status=? ORDER BY created_at DESC LIMIT 200`).bind(status).all()).results:
          (await env.DB.prepare(`SELECT * FROM b2b_quotes_v1 ORDER BY created_at DESC LIMIT 200`).all()).results;
        return json({ok:true,data:rows||[]},200,headers);
      }
      if(request.method==='GET'&&id){
        const quote=await env.DB.prepare(`SELECT * FROM b2b_quotes_v1 WHERE id=? LIMIT 1`).bind(id).first();if(!quote)throw http(404,'QUOTE_NOT_FOUND');
        const items=(await env.DB.prepare(`SELECT * FROM b2b_quote_items_v1 WHERE quote_id=? ORDER BY rowid`).bind(id).all()).results||[];
        return json({ok:true,data:{quote,items}},200,headers);
      }
      if(!canWrite)throw http(403,'READ_ONLY_ROLE');
      if(request.method==='POST'&&id&&action==='status'){
        const b=await readJson(request),status=String(b.status||'').toUpperCase();
        if(!['NEW','REVIEWING','PRICED','SENT','WAITING','WON','LOST'].includes(status))throw http(400,'INVALID_STATUS');
        const before=await env.DB.prepare(`SELECT id,status FROM b2b_quotes_v1 WHERE id=?`).bind(id).first();if(!before)throw http(404,'QUOTE_NOT_FOUND');
        await env.DB.prepare(`UPDATE b2b_quotes_v1 SET status=?,updated_at=datetime('now') WHERE id=?`).bind(status,id).run();
        await env.DB.prepare(`INSERT INTO b2b_activity_v1(id,quote_id,action,detail,actor) VALUES(?,?,?,?,?)`).bind(crypto.randomUUID(),id,'QUOTE_STATUS_CHANGED',status,auth.user.id).run();
        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'B2B_QUOTE_STATUS',entityType:'b2b_quote',entityId:id,before,after:{status}});
        return json({ok:true,status},200,headers);
      }
      if(request.method==='POST'&&id&&action==='price'){
        const b=await readJson(request);if(!Array.isArray(b.items))throw http(400,'INVALID_ITEMS');
        let total=0;
        for(const x of b.items){const itemId=String(x.id||''),price=Number(x.unitPrice);if(!itemId||!Number.isFinite(price)||price<0)throw http(400,'INVALID_PRICE');
          const row=await env.DB.prepare(`SELECT quantity FROM b2b_quote_items_v1 WHERE id=? AND quote_id=?`).bind(itemId,id).first();if(!row)throw http(404,'ITEM_NOT_FOUND');
          const line=Number(row.quantity)*price;total+=line;await env.DB.prepare(`UPDATE b2b_quote_items_v1 SET unit_price=?,line_total=? WHERE id=? AND quote_id=?`).bind(price,line,itemId,id).run();}
        await env.DB.prepare(`UPDATE b2b_quotes_v1 SET total=?,status='PRICED',valid_until=?,updated_at=datetime('now') WHERE id=?`).bind(total,b.validUntil||null,id).run();
        return json({ok:true,total,status:'PRICED'},200,headers);
      }
      if(request.method==='POST'&&id&&action==='order'){
        const q=await env.DB.prepare(`SELECT * FROM b2b_quotes_v1 WHERE id=?`).bind(id).first();if(!q)throw http(404,'QUOTE_NOT_FOUND');
        if(!['PRICED','SENT','WAITING','WON'].includes(q.status))throw http(409,'QUOTE_NOT_READY');
        const existingOrder=await env.DB.prepare(`SELECT id,order_no FROM b2b_orders_v1 WHERE quote_id=? AND status<>'CANCELLED' LIMIT 1`).bind(id).first();
        if(existingOrder) return json({ok:true,orderId:existingOrder.id,orderNo:existingOrder.order_no,duplicate:true},200,headers);
        const orderId=crypto.randomUUID(),orderNo='OE-SIP-'+new Date().getUTCFullYear()+'-'+crypto.randomUUID().replace(/-/g,'').slice(0,8).toUpperCase();
        await env.DB.prepare(`INSERT INTO b2b_orders_v1(id,order_no,quote_id,business_id,customer_id,status,total,currency,delivery_region) VALUES(?,?,?,?,?,'NEW',?,?,?)`).bind(orderId,orderNo,id,q.business_id,q.customer_id,q.total,q.currency,q.delivery_region).run();
        const items=(await env.DB.prepare(`SELECT * FROM b2b_quote_items_v1 WHERE quote_id=?`).bind(id).all()).results||[];
        for(const x of items)await env.DB.prepare(`INSERT INTO b2b_order_items_v1(id,order_id,product_id,product_name,unit,quantity,unit_price,line_total) VALUES(?,?,?,?,?,?,?,?)`).bind(crypto.randomUUID(),orderId,x.product_id,x.product_name,x.unit,x.quantity,x.unit_price,x.line_total).run();
        await env.DB.prepare(`UPDATE b2b_quotes_v1 SET status='WON',updated_at=datetime('now') WHERE id=?`).bind(id).run();
        if(q.customer_id)await env.DB.prepare(`UPDATE b2b_customers_v1 SET last_order_at=datetime('now'),status='active',updated_at=datetime('now') WHERE id=?`).bind(q.customer_id).run();
        await env.DB.prepare(`INSERT INTO b2b_activity_v1(id,business_id,customer_id,quote_id,order_id,action,detail,actor) VALUES(?,?,?,?,?,'ORDER_CREATED',? ,?)`).bind(crypto.randomUUID(),q.business_id,q.customer_id,id,orderId,orderNo,auth.user.id).run();
        return json({ok:true,orderId,orderNo},201,headers);
      }
      throw http(405,'METHOD_NOT_ALLOWED');
    }


    /* === DENIZ B2B ADMIN COMPLETION PACK v1.1 === */
    function b2bRoleWrite(auth){if(!['owner','admin','editor'].includes(auth.user.role))throw http(403,'READ_ONLY_ROLE')}
    function b2bTxt(v,n=500){return String(v??'').trim().replace(/[\u0000-\u001f]/g,' ').slice(0,n)}
    function b2bMoney(v){const n=Number(v);if(!Number.isFinite(n)||n<0||n>100000000)throw http(400,'INVALID_PRICE');return n}
    async function b2bCustomersApi(request,env,auth,headers,id,action,url){
      await adminB2bEnsure(env);
      if(request.method==='GET'&&!id){
        const q=b2bTxt(url.searchParams.get('q')||'',80),like='%'+q+'%';
        const rows=(await env.DB.prepare(`SELECT c.*,
          (SELECT COUNT(*) FROM b2b_quotes_v1 q WHERE q.business_id=c.business_id OR q.customer_id=c.id) quote_count,
          (SELECT MAX(created_at) FROM b2b_quotes_v1 q WHERE q.business_id=c.business_id OR q.customer_id=c.id) last_quote_at
          FROM b2b_customers_v1 c WHERE (?='' OR company_name LIKE ? OR contact_name LIKE ? OR phone LIKE ? OR email LIKE ?)
          ORDER BY COALESCE(last_order_at,created_at) DESC LIMIT 300`).bind(q,like,like,like,like).all()).results||[];
        return json({ok:true,data:rows},200,headers);
      }
      if(request.method==='GET'&&id){
        const customer=await env.DB.prepare(`SELECT * FROM b2b_customers_v1 WHERE id=? LIMIT 1`).bind(id).first();if(!customer)throw http(404,'CUSTOMER_NOT_FOUND');
        const quotes=(await env.DB.prepare(`SELECT * FROM b2b_quotes_v1 WHERE customer_id=? OR (business_id IS NOT NULL AND business_id=?) ORDER BY created_at DESC LIMIT 100`).bind(id,customer.business_id||'').all()).results||[];
        const orders=(await env.DB.prepare(`SELECT * FROM b2b_orders_v1 WHERE customer_id=? OR (business_id IS NOT NULL AND business_id=?) ORDER BY created_at DESC LIMIT 100`).bind(id,customer.business_id||'').all()).results||[];
        return json({ok:true,data:{customer,quotes,orders}},200,headers);
      }
      b2bRoleWrite(auth);
      if(request.method==='POST'&&!id){
        const b=await readJson(request),company=b2bTxt(b.companyName,160);if(!company)throw http(400,'COMPANY_REQUIRED');
        const cid=crypto.randomUUID();await env.DB.prepare(`INSERT INTO b2b_customers_v1(id,business_id,company_name,contact_name,phone,email,delivery_region,sales_rep_id,status) VALUES(?,?,?,?,?,?,?,?,?)`)
          .bind(cid,b2bTxt(b.businessId,80)||null,company,b2bTxt(b.contactName,120),b2bTxt(b.phone,40),b2bTxt(b.email,200),b2bTxt(b.deliveryRegion,160),b2bTxt(b.salesRepId,80)||null,'active').run();
        return json({ok:true,id:cid},201,headers);
      }
      if(request.method==='POST'&&id&&action==='status'){
        const b=await readJson(request),status=String(b.status||'').toLowerCase();if(!['active','follow_up','risky','dormant'].includes(status))throw http(400,'INVALID_STATUS');
        await env.DB.prepare(`UPDATE b2b_customers_v1 SET status=?,updated_at=datetime('now') WHERE id=?`).bind(status,id).run();return json({ok:true,status},200,headers);
      }
      throw http(405,'METHOD_NOT_ALLOWED');
    }
    async function b2bProductsAdminApi(request,env,auth,headers,id,action,url){
      await adminB2bEnsure(env);
      if(request.method==='GET'&&!id){const rows=(await env.DB.prepare(`SELECT p.*,
        (SELECT price FROM b2b_prices_v1 pr WHERE pr.product_id=p.id AND pr.active=1 ORDER BY valid_from DESC LIMIT 1) current_price
        FROM b2b_products_v1 p ORDER BY active DESC,name LIMIT 500`).all()).results||[];return json({ok:true,data:rows},200,headers)}
      b2bRoleWrite(auth);
      if(request.method==='POST'&&!id){
        const b=await readJson(request),name=b2bTxt(b.name,220);if(!name)throw http(400,'PRODUCT_NAME_REQUIRED');const pid=crypto.randomUUID();
        await env.DB.prepare(`INSERT INTO b2b_products_v1(id,source_product_id,name,category,origin,freshness,processing,unit,package_text,image_url,min_order,stock_status,active) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,1)`)
          .bind(pid,b2bTxt(b.sourceProductId,100)||null,name,b2bTxt(b.category,120)||'Deniz \u00dcr\u00fcnleri',b2bTxt(b.origin,100),b2bTxt(b.freshness,60),b2bTxt(b.processing,100),b2bTxt(b.unit,30)||'Kg',b2bTxt(b.packageText,140),b2bTxt(b.imageUrl,1200)||null,Number(b.minOrder||0),b2bTxt(b.stockStatus,30)||'ORDER').run();
        return json({ok:true,id:pid},201,headers);
      }
      if(request.method==='POST'&&id&&action==='edit'){
        const b=await readJson(request),name=b2bTxt(b.name,220),category=b2bTxt(b.category,120),unit=b2bTxt(b.unit,30),image=b2bTxt(b.imageUrl,1200);
        if(!name||!category||!unit)throw http(400,'PRODUCT_FIELDS_REQUIRED');
        if(image&&!/^https:\/\/[^\s<>"']+$/i.test(image))throw http(400,'INVALID_IMAGE_URL');
        const old=await env.DB.prepare(`SELECT id,name,category,unit,package_text,image_url FROM b2b_products_v1 WHERE id=? LIMIT 1`).bind(id).first();if(!old)throw http(404,'PRODUCT_NOT_FOUND');
        await env.DB.prepare(`UPDATE b2b_products_v1 SET name=?,category=?,unit=?,package_text=?,image_url=?,updated_at=datetime('now') WHERE id=?`)
          .bind(name,category,unit,b2bTxt(b.packageText,140),image||null,id).run();
        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'B2B_PRODUCT_EDIT',entityType:'b2b_product',entityId:id,before:old,after:{name,category,unit,package_text:b2bTxt(b.packageText,140),image_url:image||null}});
        return json({ok:true,id},200,headers);
      }
      if(request.method==='POST'&&id&&action==='stock'){const b=await readJson(request),st=String(b.stockStatus||'').toUpperCase();if(!['AVAILABLE','LIMITED','ORDER','OUT'].includes(st))throw http(400,'INVALID_STOCK_STATUS');await env.DB.prepare(`UPDATE b2b_products_v1 SET stock_status=?,updated_at=datetime('now') WHERE id=?`).bind(st,id).run();return json({ok:true,stockStatus:st},200,headers)}
      if(request.method==='POST'&&id&&action==='toggle'){const b=await readJson(request),active=b.active?1:0;await env.DB.prepare(`UPDATE b2b_products_v1 SET active=?,updated_at=datetime('now') WHERE id=?`).bind(active,id).run();return json({ok:true,active:!!active},200,headers)}
      throw http(405,'METHOD_NOT_ALLOWED');
    }
    async function b2bPricesAdminApi(request,env,auth,headers,id,action,url){
      await adminB2bEnsure(env);
      if(request.method==='GET'){const rows=(await env.DB.prepare(`SELECT * FROM b2b_prices_v1 ORDER BY created_at DESC LIMIT 500`).all()).results||[];return json({ok:true,data:rows},200,headers)}
      b2bRoleWrite(auth);
      if(request.method==='POST'){
        const b=await readJson(request),productId=b2bTxt(b.productId,100);if(!productId)throw http(400,'PRODUCT_REQUIRED');const price=b2bMoney(b.price);
        const old=await env.DB.prepare(`SELECT price FROM b2b_prices_v1 WHERE product_id=? AND active=1 ORDER BY valid_from DESC LIMIT 1`).bind(productId).first();
        await env.DB.prepare(`UPDATE b2b_prices_v1 SET active=0 WHERE product_id=? AND active=1`).bind(productId).run();
        await env.DB.prepare(`INSERT INTO b2b_prices_v1(id,product_id,price,currency,valid_until,active) VALUES(?,?,?,?,?,1)`).bind(crypto.randomUUID(),productId,price,b2bTxt(b.currency,8)||'TRY',b.validUntil||null).run();
        await env.DB.prepare(`INSERT INTO b2b_price_history_v1(id,product_id,old_price,new_price,actor) VALUES(?,?,?,?,?)`).bind(crypto.randomUUID(),productId,old?.price??null,price,auth.user.id).run();
        return json({ok:true,productId,price},201,headers);
      } throw http(405,'METHOD_NOT_ALLOWED');
    }
    async function b2bCustomerPricesAdminApi(request,env,auth,headers,id,action,url){
      await adminB2bEnsure(env);
      if(request.method==='GET'){const businessId=b2bTxt(url.searchParams.get('businessId')||'',100);const rows=businessId?(await env.DB.prepare(`SELECT * FROM b2b_customer_prices_v1 WHERE business_id=? ORDER BY updated_at DESC`).bind(businessId).all()).results:[];return json({ok:true,data:rows||[]},200,headers)}
      b2bRoleWrite(auth);if(request.method==='POST'){const b=await readJson(request),businessId=b2bTxt(b.businessId,100),productId=b2bTxt(b.productId,100),price=b2bMoney(b.price);if(!businessId||!productId)throw http(400,'SCOPE_REQUIRED');
        const old=await env.DB.prepare(`SELECT price FROM b2b_customer_prices_v1 WHERE business_id=? AND product_id=?`).bind(businessId,productId).first();
        await env.DB.prepare(`INSERT INTO b2b_customer_prices_v1(id,business_id,product_id,price,currency,valid_until,active) VALUES(?,?,?,?,?,?,1)
          ON CONFLICT(business_id,product_id) DO UPDATE SET price=excluded.price,currency=excluded.currency,valid_until=excluded.valid_until,active=1,updated_at=datetime('now')`)
          .bind(crypto.randomUUID(),businessId,productId,price,b2bTxt(b.currency,8)||'TRY',b.validUntil||null).run();
        await env.DB.prepare(`INSERT INTO b2b_price_history_v1(id,product_id,business_id,old_price,new_price,actor) VALUES(?,?,?,?,?,?)`).bind(crypto.randomUUID(),productId,businessId,old?.price??null,price,auth.user.id).run();
        return json({ok:true},201,headers)}throw http(405,'METHOD_NOT_ALLOWED');
    }
    async function b2bOrdersAdminApi(request,env,auth,headers,id,action,url){
      await adminB2bEnsure(env);if(request.method==='GET'&&!id){const rows=(await env.DB.prepare(`SELECT * FROM b2b_orders_v1 ORDER BY created_at DESC LIMIT 300`).all()).results||[];return json({ok:true,data:rows},200,headers)}
      if(request.method==='GET'&&id){const order=await env.DB.prepare(`SELECT * FROM b2b_orders_v1 WHERE id=?`).bind(id).first();if(!order)throw http(404,'ORDER_NOT_FOUND');const items=(await env.DB.prepare(`SELECT * FROM b2b_order_items_v1 WHERE order_id=?`).bind(id).all()).results||[];return json({ok:true,data:{order,items}},200,headers)}
      b2bRoleWrite(auth);if(request.method==='POST'&&id&&action==='status'){const b=await readJson(request),st=String(b.status||'').toUpperCase();if(!['NEW','CONFIRMED','PREPARING','DELIVERING','DELIVERED','CANCELLED'].includes(st))throw http(400,'INVALID_STATUS');await env.DB.prepare(`UPDATE b2b_orders_v1 SET status=?,updated_at=datetime('now') WHERE id=?`).bind(st,id).run();return json({ok:true,status:st},200,headers)}throw http(405,'METHOD_NOT_ALLOWED');
    }
    async function b2bReportsAdminApi(request,env,auth,headers,url){
      await adminB2bEnsure(env);
      const totals=await env.DB.prepare(`SELECT COUNT(*) quote_count,COALESCE(SUM(total),0) quote_value,
        SUM(CASE WHEN status='WON' THEN 1 ELSE 0 END) won_count,COALESCE(SUM(CASE WHEN status='WON' THEN total ELSE 0 END),0) won_value FROM b2b_quotes_v1`).first();
      const orders=await env.DB.prepare(`SELECT COUNT(*) order_count,COALESCE(SUM(total),0) order_value FROM b2b_orders_v1 WHERE status<>'CANCELLED'`).first();
      const products=(await env.DB.prepare(`SELECT product_name,SUM(quantity) quantity,COALESCE(SUM(line_total),0) value FROM b2b_order_items_v1 GROUP BY product_name ORDER BY quantity DESC LIMIT 20`).all()).results||[];
      const dormant=(await env.DB.prepare(`SELECT * FROM b2b_customers_v1 WHERE status IN ('risky','dormant') OR (last_order_at IS NOT NULL AND datetime(last_order_at)<datetime('now','-30 days')) ORDER BY last_order_at ASC LIMIT 100`).all()).results||[];
      const landingPerformance=(await env.DB.prepare(`SELECT COALESCE(source_landing,'DIRECT') source_landing,COALESCE(source_group,'') source_group,COUNT(*) quote_count,SUM(CASE WHEN status='WON' THEN 1 ELSE 0 END) won_count,COALESCE(SUM(CASE WHEN status='WON' THEN total ELSE 0 END),0) won_value FROM b2b_quotes_v1 GROUP BY COALESCE(source_landing,'DIRECT'),COALESCE(source_group,'') ORDER BY quote_count DESC LIMIT 150`).all()).results||[];
      return json({ok:true,totals,orders,topProducts:products,dormantCustomers:dormant,landingPerformance},200,headers);
    }
    async function b2bDashboardApi(request,env,auth,headers){
      await adminB2bEnsure(env);
      const s=await env.DB.prepare(`SELECT COUNT(*) total,SUM(status='NEW') new_count,SUM(status='REVIEWING') reviewing_count,SUM(status='PRICED') priced_count,SUM(status='WON') won_count,SUM(status='LOST') lost_count,COALESCE(SUM(CASE WHEN status='WON' THEN total ELSE 0 END),0) won_total FROM b2b_quotes_v1`).first();
      const today=(await env.DB.prepare(`SELECT * FROM b2b_customers_v1 WHERE status IN ('follow_up','risky','dormant') ORDER BY COALESCE(last_order_at,created_at) ASC LIMIT 30`).all()).results||[];
      return json({ok:true,summary:s,todayCall:today},200,headers);
    }

    
    async function b2bRepresentativesAdminApi(request,env,auth,headers,id,action,url){
      await adminB2bEnsure(env);
      if(request.method==='GET'){const rows=(await env.DB.prepare(`SELECT r.*,(SELECT COUNT(*) FROM b2b_customers_v1 c WHERE c.sales_rep_id=r.id) customer_count,(SELECT COUNT(*) FROM b2b_quotes_v1 q WHERE q.sales_rep_id=r.id) quote_count FROM b2b_sales_representatives_v1 r ORDER BY active DESC,name`).all()).results||[];return json({ok:true,data:rows},200,headers)}
      b2bRoleWrite(auth);
      if(request.method==='POST'&&!id){const b=await readJson(request),name=b2bTxt(b.name,120);if(!name)throw http(400,'NAME_REQUIRED');const rid=crypto.randomUUID();await env.DB.prepare(`INSERT INTO b2b_sales_representatives_v1(id,name,phone,email,region,active) VALUES(?,?,?,?,?,1)`).bind(rid,name,b2bTxt(b.phone,40),b2bTxt(b.email,200),b2bTxt(b.region,120)).run();await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'B2B_REP_CREATE',entityType:'b2b_sales_rep',entityId:rid});return json({ok:true,id:rid},201,headers)}
      if(request.method==='POST'&&id&&action==='status'){const b=await readJson(request),active=b.active?1:0;await env.DB.prepare(`UPDATE b2b_sales_representatives_v1 SET active=?,updated_at=datetime('now') WHERE id=?`).bind(active,id).run();return json({ok:true,active},200,headers)}
      throw http(405,'METHOD_NOT_ALLOWED');
    }
    async function b2bShowcaseAdminApi(request,env,auth,headers,id,action,url){
      await adminB2bEnsure(env);
      if(request.method==='GET'){const rows=(await env.DB.prepare(`SELECT * FROM b2b_showcase_v1 ORDER BY active DESC,sort_order,id`).all()).results||[];return json({ok:true,data:rows},200,headers)}
      b2bRoleWrite(auth);
      if(request.method==='POST'&&!id){const b=await readJson(request),title=b2bTxt(b.title,160);if(!title)throw http(400,'TITLE_REQUIRED');const sid=crypto.randomUUID();await env.DB.prepare(`INSERT INTO b2b_showcase_v1(id,slot,category,title,subtitle,image_url,cta_text,cta_url,active,sort_order) VALUES(?,'seafood_b2b','Deniz \u00dcr\u00fcnleri',?,?,?,?,?,1,?)`).bind(sid,title,b2bTxt(b.subtitle,400),b2bTxt(b.imageUrl,1500),b2bTxt(b.ctaText,80)||'\u00dcr\u00fcnleri \u0130ncele',b2bTxt(b.ctaUrl,300)||'/deniz-urunleri-b2b#urunler',Number.isFinite(Number(b.sortOrder))?Number(b.sortOrder):0).run();await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'B2B_SHOWCASE_CREATE',entityType:'b2b_showcase',entityId:sid});return json({ok:true,id:sid},201,headers)}
      if(request.method==='POST'&&id&&action==='status'){const b=await readJson(request),active=b.active?1:0;await env.DB.prepare(`UPDATE b2b_showcase_v1 SET active=?,updated_at=datetime('now') WHERE id=?`).bind(active,id).run();return json({ok:true,active},200,headers)}
      throw http(405,'METHOD_NOT_ALLOWED');
    }


    async function moduleFlagsEnsure(env){
      if(!env||!env.DB)throw http(503,'DB_NOT_BOUND');
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS oky_module_flags_v1(
        module_key TEXT PRIMARY KEY,
        enabled INTEGER NOT NULL DEFAULT 0 CHECK(enabled IN (0,1)),
        visibility TEXT NOT NULL DEFAULT 'HIDDEN' CHECK(visibility IN ('ACTIVE','HIDDEN','INTERNAL','SCHEDULED','ARCHIVED')),
        updated_by TEXT,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`).run();
      const defaults={PRODUCTS:[1,'ACTIVE'],QUOTE:[1,'ACTIVE'],PHOTO:[1,'ACTIVE'],WHATSAPP:[1,'ACTIVE'],SEO:[1,'ACTIVE'],MEMBERSHIP:[1,'ACTIVE'],DIGITAL_MENU:[1,'ACTIVE'],COST:[0,'HIDDEN'],COST_RADAR:[0,'HIDDEN'],ACADEMY:[0,'HIDDEN'],CESNI:[0,'HIDDEN'],EASY_RECIPE:[0,'HIDDEN'],ABOUT:[0,'HIDDEN']};
      for(const [key,[enabled,visibility]] of Object.entries(defaults))await env.DB.prepare(`INSERT OR IGNORE INTO oky_module_flags_v1(module_key,enabled,visibility) VALUES(?,?,?)`).bind(key,enabled,visibility).run();
    }
    async function moduleFlagsRoute(request,env,auth,headers){
      await moduleFlagsEnsure(env);
      if(request.method==='GET'){
        const rows=(await env.DB.prepare(`SELECT module_key,enabled,visibility,updated_by,updated_at FROM oky_module_flags_v1 ORDER BY module_key`).all()).results||[];
        return json({ok:true,data:rows},200,headers);
      }
      if(!['owner','admin'].includes(auth.user.role))throw http(403,'FORBIDDEN');
      if(request.method!=='POST')throw http(405,'METHOD_NOT_ALLOWED');
      const b=await readJson(request),key=String(b.moduleKey||'').trim().toUpperCase(),visibility=String(b.visibility||'').trim().toUpperCase(),enabled=b.enabled?1:0;
      if(!/^[A-Z0-9_]{2,50}$/.test(key))throw http(400,'INVALID_MODULE_KEY');
      if(!['ACTIVE','HIDDEN','INTERNAL','SCHEDULED','ARCHIVED'].includes(visibility))throw http(400,'INVALID_VISIBILITY');
      await env.DB.prepare(`INSERT INTO oky_module_flags_v1(module_key,enabled,visibility,updated_by,updated_at) VALUES(?,?,?,?,datetime('now')) ON CONFLICT(module_key) DO UPDATE SET enabled=excluded.enabled,visibility=excluded.visibility,updated_by=excluded.updated_by,updated_at=datetime('now')`).bind(key,enabled,visibility,auth.user.id).run();
      await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'MODULE_FLAG_CHANGED',entityType:'module_flag',entityId:key,after:{enabled:Boolean(enabled),visibility}});
      return json({ok:true,moduleKey:key,enabled:Boolean(enabled),visibility},200,headers);
    }

async function apiRoute(request, env, auth, headers) {
      const url = new URL(request.url), parts = url.pathname.split('/').filter(Boolean);
      const resource = parts[1], id = parts[2], action = parts[3];

      // Mesaj Merkezi: mevcut inquiries + inquiry_replies tablolar\u0131n\u0131 kullan\u0131r.
      if (resource === 'module-flags') return await moduleFlagsRoute(request,env,auth,headers);
      if (resource === 'commerce-admin') { if (auth.user.role !== 'owner') throw http(403,'OWNER_ONLY'); return await commerceAdminApi(request,env,auth,headers); }
      if (resource === 'b2b') return await b2bAdminApi(request, env, auth, headers, id, action, url);
      if (resource === 'b2b-customers') return await b2bCustomersApi(request,env,auth,headers,id,action,url);
      if (resource === 'b2b-products') return await b2bProductsAdminApi(request,env,auth,headers,id,action,url);
      if (resource === 'b2b-prices') return await b2bPricesAdminApi(request,env,auth,headers,id,action,url);
      if (resource === 'b2b-customer-prices') return await b2bCustomerPricesAdminApi(request,env,auth,headers,id,action,url);
      if (resource === 'b2b-orders') return await b2bOrdersAdminApi(request,env,auth,headers,id,action,url);
      if (resource === 'b2b-reports') return await b2bReportsAdminApi(request,env,auth,headers,url);
      if (resource === 'b2b-dashboard') return await b2bDashboardApi(request,env,auth,headers);
      if (resource === 'b2b-representatives') return await b2bRepresentativesAdminApi(request,env,auth,headers,id,action,url);
      if (resource === 'b2b-showcase') return await b2bShowcaseAdminApi(request,env,auth,headers,id,action,url);
      if (resource === 'messages') return await messageCenterRoute(request, env, auth, headers, id, action, url);
      if (resource === 'photo-messages') return await photoMessageRouteV2(request, env, auth, headers, id, action, url);
      if (resource === 'studio') return await studioRoute(request, env, auth, headers, id, action, url);
      if (resource === 'studio-media') return await studioMediaRoute(request, env, auth, headers, id, action, url);
      if (resource === 'admin-cleanup') return await adminCleanupRoute(request, env, auth, headers, id, action, url);

      if (resource === 'release_items' && id) throw http(400, 'COMPOSITE_KEY_REQUIRED');
      const allowed = {
        inquiries: ['owner','admin','editor','viewer'],
        inquiry_replies: ['owner','admin','editor','viewer'],
        media: ['owner','admin','editor','viewer'],
        content: ['owner','admin','editor','viewer'],
        content_revisions: ['owner','admin','editor','viewer'],
        releases: ['owner','admin','editor','viewer'],
        release_items: ['owner','admin','editor','viewer'],
        users: ['owner','admin']
      };
      if (!allowed[resource] || !allowed[resource].includes(auth.user.role)) throw http(403, 'FORBIDDEN');
      if (request.method === 'GET') {
        const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || 50), 1), 100);
        const rows = id
          ? [await env.DB.prepare(`SELECT * FROM ${resource} WHERE id=? LIMIT 1`).bind(id).first()].filter(Boolean)
          : (await env.DB.prepare(`SELECT * FROM ${resource} ORDER BY rowid DESC LIMIT ?`).bind(limit).all()).results;
        await audit(env, { actorUserId: auth.user.id, actorSessionId: auth.session.id, action: 'READ', entityType: resource, entityId: id || 'list' });
        return json({ ok: true, data: redact(resource, rows) }, 200, headers);
      }
      if (!['owner','admin','editor'].includes(auth.user.role)) throw http(403, 'READ_ONLY_ROLE');
      if (request.method === 'POST' && resource === 'inquiry_replies') return createReply(request, env, auth, headers);
      if (request.method === 'POST' && resource === 'media') return createMediaLink(request, env, auth, headers);
      if (request.method === 'POST' && resource === 'content_revisions') return createRevision(request, env, auth, headers);
      throw http(405, 'METHOD_NOT_ALLOWED');
    }

    async function photoMessageRouteV2(request,env,auth,headers,id,action,url){
      if(!['owner','admin','editor','viewer'].includes(auth.user.role))throw http(403,'FORBIDDEN');
      const canWrite=['owner','admin','editor'].includes(auth.user.role);if(!env.PHOTO_TEMP)throw http(503,'PHOTO_TEMP_NOT_BOUND');
      const publicCols=`id,request_no,business_name,contact_name,phone,status,media_name,media_mime,media_size,media_expires_at,opened_at,downloaded_at,deleted_at,claimed_by,created_at,updated_at`;
      if(request.method==='GET'&&!id){const rows=(await env.DB.prepare(`SELECT ${publicCols} FROM photo_inquiries ORDER BY rowid DESC LIMIT 100`).all()).results||[];const exists=await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='photo_notification_jobs_v1'").first();if(exists){const jobs=(await env.DB.prepare(`SELECT inquiry_id,state,attempts,last_error FROM photo_notification_jobs_v1 WHERE inquiry_id IN (SELECT id FROM photo_inquiries ORDER BY rowid DESC LIMIT 100)`).all()).results||[];const byId=new Map(jobs.map(j=>[j.inquiry_id,j]));for(const row of rows)row.notification=byId.get(row.id)||{state:'NOT_QUEUED'}}return json({ok:true,data:rows},200,headers)}
      if(request.method==='GET'&&id&&action==='file'){
        const token=String(url.searchParams.get('token')||'');if(!token)throw http(403,'TRANSFER_TOKEN_REQUIRED');const row=await env.DB.prepare('SELECT * FROM photo_inquiries WHERE id=? LIMIT 1').bind(id).first();if(!row)throw http(404,'PHOTO_NOT_FOUND');if(row.deleted_at||['DELETE_PENDING','DELETED'].includes(row.status)||!row.temp_media_key)throw http(410,'PHOTO_DELETED');if(row.status!=='OPENED'||row.claimed_by!==auth.user.id||!row.claimed_at||Date.now()-Date.parse(String(row.claimed_at).replace(' ','T')+'Z')>600000||!timingSafe(await sha256(token),String(row.last_error||'')))throw http(409,'INVALID_TRANSFER_SESSION');
        const value=await env.PHOTO_TEMP.get(row.temp_media_key,{type:'arrayBuffer'});if(!value)throw http(410,'PHOTO_EXPIRED');if(value.byteLength!==Number(row.media_size)||await bytesSha256(value)!==String(row.media_sha256))throw http(409,'PHOTO_INTEGRITY_FAILED');await env.DB.prepare(`UPDATE photo_inquiries SET downloaded_at=datetime('now'),updated_at=datetime('now') WHERE id=? AND status='OPENED' AND claimed_by=?`).bind(id,auth.user.id).run();
        const h=new Headers(headers),safe=String(row.request_no||'okyanus').replace(/[^A-Za-z0-9_-]/g,'_'),ext=row.media_mime==='image/png'?'png':row.media_mime==='image/webp'?'webp':'jpg';h.set('Content-Type',['image/jpeg','image/png','image/webp'].includes(row.media_mime)?row.media_mime:'application/octet-stream');h.set('Content-Length',String(value.byteLength));h.set('Content-Disposition',`attachment; filename="${safe}.${ext}"`);h.set('Cache-Control','private, no-store, max-age=0');h.set('Pragma','no-cache');return new Response(value,{status:200,headers:h});
      }
      if(request.method==='GET'&&id){const row=await env.DB.prepare(`SELECT ${publicCols} FROM photo_inquiries WHERE id=? LIMIT 1`).bind(id).first();if(!row)throw http(404,'PHOTO_NOT_FOUND');return json({ok:true,data:row},200,headers)}
      if(!canWrite)throw http(403,'READ_ONLY_ROLE');
      if(request.method==='POST'&&id&&action==='view-start'){
        const token=randomToken(32),tokenHash=await sha256(token);const result=await env.DB.prepare(`UPDATE photo_inquiries SET status='OPENED',opened_at=COALESCE(opened_at,datetime('now')),claimed_by=?,claimed_at=datetime('now'),downloaded_at=NULL,last_error=?,updated_at=datetime('now'),version=version+1 WHERE id=? AND deleted_at IS NULL AND (status='NEW' OR (status='OPENED' AND (claimed_by=? OR claimed_at IS NULL OR datetime(claimed_at)<datetime('now','-10 minutes'))))`).bind(auth.user.id,tokenHash,id,auth.user.id).run();if(Number(result?.meta?.changes||0)!==1){const x=await env.DB.prepare('SELECT status,deleted_at FROM photo_inquiries WHERE id=? LIMIT 1').bind(id).first();if(!x)throw http(404,'PHOTO_NOT_FOUND');if(x.deleted_at||['DELETE_PENDING','DELETED'].includes(x.status))throw http(410,'PHOTO_DELETED');throw http(409,'PHOTO_ALREADY_CLAIMED')}await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'PHOTO_VIEW_STARTED',entityType:'photo_inquiry',entityId:id});return json({ok:true,transferToken:token,expiresIn:600},200,headers);
      }
      if(request.method==='POST'&&id&&action==='ack-delete'){
        const b=await readJson(request),token=String(b.transferToken||''),row=await env.DB.prepare('SELECT * FROM photo_inquiries WHERE id=? LIMIT 1').bind(id).first();if(!row)throw http(404,'PHOTO_NOT_FOUND');if(row.status==='DELETED'||row.deleted_at)return json({ok:true,status:'DELETED',duplicate:true},200,headers);if(!['OPENED','DELETE_PENDING'].includes(row.status)||row.claimed_by!==auth.user.id||!row.downloaded_at||!token||!timingSafe(await sha256(token),String(row.last_error||''))||String(b.sha256||'')!==String(row.media_sha256||'')||Number(b.byteCount)!==Number(row.media_size))throw http(409,'TRANSFER_PROOF_MISMATCH');
        if(row.status==='OPENED'){const cas=await env.DB.prepare(`UPDATE photo_inquiries SET status='DELETE_PENDING',updated_at=datetime('now'),version=version+1 WHERE id=? AND status='OPENED' AND claimed_by=? AND downloaded_at IS NOT NULL`).bind(id,auth.user.id).run();if(Number(cas?.meta?.changes||0)!==1)throw http(409,'DELETE_STATE_CONFLICT')}
        try{await env.PHOTO_TEMP.delete(row.temp_media_key);const remains=await env.PHOTO_TEMP.get(row.temp_media_key,{type:'arrayBuffer'});if(remains){await env.DB.prepare(`UPDATE photo_inquiries SET delete_attempts=delete_attempts+1,deletion_result='KV_DELETE_PENDING',updated_at=datetime('now') WHERE id=?`).bind(id).run();return json({ok:true,status:'DELETE_PENDING',retry:true,message:'Silme do\u011frulan\u0131yor; yeniden deneyin.'},202,headers)}await env.DB.prepare(`UPDATE photo_inquiries SET status='DELETED',temp_media_key=NULL,deleted_at=datetime('now'),deletion_result='KV_DELETE_VERIFIED',last_error=NULL,updated_at=datetime('now'),version=version+1 WHERE id=? AND status='DELETE_PENDING'`).bind(id).run();await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'PHOTO_DELETE_SUCCESS',entityType:'photo_inquiry',entityId:id});return json({ok:true,status:'DELETED'},200,headers)}catch(e){await env.DB.prepare(`UPDATE photo_inquiries SET delete_attempts=delete_attempts+1,deletion_result='KV_DELETE_FAILED',updated_at=datetime('now') WHERE id=?`).bind(id).run();throw http(503,'PHOTO_DELETE_RETRY_REQUIRED')}
      }
      if(request.method==='POST'&&id&&action==='status'){const b=await readJson(request),status=String(b.status||'').toUpperCase();if(!['CONTACTED','QUOTED','WON','LOST'].includes(status))throw http(400,'INVALID_STATUS');const row=await env.DB.prepare('SELECT id,status,deleted_at FROM photo_inquiries WHERE id=? LIMIT 1').bind(id).first();if(!row)throw http(404,'PHOTO_NOT_FOUND');if(!row.deleted_at)throw http(409,'PHOTO_MUST_BE_DELETED_FIRST');await env.DB.prepare('UPDATE photo_inquiries SET status=?,updated_at=datetime(\'now\'),version=version+1 WHERE id=?').bind(status,id).run();return json({ok:true,status},200,headers)}throw http(405,'METHOD_NOT_ALLOWED');
    }
    async function bytesSha256(buffer){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',buffer))].map(x=>x.toString(16).padStart(2,'0')).join('')}

    async function photoMessageRoute(request,env,auth,headers,id,action,url){
      if(!['owner','admin','editor','viewer'].includes(auth.user.role))throw http(403,'FORBIDDEN');
      const canWrite=['owner','admin','editor'].includes(auth.user.role);
      if(!env.PHOTO_TEMP)throw http(503,'PHOTO_TEMP_NOT_BOUND');
      if(request.method==='GET'&&!id){
        const rows=(await env.DB.prepare(`SELECT id,request_no,business_name,contact_name,phone,status,media_name,media_mime,media_size,media_sha256,media_expires_at,opened_at,downloaded_at,deleted_at,claimed_by,created_at,updated_at FROM photo_inquiries ORDER BY rowid DESC LIMIT 100`).all()).results||[];
        return json({ok:true,data:rows},200,headers);
      }
      if(request.method==='GET'&&id&&action==='file'){
        const row=await env.DB.prepare('SELECT * FROM photo_inquiries WHERE id=? LIMIT 1').bind(id).first();
        if(!row)throw http(404,'PHOTO_NOT_FOUND');
        if(row.deleted_at||['DELETE_PENDING','DELETED'].includes(row.status)||!row.temp_media_key)throw http(410,'PHOTO_DELETED');
        if(row.status!=='OPENED'||row.claimed_by!==auth.user.id)throw http(409,'PHOTO_NOT_CLAIMED_BY_USER');
        const value=await env.PHOTO_TEMP.get(row.temp_media_key,{type:'arrayBuffer'});if(!value)throw http(410,'PHOTO_EXPIRED');
        const h=new Headers(headers);h.set('Content-Type',['image/jpeg','image/png','image/webp'].includes(row.media_mime)?row.media_mime:'application/octet-stream');h.set('Content-Length',String(row.media_size||value.byteLength));h.set('Content-Disposition',`attachment; filename="${String(row.request_no||'okyanus').replace(/[^A-Za-z0-9_-]/g,'_')}.${row.media_mime==='image/png'?'png':row.media_mime==='image/webp'?'webp':'jpg'}"`);h.set('Cache-Control','private, no-store, max-age=0');h.set('Pragma','no-cache');
        return new Response(value,{status:200,headers:h});
      }
      if(request.method==='GET'&&id){const row=await env.DB.prepare(`SELECT id,request_no,business_name,contact_name,phone,status,media_name,media_mime,media_size,media_sha256,media_expires_at,opened_at,downloaded_at,deleted_at,claimed_by,created_at,updated_at FROM photo_inquiries WHERE id=? LIMIT 1`).bind(id).first();if(!row)throw http(404,'PHOTO_NOT_FOUND');return json({ok:true,data:row},200,headers)}
      if(!canWrite)throw http(403,'READ_ONLY_ROLE');
      if(request.method==='POST'&&id&&action==='view-start'){
        const current=await env.DB.prepare('SELECT id,status,claimed_by,deleted_at FROM photo_inquiries WHERE id=? LIMIT 1').bind(id).first();if(!current)throw http(404,'PHOTO_NOT_FOUND');if(current.deleted_at||['DELETE_PENDING','DELETED'].includes(current.status))throw http(410,'PHOTO_DELETED');
        if(current.status==='NEW'){const result=await env.DB.prepare(`UPDATE photo_inquiries SET status='OPENED',opened_at=COALESCE(opened_at,datetime('now')),claimed_by=?,claimed_at=COALESCE(claimed_at,datetime('now')),updated_at=datetime('now'),version=version+1 WHERE id=? AND status='NEW' AND deleted_at IS NULL`).bind(auth.user.id,id).run();if(Number(result?.meta?.changes||0)!==1)throw http(409,'PHOTO_ALREADY_CLAIMED')}
        else if(current.status!=='OPENED'||current.claimed_by!==auth.user.id)throw http(409,'PHOTO_ALREADY_CLAIMED');
        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'PHOTO_VIEW_STARTED',entityType:'photo_inquiry',entityId:id});
        return json({ok:true},200,headers);
      }
      if(request.method==='POST'&&id&&action==='ack-delete'){
        const b=await readJson(request),row=await env.DB.prepare('SELECT * FROM photo_inquiries WHERE id=? LIMIT 1').bind(id).first();if(!row)throw http(404,'PHOTO_NOT_FOUND');if(row.status==='DELETED'||row.deleted_at)return json({ok:true,status:'DELETED',duplicate:true},200,headers);if(row.status!=='OPENED'||row.claimed_by!==auth.user.id)throw http(409,'INVALID_PHOTO_STATE');if(String(b.sha256||'')!==String(row.media_sha256||'')||Number(b.byteCount)!==Number(row.media_size))throw http(409,'TRANSFER_PROOF_MISMATCH');
        await env.DB.prepare(`UPDATE photo_inquiries SET status='DELETE_PENDING',downloaded_at=datetime('now'),updated_at=datetime('now'),version=version+1 WHERE id=? AND status='OPENED' AND claimed_by=?`).bind(id,auth.user.id).run();
        try{await env.PHOTO_TEMP.delete(row.temp_media_key);await env.DB.prepare(`UPDATE photo_inquiries SET status='DELETED',temp_media_key=NULL,deleted_at=datetime('now'),deletion_result='KV_DELETE_OK',updated_at=datetime('now'),version=version+1 WHERE id=?`).bind(id).run();await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'PHOTO_DELETE_SUCCESS',entityType:'photo_inquiry',entityId:id});return json({ok:true,status:'DELETED'},200,headers)}catch(e){await env.DB.prepare(`UPDATE photo_inquiries SET delete_attempts=delete_attempts+1,deletion_result='KV_DELETE_FAILED',last_error=?,updated_at=datetime('now') WHERE id=?`).bind(String(e?.message||e).slice(0,160),id).run();await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'PHOTO_DELETE_FAILED',entityType:'photo_inquiry',entityId:id});throw http(503,'PHOTO_DELETE_RETRY_REQUIRED')}
      }
      if(request.method==='POST'&&id&&action==='status'){
        const b=await readJson(request),status=String(b.status||'').toUpperCase();if(!['CONTACTED','QUOTED','WON','LOST'].includes(status))throw http(400,'INVALID_STATUS');const row=await env.DB.prepare('SELECT id,status FROM photo_inquiries WHERE id=? LIMIT 1').bind(id).first();if(!row)throw http(404,'PHOTO_NOT_FOUND');if(!row.status||!['DELETED','CONTACTED','QUOTED','WON','LOST'].includes(row.status))throw http(409,'PHOTO_MUST_BE_DELETED_FIRST');await env.DB.prepare('UPDATE photo_inquiries SET status=?,updated_at=datetime(\'now\'),version=version+1 WHERE id=?').bind(status,id).run();await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'PHOTO_STATUS',entityType:'photo_inquiry',entityId:id,before:row,after:{status}});return json({ok:true,status},200,headers)
      }
      throw http(405,'METHOD_NOT_ALLOWED');
    }

    async function messageCenterRoute(request, env, auth, headers, id, action, url) {
      if (!['owner','admin','editor','viewer'].includes(auth.user.role)) throw http(403,'FORBIDDEN');
      const canWrite = ['owner','admin','editor'].includes(auth.user.role);
      if (request.method === 'GET' && !id) {
        const box = String(url.searchParams.get('box') || 'inbox');
        const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || 100),1),100);
        let rows=[];
        if(box==='sent') rows=(await env.DB.prepare(`SELECT r.*,i.name customer_name,i.email customer_email FROM inquiry_replies r LEFT JOIN inquiries i ON i.id=r.inquiry_id WHERE r.status='sent' ORDER BY r.rowid DESC LIMIT ?`).bind(limit).all()).results;
        else if(box==='archive') rows=(await env.DB.prepare(`SELECT * FROM inquiries WHERE status='archived' ORDER BY rowid DESC LIMIT ?`).bind(limit).all()).results;
        else rows=(await env.DB.prepare(`SELECT * FROM inquiries WHERE COALESCE(status,'new')<>'archived' ORDER BY rowid DESC LIMIT ?`).bind(limit).all()).results;
        const unread=await env.DB.prepare(`SELECT COUNT(*) n FROM inquiries WHERE COALESCE(status,'new')='new'`).first();
        return json({ok:true,data:rows,unread:Number(unread?.n||0)},200,headers);
      }
      if (request.method === 'GET' && id) {
        const inquiry=await env.DB.prepare('SELECT * FROM inquiries WHERE id=? LIMIT 1').bind(id).first();
        if(!inquiry)throw http(404,'MESSAGE_NOT_FOUND');
        const replies=(await env.DB.prepare('SELECT * FROM inquiry_replies WHERE inquiry_id=? ORDER BY rowid ASC').bind(id).all()).results;
        return json({ok:true,data:{inquiry,replies}},200,headers);
      }
      if(!canWrite)throw http(403,'READ_ONLY_ROLE');
      if(request.method==='POST' && id && action==='status'){
        const b=await readJson(request), status=String(b.status||'');
        if(!['new','read','replied','archived'].includes(status))throw http(400,'INVALID_STATUS');
        const before=await env.DB.prepare('SELECT id,status FROM inquiries WHERE id=? LIMIT 1').bind(id).first();
        if(!before)throw http(404,'MESSAGE_NOT_FOUND');
        await env.DB.prepare('UPDATE inquiries SET status=? WHERE id=?').bind(status,id).run();
        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'MESSAGE_STATUS',entityType:'inquiry',entityId:id,before,after:{status}});
        return json({ok:true,status},200,headers);
      }
      if(request.method==='POST' && id && action==='reply'){
        const b=await readJson(request), body=clean(b.body||'',10000), subject=clean(b.subject||'',200), mode=String(b.mode||'draft');
        if(!body)throw http(400,'MISSING_BODY');
        const inquiry=await env.DB.prepare('SELECT * FROM inquiries WHERE id=? LIMIT 1').bind(id).first();
        if(!inquiry)throw http(404,'MESSAGE_NOT_FOUND');
        const replyId=crypto.randomUUID(), now=new Date().toISOString(), recipient=clean(inquiry.email||'',320), finalSubject=subject||('Okyanus EDT \u00b7 '+clean(inquiry.subject||'Mesaj\u0131n\u0131z',150));
        if(mode!=='send'){
          await env.DB.prepare(`INSERT INTO inquiry_replies(id,inquiry_id,author_id,channel,recipient,subject,body,status,created_at) VALUES(?,?,?,'email',?,?,?,'draft',?)`).bind(replyId,id,auth.user.id,recipient,finalSubject,body,now).run();
          await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'CREATE_DRAFT_REPLY',entityType:'inquiry_reply',entityId:replyId});
          return json({ok:true,id:replyId,status:'draft',message:'Taslak kaydedildi.'},201,headers);
        }
        validateEmail(recipient);
        try{
          await sendAdminEmail(env,{to:recipient,subject:finalSubject,text:body});
          await env.DB.prepare(`INSERT INTO inquiry_replies(id,inquiry_id,author_id,channel,recipient,subject,body,status,created_at) VALUES(?,?,?,'email',?,?,?,'sent',?)`).bind(replyId,id,auth.user.id,recipient,finalSubject,body,now).run();
          await env.DB.prepare(`UPDATE inquiries SET status='replied' WHERE id=?`).bind(id).run();
          await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'SEND_REPLY',entityType:'inquiry_reply',entityId:replyId,after:{recipient}});
          return json({ok:true,id:replyId,status:'sent',message:'\u0130leti ba\u015far\u0131yla g\u00f6nderildi.'},201,headers);
        }catch(e){
          console.error('ADMIN_REPLY_SEND_ERROR',e);
          await env.DB.prepare(`INSERT INTO inquiry_replies(id,inquiry_id,author_id,channel,recipient,subject,body,status,created_at) VALUES(?,?,?,'email',?,?,?,'draft',?)`).bind(replyId,id,auth.user.id,recipient,finalSubject,body,now).run();
          await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'SEND_REPLY_FAILED',entityType:'inquiry_reply',entityId:replyId,after:{recipient,error:String(e?.message||e).slice(0,160)}});
          return json({ok:false,error:'SEND_FAILED_DRAFT_SAVED',draftId:replyId,message:'G\u00f6nderim ba\u015far\u0131s\u0131z oldu; yan\u0131t taslak olarak sakland\u0131.'},502,headers);
        }
      }
      throw http(404,'NOT_FOUND');
    }

    function adminMailConfig(env){return{from:String(env.ADMIN_MAIL_FROM||env.MAIL_FROM||'').trim()}}
    async function sendAdminEmail(env,m){
      if(!env||!env.EMAIL||typeof env.EMAIL.send!=='function')throw new Error('EMAIL_BINDING_MISSING');
      const cfg=adminMailConfig(env); if(!cfg.from)throw new Error('MAIL_FROM_MISSING');
      validateEmail(cfg.from); validateEmail(m.to);
      return await env.EMAIL.send({to:m.to,from:cfg.from,replyTo:cfg.from,subject:clean(m.subject,180),text:String(m.text||'')});
    }

    async function createReply(request, env, auth, headers) {
      const b = await readJson(request), id = crypto.randomUUID(), now = new Date().toISOString();
      if (!b.inquiryId || !b.body) throw http(400, 'MISSING_FIELDS');
      await env.DB.prepare(`INSERT INTO inquiry_replies(id,inquiry_id,author_id,channel,recipient,subject,body,status,created_at)
        VALUES(?,?,?,'internal_note',?,?,?,'draft',?)`).bind(id,b.inquiryId,auth.user.id,clean(b.recipient||'',320),clean(b.subject||'',200),clean(b.body,10000),now).run();
      await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'CREATE_DRAFT_REPLY',entityType:'inquiry_reply',entityId:id});
      return json({ok:true,id},201,headers);
    }

    async function studioRoute(request,env,auth,headers,id,action,url){
      if(!['owner','admin','editor','viewer'].includes(auth.user.role)) throw http(403,'FORBIDDEN');
      const canWrite=['owner','admin','editor'].includes(auth.user.role);
      if(request.method==='GET'&&!id){
        const rows=(await env.DB.prepare(`SELECT * FROM studio_projects ORDER BY updated_at DESC LIMIT 100`).all()).results||[];
        return json({ok:true,data:rows.map(studioPublic)},200,headers);
      }
      if(request.method==='GET'&&id){
        const row=await env.DB.prepare('SELECT * FROM studio_projects WHERE id=? LIMIT 1').bind(id).first();
        if(!row)throw http(404,'STUDIO_PROJECT_NOT_FOUND'); return json({ok:true,data:studioPublic(row)},200,headers);
      }
      if(!canWrite)throw http(403,'READ_ONLY_ROLE');
      const b=await readJson(request);
      if(request.method==='POST'&&!id){
        const pid=crypto.randomUUID(),now=new Date().toISOString(),payload=normalizeStudioPayload(b);
        await env.DB.prepare(`INSERT INTO studio_projects(id,title,status,platform,aspect_ratio,payload_json,created_by,created_at,updated_at) VALUES(?,?,'draft',?,?,?,?,?,?)`)
          .bind(pid,clean(b.title||'Ads\u0131z St\u00fcdyo Projesi',180),payload.platform,payload.aspectRatio,JSON.stringify(payload),auth.user.id,now,now).run();
        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'STUDIO_CREATE',entityType:'studio_project',entityId:pid});
        return json({ok:true,id:pid},201,headers);
      }
      if(request.method==='POST'&&id&&action==='save'){
        const payload=normalizeStudioPayload(b); const title=clean(b.title||'Ads\u0131z St\u00fcdyo Projesi',180);
        const r=await env.DB.prepare(`UPDATE studio_projects SET title=?,platform=?,aspect_ratio=?,payload_json=?,updated_at=datetime('now') WHERE id=?`).bind(title,payload.platform,payload.aspectRatio,JSON.stringify(payload),id).run();
        if(!r.meta?.changes)throw http(404,'STUDIO_PROJECT_NOT_FOUND');
        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'STUDIO_SAVE',entityType:'studio_project',entityId:id});
        return json({ok:true,id},200,headers);
      }
      if(request.method==='POST'&&id&&action==='remix'){
        const row=await env.DB.prepare('SELECT * FROM studio_projects WHERE id=? LIMIT 1').bind(id).first(); if(!row)throw http(404,'STUDIO_PROJECT_NOT_FOUND');
        let p={};try{p=JSON.parse(row.payload_json||'{}')}catch{}; const scenes=Array.isArray(p.scenes)?p.scenes:[];
        const seed=crypto.randomUUID();
        p.scenes=studioRemixScenes(scenes,seed); p.rejiSeed=seed; p.rejiMode='automatic'; p.version=2;
        await env.DB.prepare(`UPDATE studio_projects SET payload_json=?,updated_at=datetime('now') WHERE id=?`).bind(JSON.stringify(p),id).run();
        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'STUDIO_REMIX',entityType:'studio_project',entityId:id});
        return json({ok:true,data:p},200,headers);
      }
      if(request.method==='POST'&&id&&action==='publish'){
        const row=await env.DB.prepare('SELECT * FROM studio_projects WHERE id=? LIMIT 1').bind(id).first();
        if(!row)throw http(404,'STUDIO_PROJECT_NOT_FOUND');
        let p={};try{p=JSON.parse(row.payload_json||'{}')}catch{throw http(409,'STUDIO_PAYLOAD_INVALID')}
        const scenes=Array.isArray(p.scenes)?p.scenes:[];
        if(!scenes.length)throw http(409,'STUDIO_SCENES_REQUIRED');
        const pubId=crypto.randomUUID(),now=new Date().toISOString();

        // D1 batch: vitrin durumu tek kontroll\u00fc yazma grubu i\u00e7inde g\u00fcncellenir.
        await env.DB.batch([
          env.DB.prepare(`UPDATE studio_publications SET active=0,updated_at=? WHERE slot='homepage_vitrine' AND active=1`).bind(now),
          env.DB.prepare(`UPDATE studio_projects SET status='superseded',updated_at=? WHERE status='published' AND id<>?`).bind(now,id),
          env.DB.prepare(`INSERT INTO studio_publications(id,project_id,slot,title,payload_json,active,published_by,published_at,updated_at) VALUES(?,?,'homepage_vitrine',?,?,1,?,?,?)`)
            .bind(pubId,id,clean(row.title,180),JSON.stringify(p),auth.user.id,now,now),
          env.DB.prepare(`UPDATE studio_projects SET status='published',updated_at=? WHERE id=?`).bind(now,id)
        ]);

        // Yazma sonras\u0131 do\u011frulama: yaln\u0131z bir aktif kay\u0131t ve do\u011fru proje.
        const check=await env.DB.prepare(`SELECT id,project_id,title,published_at FROM studio_publications WHERE slot='homepage_vitrine' AND active=1 ORDER BY published_at DESC LIMIT 2`).all();
        const activeRows=check.results||[];
        if(activeRows.length!==1||String(activeRows[0].id)!==pubId||String(activeRows[0].project_id)!==String(id)){
          throw http(500,'VITRINE_PUBLISH_VERIFY_FAILED');
        }

        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'STUDIO_PUBLISH_VITRINE',entityType:'studio_publication',entityId:pubId,after:{projectId:id,slot:'homepage_vitrine',verified:true}});
        return json({ok:true,publicationId:pubId,projectId:id,active:true,publishedAt:now,verified:true},201,headers);
      }
      throw http(405,'METHOD_NOT_ALLOWED');
    }
    function normalizeStudioPayload(b){
      const scenes=Array.isArray(b.scenes)?b.scenes.slice(0,30).map((s,i)=>({id:clean(s.id||('scene-'+(i+1)),80),type:['image','video','text'].includes(s.type)?s.type:'image',url:clean(s.url||'',2000),headline:clean(s.headline||'',180),text:clean(s.text||'',600),cta:clean(s.cta||'',80),duration:Math.min(Math.max(Number(s.duration||5),1),30),transition:['cut','fade','slide','zoom'].includes(s.transition)?s.transition:'fade',position:i})):[];
      return {version:2,platform:['web','instagram','tiktok','linkedin'].includes(b.platform)?b.platform:'web',aspectRatio:['16:9','1:1','9:16','4:5'].includes(b.aspectRatio)?b.aspectRatio:'16:9',rejiMode:b.rejiMode==='manual'?'manual':'automatic',musicUrl:clean(b.musicUrl||'',2000),voiceUrl:clean(b.voiceUrl||'',2000),logoUrl:clean(b.logoUrl||'',2000),scenes};
    }
    function studioRemixScenes(scenes,seed){
      const list=scenes.map((x,i)=>({...x,position:i})); if(list.length<2)return list;
      let h=0;for(const c of String(seed))h=(h*31+c.charCodeAt(0))>>>0;
      for(let i=list.length-1;i>0;i--){h=(1664525*h+1013904223)>>>0;const j=h%(i+1);[list[i],list[j]]=[list[j],list[i]]}
      const transitions=['fade','slide','zoom','cut'];return list.map((x,i)=>({...x,position:i,transition:transitions[(h+i)%transitions.length]}));
    }
    function studioPublic(r){let payload={};try{payload=JSON.parse(r.payload_json||'{}')}catch{};return {id:r.id,title:r.title,status:r.status,platform:r.platform,aspectRatio:r.aspect_ratio,payload,createdAt:r.created_at,updatedAt:r.updated_at}}


    async function publicStudioMedia(request,env,headers,url){
      if(!['GET','HEAD'].includes(request.method))throw http(405,'METHOD_NOT_ALLOWED');
      if(!env.MEDIA_STORE)throw http(503,'MEDIA_STORE_NOT_BOUND');
      const id=decodeURIComponent(url.pathname.slice('/studio-media/'.length)).replace(/[^A-Za-z0-9._-]/g,'');
      if(!id)throw http(404,'MEDIA_NOT_FOUND');
      const got=await env.MEDIA_STORE.getWithMetadata('studio/'+id,{type:'arrayBuffer',cacheTtl:60});
      if(!got||!got.value)throw http(404,'MEDIA_NOT_FOUND');
      const meta=got.metadata||{};
      const h=new Headers(headers);h.set('Content-Type',String(meta.mime||'application/octet-stream'));h.set('Cache-Control','public, max-age=3600, s-maxage=86400');h.set('X-Content-Type-Options','nosniff');
      if(meta.size)h.set('Content-Length',String(meta.size));
      return new Response(request.method==='HEAD'?null:got.value,{status:200,headers:h});
    }

    async function studioMediaRoute(request,env,auth,headers,id,action,url){
      if(!['owner','admin','editor','viewer'].includes(auth.user.role))throw http(403,'FORBIDDEN');
      if(!env.MEDIA_STORE)throw http(503,'MEDIA_STORE_NOT_BOUND');
      if(request.method==='POST'&&!id){
        if(!['owner','admin','editor'].includes(auth.user.role))throw http(403,'READ_ONLY_ROLE');
        const ct=String(request.headers.get('content-type')||'');if(!ct.includes('multipart/form-data'))throw http(415,'MULTIPART_REQUIRED');
        const fd=await request.formData(),file=fd.get('file');if(!file||typeof file.arrayBuffer!=='function')throw http(400,'FILE_REQUIRED');
        const mime=String(file.type||'').toLowerCase(),allowed=['image/jpeg','image/png','image/webp'];if(!allowed.includes(mime))throw http(415,'IMAGE_TYPE_NOT_ALLOWED');
        const max=8*1024*1024;if(Number(file.size||0)<1||Number(file.size)>max)throw http(413,'IMAGE_MAX_8_MB');
        const bytes=await file.arrayBuffer();if(bytes.byteLength>max)throw http(413,'IMAGE_MAX_8_MB');
        const ext=mime==='image/png'?'png':mime==='image/webp'?'webp':'jpg',mid=crypto.randomUUID()+'.'+ext,key='studio/'+mid;
        const originalName=clean(file.name||('gorsel.'+ext),255),now=new Date().toISOString(),digest=await bytesSha256(bytes);
        await env.MEDIA_STORE.put(key,bytes,{metadata:{mime,size:bytes.byteLength,name:originalName,uploadedBy:auth.user.id,uploadedAt:now}});
        const publicUrl=new URL('/studio-media/'+mid,request.url).href;
        try{
          await env.DB.prepare(`INSERT INTO media(id,storage_key,original_name,media_type,mime_type,byte_size,sha256,width,height,duration_ms,alt_text,title,metadata_json,status,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,NULL,NULL,NULL,?,?,?,'ready',?,?,?)`)
            .bind(mid,publicUrl,originalName,'image',mime,bytes.byteLength,digest,'',originalName,JSON.stringify({source:'studio-upload',kvKey:key}),auth.user.id,now,now).run();
        }catch(e){
          try{await env.MEDIA_STORE.delete(key)}catch(_){}
          throw e;
        }
        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'STUDIO_MEDIA_UPLOAD',entityType:'media',entityId:mid,after:{mime,size:bytes.byteLength,url:publicUrl,sha256:digest}});
        return json({ok:true,id:mid,url:publicUrl,mime,size:bytes.byteLength,sha256:digest},201,headers);
      }
      if(request.method==='DELETE'&&id){
        if(!['owner','admin'].includes(auth.user.role))throw http(403,'FORBIDDEN');
        const safe=String(id).replace(/[^A-Za-z0-9._-]/g,'');if(!safe)throw http(400,'INVALID_MEDIA_ID');await env.MEDIA_STORE.delete('studio/'+safe);
        await env.DB.prepare(`DELETE FROM media WHERE id=? AND json_extract(metadata_json,'$.source')='studio-upload'`).bind(safe).run();
        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'STUDIO_MEDIA_DELETE',entityType:'media',entityId:safe});return json({ok:true},200,headers);
      }
      throw http(405,'METHOD_NOT_ALLOWED');
    }

    async function adminCleanupRoute(request,env,auth,headers,id,action,url){
      if(!['owner','admin'].includes(auth.user.role))throw http(403,'OWNER_ADMIN_REQUIRED');
      if(request.method!=='POST')throw http(405,'METHOD_NOT_ALLOWED');
      const b=await readJson(request),kind=String(b.kind||''),ids=[...new Set((Array.isArray(b.ids)?b.ids:[]).map(x=>String(x||'').trim()).filter(Boolean))].slice(0,100);
      if(!ids.length)throw http(400,'NO_SELECTION');

      const result={deleted:[],blocked:[],failed:[],diagnostics:[]};
      for(const rid of ids){
        try{
          if(kind==='messages'){
            const row=await env.DB.prepare('SELECT id FROM inquiries WHERE id=? LIMIT 1').bind(rid).first();
            if(!row){result.failed.push({id:rid,error:'MESSAGE_NOT_FOUND'});continue}
            await env.DB.batch([
              env.DB.prepare('DELETE FROM inquiry_replies WHERE inquiry_id=?').bind(rid),
              env.DB.prepare('DELETE FROM inquiries WHERE id=?').bind(rid)
            ]);
            await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'ADMIN_DELETE_MESSAGE',entityType:'inquiry',entityId:rid});
            result.deleted.push(rid);
            continue;
          }

          if(kind==='media'){
            let stage='MEDIA_SELECT';
            try{
              const row=await env.DB.prepare('SELECT * FROM media WHERE id=? LIMIT 1').bind(rid).first();
              if(!row){result.failed.push({id:rid,error:'MEDIA_NOT_FOUND',stage});continue}
              const mediaUrl=String(row.storage_key||'');

              stage='PROJECT_REFERENCE_CHECK';
              const projectRef=Number((await env.DB.prepare(`SELECT COUNT(*) n FROM studio_projects WHERE instr(COALESCE(payload_json,''), ?) > 0`).bind(mediaUrl).first())?.n||0);

              stage='PUBLICATION_REFERENCE_CHECK';
              const publicationRef=Number((await env.DB.prepare(`SELECT COUNT(*) n FROM studio_publications WHERE active=1 AND instr(COALESCE(payload_json,''), ?) > 0`).bind(mediaUrl).first())?.n||0);
              if(projectRef||publicationRef){result.blocked.push({id:rid,error:'MEDIA_IN_USE',projectRef,publicationRef});continue}

              stage='METADATA_PARSE';
              let meta={};try{meta=JSON.parse(row.metadata_json||'{}')}catch(parseError){
                result.diagnostics.push({id:rid,stage,error:'INVALID_METADATA_JSON',detail:String(parseError?.message||parseError).slice(0,180)});
                meta={};
              }

              stage='MEDIA_SOFT_DELETE_UPDATE';
              const deletedAt=new Date().toISOString();
              const nextMeta={...meta,adminDeleted:true,adminDeletedAt:deletedAt,adminDeletedBy:auth.user.id};
              const upd=await env.DB.prepare(`UPDATE media SET metadata_json=?,updated_at=? WHERE id=?`).bind(JSON.stringify(nextMeta),deletedAt,rid).run();
              if(!upd?.success)throw new Error('D1_UPDATE_NOT_SUCCESSFUL');

              // Audit is important, but an audit write failure must not falsely report that
              // a successful media update itself failed. It is returned as a warning.
              stage='AUDIT_WRITE';
              try{
                await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'ADMIN_SOFT_DELETE_MEDIA',entityType:'media',entityId:rid,before:{storageKey:mediaUrl,source:meta.source||''},after:{adminDeleted:true}});
              }catch(auditError){
                console.error('ADMIN_MEDIA_AUDIT_ERROR',rid,auditError?.message||auditError);
                result.diagnostics.push({id:rid,stage:'AUDIT_WRITE',error:'AUDIT_WRITE_FAILED',detail:String(auditError?.message||auditError).slice(0,220)});
              }

              result.deleted.push(rid);
              continue;
            }catch(mediaError){
              const detail=String(mediaError?.message||mediaError).replace(/\s+/g,' ').slice(0,220);
              console.error('ADMIN_MEDIA_DELETE_DIAGNOSTIC',rid,stage,detail);
              result.failed.push({id:rid,error:'MEDIA_DELETE_FAILED',stage,detail});
              result.diagnostics.push({id:rid,stage,error:'MEDIA_DELETE_FAILED',detail});
              continue;
            }
          }

          if(kind==='content'){
            const row=await env.DB.prepare('SELECT * FROM content WHERE id=? LIMIT 1').bind(rid).first();
            if(!row){result.failed.push({id:rid,error:'CONTENT_NOT_FOUND'});continue}
            const revisions=Number((await env.DB.prepare('SELECT COUNT(*) n FROM content_revisions WHERE content_id=?').bind(rid).first())?.n||0);
            if(revisions){result.blocked.push({id:rid,error:'CONTENT_HAS_REVISIONS',revisions});continue}
            await env.DB.prepare('DELETE FROM content WHERE id=?').bind(rid).run();
            await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'ADMIN_DELETE_CONTENT',entityType:'content',entityId:rid});
            result.deleted.push(rid);
            continue;
          }
          throw http(400,'INVALID_CLEANUP_KIND');
        }catch(e){
          if(e?.status)throw e;
          const detail=String(e?.message||e).replace(/\s+/g,' ').slice(0,220);
          console.error('ADMIN_CLEANUP_ITEM_ERROR',kind,rid,detail);
          result.failed.push({id:rid,error:'DELETE_FAILED',stage:'OUTER_CLEANUP',detail});
          result.diagnostics.push({id:rid,stage:'OUTER_CLEANUP',error:'DELETE_FAILED',detail});
        }
      }
      return json({ok:true,...result},200,headers);
    }

    async function createMediaLink(request, env, auth, headers) {
      const b=await readJson(request); let parsed; try { parsed=new URL(b.url); } catch { throw http(400,'INVALID_URL'); }
      if(parsed.protocol!=='https:') throw http(400,'HTTPS_REQUIRED');
      const id=crypto.randomUUID(),now=new Date().toISOString(),type=['image','video','document'].includes(b.mediaType)?b.mediaType:'document',externalSha=await sha256(parsed.href);
      try{
        await env.DB.prepare(`INSERT INTO media(id,storage_key,original_name,media_type,mime_type,byte_size,sha256,width,height,duration_ms,alt_text,title,metadata_json,status,created_by,created_at,updated_at)
          VALUES(?,?,?,?,?,0,?,NULL,NULL,NULL,?,?,?,'pending',?,?,?)`).bind(id,parsed.href,clean(b.originalName||parsed.pathname.split('/').pop()||'harici-dosya',255),type,clean(b.mimeType||'application/octet-stream',120),externalSha,clean(b.altText||'',500),clean(b.title||'',200),JSON.stringify({external:true,source:'external-link'}),auth.user.id,now,now).run();
      }catch(e){
        console.error('CREATE_MEDIA_LINK_DB_ERROR',String(e?.message||e));
        throw http(500,'MEDIA_LINK_DB_WRITE_FAILED');
      }
      await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'CREATE_MEDIA_LINK',entityType:'media',entityId:id,after:{url:parsed.href}});
      return json({ok:true,id},201,headers);
    }

    async function createRevision(request, env, auth, headers) {
      const b=await readJson(request), id=crypto.randomUUID(), now=new Date().toISOString();
      const last=await env.DB.prepare('SELECT COALESCE(MAX(revision_number),0) n FROM content_revisions WHERE content_id=?').bind(b.contentId).first();
      const n=Number(last?.n||0)+1;
      await env.DB.prepare(`INSERT INTO content_revisions(id,content_id,revision_number,payload_json,change_summary,validation_status,validation_json,created_by,created_at,approval_status)
        VALUES(?,?,?,?,?,'pending','{}',?,?,'draft')`).bind(id,b.contentId,n,JSON.stringify(b.payload||{}),clean(b.summary||'',500),auth.user.id,now).run();
      await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'CREATE_REVISION',entityType:'content_revision',entityId:id,after:{contentId:b.contentId,revision:n}});
      return json({ok:true,id,revision:n},201,headers);
    }

    async function summaryRoute(env, headers) {
      const names=['users','inquiries','media','content','releases']; const data={};
      for(const name of names) data[name]=Number((await env.DB.prepare(`SELECT COUNT(*) n FROM ${name}`).first())?.n||0);
      return json({ok:true,data},200,headers);
    }

    async function audit(env, e) {
      await env.DB.prepare(`INSERT INTO audit_log(occurred_at,actor_user_id,actor_session_id,action,entity_type,entity_id,request_id,ip_hash,before_json,after_json,metadata_json)
        VALUES(?,?,?,?,?,?,?,?,?,?,?)`).bind(new Date().toISOString(),e.actorUserId||null,e.actorSessionId||null,e.action,e.entityType,e.entityId||null,crypto.randomUUID(),null,e.before?JSON.stringify(e.before):null,e.after?JSON.stringify(e.after):null,'{}').run();
    }

    async function requireCsrf(request, auth, env) {
      const token=request.headers.get('X-CSRF-Token')||'';
      if (!token) throw http(403,'CSRF_REQUIRED');
      const got=await sha256(token+(env.SESSION_PEPPER||''));
      if(!timingSafe(got,auth.csrfHash)) throw http(403,'CSRF_INVALID');
    }
    function enforceAccess(request, env) {
      if (env.REQUIRE_CF_ACCESS === 'true' && !request.headers.get('Cf-Access-Authenticated-User-Email')) throw http(403,'CLOUDFLARE_ACCESS_REQUIRED');
    }
    function enforceOrigin(request){
      const fetchSite=(request.headers.get('Sec-Fetch-Site')||'').toLowerCase();
      if(fetchSite==='cross-site') throw http(403,'ORIGIN_DENIED');
      if(fetchSite==='same-origin'||fetchSite==='same-site'||fetchSite==='none') return;
      const origin=request.headers.get('Origin');
      if(!origin) return;
      let originHost='';
      try{originHost=new URL(origin).host.toLowerCase()}catch{throw http(403,'ORIGIN_DENIED')}
      const requestHost=(request.headers.get('Host')||new URL(request.url).host).toLowerCase();
      const forwardedHost=(request.headers.get('X-Forwarded-Host')||'').split(',')[0].trim().toLowerCase();
      if(originHost!==requestHost&&originHost!==forwardedHost) throw http(403,'ORIGIN_DENIED');
    }
    async function readJson(request){ if(!String(request.headers.get('content-type')||'').includes('application/json')) throw http(415,'JSON_REQUIRED'); const t=await request.text(); if(t.length>65536) throw http(413,'PAYLOAD_TOO_LARGE'); try{return JSON.parse(t)}catch{throw http(400,'INVALID_JSON')} }
    function clean(v,n){return String(v||'').trim().slice(0,n)}
    function validateEmail(v){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v||'')))throw http(400,'INVALID_EMAIL')}
    function validatePassword(v){if(String(v||'').length<14||!/[A-Z]/.test(v)||!/[a-z]/.test(v)||!/[0-9]/.test(v)||!/[^A-Za-z0-9]/.test(v))throw http(400,'WEAK_PASSWORD')}
    function randomToken(n){const a=new Uint8Array(n);crypto.getRandomValues(a);return b64(a)}
    function b64(a){return btoa(String.fromCharCode(...a)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
    async function sha256(s){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(s)))].map(x=>x.toString(16).padStart(2,'0')).join('')}
    async function hashPassword(password){const salt=randomToken(16),iterations=PASSWORD_ITERATIONS,key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:enc.encode(salt),iterations},key,256);return `pbkdf2_sha256$${iterations}$${salt}$${b64(new Uint8Array(bits))}`}
    async function verifyPassword(password,stored){try{const[,it,salt,want]=stored.split('$'),key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']),bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:enc.encode(salt),iterations:Number(it)},key,256);return timingSafe(b64(new Uint8Array(bits)),want)}catch{return false}}
    function timingSafe(a,b){a=String(a);b=String(b);if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0}
    function cookie(s,n){const m=s.match(new RegExp('(?:^|;\\s*)'+n+'=([^;]+)'));return m?m[1]:''}
    function isFutureSqlite(v){if(!v)return false;const normalized=/T/.test(v)?v:String(v).replace(' ','T')+'Z';const t=Date.parse(normalized);return Number.isFinite(t)&&t>Date.now()}
    function publicUser(u){return{id:u.id,email:u.email,displayName:u.display_name,role:u.role}}
    function redact(resource,rows){return rows.map(r=>{const x={...r};delete x.password_hash;delete x.token_hash;delete x.csrf_secret_hash;if(resource==='inquiries'){if(x.email)x.email=x.email.replace(/(^.).*(@.*$)/,'$1***$2');if(x.phone)x.phone='***'+String(x.phone).slice(-4);delete x.request_ip_hash}return x})}
    function http(status,message){return Object.assign(new Error(message),{status})}
    function securityHeaders(){return new Headers({'Content-Security-Policy':"default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src 'self' data: https:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",'Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Cache-Control':'no-store'})}
    function json(v,status,h){const x=new Headers(h);x.set('Content-Type','application/json; charset=utf-8');return new Response(JSON.stringify(v),{status,headers:x})}
    function html(v,status,h){const x=new Headers(h);x.set('Content-Type','text/html; charset=utf-8');return new Response(v,{status,headers:x})}
    function redirect(p,h){const x=new Headers(h);x.set('Location',p);return new Response(null,{status:302,headers:x})}

    function shell(title,body){body=String(body).replace(/>DELETED</g,'>G\u00d6R\u00dcLD\u00dc \u2013 S\u0130L\u0130ND\u0130<').replace(/Durum:<\/b> DELETED/g,'Durum:</b> G\u00d6R\u00dcLD\u00dc \u2013 S\u0130L\u0130ND\u0130').replace('<div class="tablewrap"><table><thead><tr><th>Tarih</th><th>Talep No</th>','<div class="tablewrap photoTable"><table><thead><tr><th>Tarih</th><th>Talep No</th>');return `<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title><style>${css()}.photoTable{overflow-x:auto}.photoTable table{width:100%;min-width:920px;table-layout:auto}.photoTable th,.photoTable td{white-space:nowrap;word-break:normal}.photoTable th:nth-child(1),.photoTable td:nth-child(1){min-width:185px}.photoTable th:nth-child(2),.photoTable td:nth-child(2){min-width:185px}.photoTable th:nth-child(3),.photoTable td:nth-child(3){min-width:135px}.photoTable th:nth-child(5),.photoTable td:nth-child(5){min-width:125px}.photoTable th:nth-child(6),.photoTable td:nth-child(6){min-width:155px}.photoTable td:last-child a{display:inline-flex;align-items:center;justify-content:center;min-width:52px;min-height:40px}</style><body><main>${body}</main></body></html>`}
    function setupPage(){return shell('\u0130lk Kurulum',`<section class="card"><h1>Okyanus EDT</h1><h2>G\u00fcvenli ilk y\u00f6netici kurulumu</h2><form method="post" action="/setup"><input name="bootstrapToken" type="password" required placeholder="Tek kullan\u0131ml\u0131k kurulum anahtar\u0131"><input name="displayName" required placeholder="Ad soyad"><input name="email" type="email" required placeholder="E-posta"><input name="password" type="password" required minlength="14" placeholder="En az 14 karakter g\u00fc\u00e7l\u00fc \u015fifre"><button type="submit">Y\u00f6netici hesab\u0131n\u0131 olu\u015ftur</button></form></section>`)}
    function loginPage(){return shell('Y\u00f6netici Giri\u015fi',`<section class="card"><h1>Okyanus EDT</h1><h2>Y\u00f6netici Paneli</h2><form method="post" action="/login"><input name="email" type="email" required autocomplete="username" placeholder="E-posta"><input name="password" type="password" required autocomplete="current-password" placeholder="\u015eifre"><button type="submit">G\u00fcvenli giri\u015f</button></form></section>`)}
    async function dashboard(user,env,url){
      const view=String(url.searchParams.get('view')||'summary');
      const box=String(url.searchParams.get('box')||'inbox');
      const selectedId=String(url.searchParams.get('id')||'');
      const role=user.user.role;
      const canWrite=['owner','admin','editor'].includes(role);
      const nav=`<nav class="sideNav"><a href="/?view=summary">\u2302 Genel Bak\u0131\u015f</a><a href="/commerce">\ud83d\uded2 Ticaret Y\u00f6netimi</a><a href="/?view=photo-messages">\u25a3 Foto\u011frafl\u0131 Talepler</a><a href="/?view=messages&box=inbox">\u2709 Mesaj Merkezi</a><a href="/?view=studio">\ud83c\udfac \u0130\u00e7erik St\u00fcdyosu</a><a href="/?view=media">\u25a3 Medya</a><a href="/?view=content">\u25a4 \u0130\u00e7erik</a><a href="/?view=content_revisions">\u21bb Revizyonlar</a><a href="/?view=releases">\u2713 Yay\u0131nlar</a><a href="/?view=users">\u2659 Kullan\u0131c\u0131lar</a><a href="/?view=module-flags">\u25c9 Sat\u0131\u015f Modu & Mod\u00fcl Kontrol\u00fc</a><a href="/cesni">\u2668 \u00c7E\u015eN\u0130 Y\u00f6netimi</a><a href="/account/password">\u26bf Parola</a><a href="/print" target="_blank">\u25a7 Rapor</a><a href="https://www.okyonusedt.com/" rel="noopener">\ud83c\udfe0 Ana Siteye Ge\u00e7</a><button id="logout" class="danger" type="button">\u00c7\u0131k\u0131\u015f</button></nav>`;
      let title='Genel Bak\u0131\u015f',help='Sistemin g\u00fcncel durumunu izleyin.',body='';
      try{
        if(view==='summary'){
          const counts={}; for(const t of ['users','inquiries','media','content','releases']) counts[t]=Number((await env.DB.prepare(`SELECT COUNT(*) n FROM ${t}`).first())?.n||0);
          const unread=Number((await env.DB.prepare(`SELECT COUNT(*) n FROM inquiries WHERE COALESCE(status,'new')='new'`).first())?.n||0);
          body=`<div class="stats">${[['users','Kullan\u0131c\u0131'],['inquiries','Mesaj'],['media','Medya'],['content','\u0130\u00e7erik'],['releases','Yay\u0131n']].map(([k,l])=>`<article><b>${counts[k]}</b><span>${l}</span></article>`).join('')}</div><section class="guide"><h3>H\u0131zl\u0131 kullan\u0131m</h3><p>Okunmam\u0131\u015f mesaj: <b>${unread}</b>. Sol men\u00fcdeki her b\u00f6l\u00fcm sunucu taraf\u0131nda ba\u011f\u0131ms\u0131z a\u00e7\u0131l\u0131r.</p></section>`;
        } else if(view==='photo-messages'){
          title='Foto\u011frafl\u0131 Talepler';help='Al\u0131\u015f listesi foto\u011fraflar\u0131n\u0131 g\u00fcvenli bi\u00e7imde teslim al\u0131n; tam aktar\u0131m sonras\u0131 ge\u00e7ici kopya otomatik silinir.';
          if(selectedId){const p=await env.DB.prepare('SELECT * FROM photo_inquiries WHERE id=? LIMIT 1').bind(selectedId).first();if(!p)throw new Error('PHOTO_NOT_FOUND');const tel=String(p.phone||'').replace(/[^0-9+]/g,''),wa=String(p.phone||'').replace(/\D/g,'').replace(/^0/,'90');body=`<section class="guide"><h3>${escapeHtml(p.request_no)}</h3><p><b>\u0130\u015fletme:</b> ${escapeHtml(p.business_name)}<br><b>Yetkili:</b> ${escapeHtml(p.contact_name)}<br><b>Telefon:</b> ${escapeHtml(p.phone)}<br><b>Durum:</b> ${escapeHtml(p.status)}<br><b>Olu\u015fturma:</b> ${escapeHtml(p.created_at)}</p><div class="actions"><a class="button" href="tel:${escapeHtml(tel)}">Ara</a><a class="button" target="_blank" rel="noopener" href="https://wa.me/${escapeHtml(wa)}">WhatsApp</a>${canWrite&&!p.deleted_at&&!['DELETE_PENDING','DELETED'].includes(p.status)?'<button id="photoDownload" type="button">Foto\u011fraf\u0131 \u0130ndir ve Sistemden Sil</button>':''}</div><p><small>Silme yaln\u0131z dosyan\u0131n tamam\u0131 taray\u0131c\u0131ya ula\u015ft\u0131ktan ve boyut/checksum do\u011fruland\u0131ktan sonra ba\u015flar. Bilgisayara indirilen kopyan\u0131n korunmas\u0131 i\u015fletme politikan\u0131za tabidir.</small></p></section>`}
          else{const rows=(await env.DB.prepare(`SELECT id,request_no,business_name,contact_name,phone,status,created_at FROM photo_inquiries ORDER BY rowid DESC LIMIT 100`).all()).results||[];body=rows.length?`<div class="tablewrap"><table><thead><tr><th>Tarih</th><th>Talep No</th><th>\u0130\u015fletme</th><th>Yetkili</th><th>Telefon</th><th>Durum</th><th></th></tr></thead><tbody>${rows.map(p=>`<tr><td>${escapeHtml(p.created_at)}</td><td>${escapeHtml(p.request_no)}</td><td>${escapeHtml(p.business_name)}</td><td>${escapeHtml(p.contact_name)}</td><td>${escapeHtml(p.phone)}</td><td>${escapeHtml(p.status)}</td><td><a href="/?view=photo-messages&id=${encodeURIComponent(p.id)}">A\u00e7</a></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">Hen\u00fcz foto\u011frafl\u0131 talep bulunmuyor.</div>'}
        } else if(view==='messages'){
          title='Mesaj Merkezi'; help='Gelen, giden ve ar\u015fiv m\u00fc\u015fteri yaz\u0131\u015fmalar\u0131n\u0131 y\u00f6netin.';
          let rows=[];
          if(box==='sent') rows=(await env.DB.prepare(`SELECT r.*,i.name customer_name,i.email customer_email FROM inquiry_replies r LEFT JOIN inquiries i ON i.id=r.inquiry_id WHERE r.status='sent' ORDER BY r.rowid DESC LIMIT 100`).all()).results||[];
          else if(box==='archive') rows=(await env.DB.prepare(`SELECT * FROM inquiries WHERE status='archived' ORDER BY rowid DESC LIMIT 100`).all()).results||[];
          else rows=(await env.DB.prepare(`SELECT * FROM inquiries WHERE COALESCE(status,'new')<>'archived' ORDER BY rowid DESC LIMIT 100`).all()).results||[];
          const unread=Number((await env.DB.prepare(`SELECT COUNT(*) n FROM inquiries WHERE COALESCE(status,'new')='new'`).first())?.n||0);
          body=`<div class="msgTabs"><a href="/?view=messages&box=inbox">\ud83d\udce5 Gelen ${unread?`<b>(${unread})</b>`:''}</a><a href="/?view=messages&box=sent">\ud83d\udce4 Giden</a><a href="/?view=messages&box=archive">\ud83d\uddc2 Ar\u015fiv</a></div>`;
          if(selectedId){
            const i=await env.DB.prepare('SELECT * FROM inquiries WHERE id=? LIMIT 1').bind(selectedId).first();
            if(i){const replies=(await env.DB.prepare('SELECT * FROM inquiry_replies WHERE inquiry_id=? ORDER BY rowid ASC').bind(selectedId).all()).results||[];
              body+=`<section class="guide"><h3>${escapeHtml(i.subject||'Mesaj')}</h3><p><b>${escapeHtml(i.name||'')}</b> \u00b7 ${escapeHtml(i.email||'')} \u00b7 ${escapeHtml(i.phone||'')}</p><p style="white-space:pre-wrap">${escapeHtml(i.message||'')}</p><h4>Konu\u015fma ge\u00e7mi\u015fi</h4>${replies.length?replies.map(r=>`<p><b>${escapeHtml(r.status)}</b> \u00b7 ${escapeHtml(r.created_at)}<br>${escapeHtml(r.body)}</p>`).join(''):'<p>Hen\u00fcz yan\u0131t yok.</p>'}${canWrite?`<form id="replyForm" class="editor"><input name="subject" value="${escapeHtml('Okyanus EDT \u00b7 '+(i.subject||'Mesaj\u0131n\u0131z'))}"><textarea name="body" required placeholder="Yan\u0131t\u0131n\u0131z\u0131 yaz\u0131n"></textarea><div class="actions"><button type="button" id="draftBtn">Taslak Kaydet</button><button type="submit">Yan\u0131tla ve G\u00f6nder</button><button type="button" id="archiveBtn">Ar\u015fivle</button></div></form>`:''}</section>`;
            }
          }
          if(!selectedId){const canDeleteMessages=['owner','admin'].includes(role)&&box!=='sent';body+=rows.length?`${canDeleteMessages?`<div class="actions"><label><input id="selectAllMessages" type="checkbox"> T\u00fcm\u00fcn\u00fc Se\u00e7</label><button id="deleteSelectedMessages" class="danger" type="button">Se\u00e7ilen Mesajlar\u0131 Sil</button></div>`:''}<div class="tablewrap"><table><thead><tr>${canDeleteMessages?'<th>Se\u00e7</th>':''}<th>Tarih</th><th>Ad</th><th>E-posta</th><th>Konu</th><th>Durum</th><th></th></tr></thead><tbody>${rows.map(r=>{const mid=r.inquiry_id||r.id;return `<tr>${canDeleteMessages?`<td><input class="messageSelect" type="checkbox" value="${escapeHtml(mid)}"></td>`:''}<td>${escapeHtml(r.created_at)}</td><td>${escapeHtml(r.name||r.customer_name||'')}</td><td>${escapeHtml(r.email||r.recipient||r.customer_email||'')}</td><td>${escapeHtml(r.subject||'')}</td><td>${escapeHtml(r.status||'')}</td><td>${mid?`<a href="/?view=messages&box=${encodeURIComponent(box)}&id=${encodeURIComponent(mid)}">A\u00e7</a>`:''}</td></tr>`}).join('')}</tbody></table></div>`:'<div class="empty">Bu kutuda hen\u00fcz kay\u0131t bulunmuyor.</div>';}
        } else if(view==='studio'){
          title='\u0130\u00e7erik St\u00fcdyosu \u00b7 Profesyonel Reji';help='Mevcut y\u00f6netim mimarisi korunarak \u00e7oklu sahne, otomatik/manuel reji, canl\u0131 \u00f6nizleme ve Okyanus Vitrini yay\u0131n\u0131.';
          const projects=(await env.DB.prepare(`SELECT * FROM studio_projects ORDER BY updated_at DESC LIMIT 50`).all()).results||[];
          body=`<section class="studioGrid"><div class="editor"><h3>Yeni \u00e7al\u0131\u015fma</h3><form id="studioForm"><input name="title" required maxlength="180" placeholder="\u00c7al\u0131\u015fma ba\u015fl\u0131\u011f\u0131"><div class="grid"><select name="platform"><option value="web">Web</option><option value="instagram">Instagram</option><option value="tiktok">TikTok</option><option value="linkedin">LinkedIn</option></select><select name="aspectRatio"><option>16:9</option><option>1:1</option><option>9:16</option><option>4:5</option></select></div><select name="rejiMode"><option value="automatic">Otomatik Reji</option><option value="manual">Manuel Timeline</option></select><div class="grid"><input name="logoUrl" type="url" placeholder="Logo HTTPS ba\u011flant\u0131s\u0131"><input name="musicUrl" type="url" placeholder="M\u00fczik HTTPS ba\u011flant\u0131s\u0131"></div><input name="voiceUrl" type="url" placeholder="Seslendirme HTTPS ba\u011flant\u0131s\u0131"><div class="studioToolbar"><b>Sahneler</b><button type="button" id="addScene">+ Sahne Ekle</button></div><div id="sceneList"></div><button>\ud83c\udfac Taslak Olu\u015ftur</button></form></div><div class="studioPreview"><h3>Canl\u0131 \u00d6nizleme</h3><div id="studioStage" class="studioStage"><div id="stageMedia"></div><div class="stageCopy"><b>Okyanus EDT</b><span>\u0130\u00e7eri\u011finizi soldan olu\u015fturun.</span></div></div><div id="studioTimeline" class="studioTimeline"></div><p class="muted">Medya dosyas\u0131n\u0131n kendisi D1 i\u00e7ine g\u00f6m\u00fclmez. Proje, reji ve HTTPS medya referanslar\u0131 saklan\u0131r.</p></div></section>`;
          if(projects.length)body+=`<h3 style="margin-top:24px">Projeler</h3><div class="tablewrap"><table><thead><tr><th>Ba\u015fl\u0131k</th><th>Durum</th><th>Platform</th><th>G\u00fcncelleme</th><th>\u0130\u015flem</th></tr></thead><tbody>${projects.map(p=>`<tr><td>${escapeHtml(p.title)}</td><td>${escapeHtml(p.status)}</td><td>${escapeHtml(p.platform)}</td><td>${escapeHtml(p.updated_at)}</td><td><button class="studioRemix" data-id="${escapeHtml(p.id)}">Ba\u015fka Montaj Yap</button><button class="studioPublish" data-id="${escapeHtml(p.id)}">Okyanus Vitrinine G\u00f6nder</button></td></tr>`).join('')}</tbody></table></div>`;
          else body+='<div class="empty">Hen\u00fcz St\u00fcdyo projesi yok.</div>';
        } else {
          const cfg={media:['Medya Ba\u011flant\u0131lar\u0131','HTTPS medya kay\u0131tlar\u0131n\u0131 y\u00f6netin.'],content:['\u0130\u00e7erikler','Y\u00f6netilebilir i\u00e7erikleri g\u00f6r\u00fcnt\u00fcleyin.'],content_revisions:['Revizyonlar','\u0130\u00e7erik revizyonlar\u0131n\u0131 y\u00f6netin.'],releases:['Yay\u0131nlar','Yay\u0131n paketlerini g\u00f6r\u00fcnt\u00fcleyin.'],users:['Kullan\u0131c\u0131lar','Yetkili kullan\u0131c\u0131lar\u0131 g\u00f6r\u00fcnt\u00fcleyin.']};
          if(!cfg[view]) throw new Error('UNKNOWN_VIEW'); title=cfg[view][0];help=cfg[view][1];
          const rows=(await env.DB.prepare(view==='media'?`SELECT * FROM media WHERE COALESCE(json_extract(metadata_json,'$.adminDeleted'),0)<>1 ORDER BY rowid DESC LIMIT 100`:`SELECT * FROM ${view} ORDER BY rowid DESC LIMIT 100`).all()).results||[];
          if(view==='media'&&canWrite) body+=`<form id="mediaUploadForm" class="editor"><h3>Bilgisayardan g\u00f6rsel y\u00fckle</h3><div class="grid"><input id="mediaUploadFile" name="file" type="file" accept="image/jpeg,image/png,image/webp" required><input id="mediaUploadResult" readonly placeholder="Y\u00fckleme sonras\u0131 HTTPS adresi burada olu\u015fur"></div><button>\ud83d\udcf7 G\u00f6rseli Y\u00fckle</button><p class="muted">JPEG, PNG veya WebP \u00b7 en fazla 8 MB \u00b7 dosya MEDYA_MA\u011eAZASI (MEDIA_STORE uyumluluk ad\u0131) i\u00e7inde saklan\u0131r.</p></form><form id="mediaForm" class="editor"><h3>Harici medya ba\u011flant\u0131s\u0131</h3><div class="grid"><input name="title" required placeholder="Ba\u015fl\u0131k"><select name="mediaType"><option value="image">G\u00f6rsel</option><option value="video">Video</option><option value="document">Belge</option></select><input name="url" type="url" required placeholder="https://..."><input name="altText" placeholder="A\u00e7\u0131klama"></div><button>Ba\u011flant\u0131y\u0131 ekle</button></form>`;
          if(view==='content_revisions'&&canWrite) body+=`<form id="revisionForm" class="editor"><h3>Yeni revizyon tasla\u011f\u0131</h3><div class="grid"><input name="contentId" required placeholder="\u0130\u00e7erik ID"><input name="summary" required placeholder="De\u011fi\u015fiklik \u00f6zeti"></div><textarea name="payload" placeholder="JSON">{}</textarea><button>Taslak olu\u015ftur</button></form>`;
          if(rows.length){const hidden=new Set(['password_hash','token_hash','csrf_secret_hash','request_ip_hash']);const cols=Object.keys(rows[0]).filter(k=>!hidden.has(k)).slice(0,7),cleanupKind=(view==='media'||view==='content')?view:'',canCleanup=['owner','admin'].includes(role)&&!!cleanupKind;if(canCleanup)body+=`<div class="actions"><label><input id="selectAllCleanup" type="checkbox"> T\u00fcm\u00fcn\u00fc Se\u00e7</label><button id="deleteSelectedCleanup" class="danger" data-kind="${cleanupKind}" type="button">Se\u00e7ilenleri Sil</button><small class="muted">Yay\u0131nda veya projede kullan\u0131lan kay\u0131tlar korunur.</small></div>`;body+=`<div class="tablewrap"><table><thead><tr>${canCleanup?'<th>Se\u00e7</th>':''}${cols.map(c=>`<th>${escapeHtml(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${canCleanup?`<td><input class="cleanupSelect" type="checkbox" value="${escapeHtml(r.id)}"></td>`:''}${cols.map(c=>`<td>${escapeHtml(r[c]??'\u2014')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}else body+='<div class="empty">Hen\u00fcz kay\u0131t bulunmuyor.</div>';
        }
      }catch(e){console.error('DASHBOARD_VIEW_ERROR',view,e);body=`<div class="error">Bu b\u00f6l\u00fcm y\u00fcklenemedi: ${escapeHtml(e.message||'DB_ERROR')}</div>`;}
      const safePhotoId=JSON.stringify(encodeURIComponent(selectedId));
      const actionScript=`${clientHelpers()}
      const post=async(url,data)=>{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf()},body:JSON.stringify(data)});const j=await r.json();if(!r.ok)throw Error(j.message||j.error||'\u0130\u015flem ba\u015far\u0131s\u0131z');return j};
      const sam=document.querySelector('#selectAllMessages');if(sam)sam.onchange=()=>document.querySelectorAll('.messageSelect').forEach(x=>x.checked=sam.checked);
      const dsm=document.querySelector('#deleteSelectedMessages');if(dsm)dsm.onclick=async()=>{const ids=[...document.querySelectorAll('.messageSelect:checked')].map(x=>x.value);if(!ids.length)return alert('Silmek i\u00e7in en az bir mesaj se\u00e7in.');if(!confirm(ids.length+' mesaj kal\u0131c\u0131 olarak silinsin mi?'))return;try{const j=await post('/api/admin-cleanup',{kind:'messages',ids});alert('Silinen: '+j.deleted.length+(j.failed.length?' \u00b7 Hata: '+j.failed.length:''));location.reload()}catch(e){alert('Hata: '+e.message)}};
      const sac=document.querySelector('#selectAllCleanup');if(sac)sac.onchange=()=>document.querySelectorAll('.cleanupSelect').forEach(x=>x.checked=sac.checked);
      const dsc=document.querySelector('#deleteSelectedCleanup');if(dsc)dsc.onclick=async()=>{const ids=[...document.querySelectorAll('.cleanupSelect:checked')].map(x=>x.value),kind=dsc.dataset.kind;if(!ids.length)return alert('Silmek i\u00e7in en az bir kay\u0131t se\u00e7in.');if(!confirm(ids.length+' kay\u0131t kontroll\u00fc olarak silinsin mi?'))return;try{const j=await post('/api/admin-cleanup',{kind,ids});let m='Silinen: '+j.deleted.length;if(j.blocked.length)m+=' \u00b7 Kullan\u0131mda oldu\u011fu i\u00e7in korunan: '+j.blocked.length;if(j.failed.length){const f=j.failed[0]||{};m+=' \u00b7 Hata: '+j.failed.length+' \u00b7 A\u015fama: '+(f.stage||'BILINMIYOR')+' \u00b7 Neden: '+(f.detail||f.error||'DELETE_FAILED')}if(j.diagnostics&&j.diagnostics.length&&!j.failed.length)m+=' \u00b7 Tan\u0131: '+j.diagnostics.map(x=>(x.stage||'')+': '+(x.detail||x.error||'')).join(' | ');alert(m);if(!j.failed.length)location.reload()}catch(e){alert('Hata: '+e.message)}};
      const rf=document.querySelector('#replyForm');if(rf){rf.onsubmit=async e=>{e.preventDefault();try{const b=Object.fromEntries(new FormData(rf));b.mode='send';const j=await post('/api/messages/${encodeURIComponent(selectedId)}/reply',b);alert(j.message||'\u2713 \u0130leti ba\u015far\u0131yla g\u00f6nderildi.');location='/?view=messages&box=sent'}catch(e){alert('Hata: '+e.message)}};document.querySelector('#draftBtn').onclick=async()=>{try{const b=Object.fromEntries(new FormData(rf));b.mode='draft';const j=await post('/api/messages/${encodeURIComponent(selectedId)}/reply',b);alert(j.message||'Taslak kaydedildi.');location.reload()}catch(e){alert('Hata: '+e.message)}};document.querySelector('#archiveBtn').onclick=async()=>{try{await post('/api/messages/${encodeURIComponent(selectedId)}/status',{status:'archived'});location='/?view=messages&box=archive'}catch(e){alert('Hata: '+e.message)}}}
      const muf=document.querySelector('#mediaUploadForm');if(muf)muf.onsubmit=async e=>{e.preventDefault();try{const f=document.querySelector('#mediaUploadFile').files[0];if(!f)throw Error('G\u00f6rsel se\u00e7in');if(f.size>8*1024*1024)throw Error('G\u00f6rsel en fazla 8 MB olabilir');const fd=new FormData();fd.append('file',f);const r=await fetch('/api/studio-media',{method:'POST',headers:{'X-CSRF-Token':csrf()},body:fd});const j=await r.json();if(!r.ok)throw Error(j.message||j.error||'Y\u00fckleme ba\u015far\u0131s\u0131z');document.querySelector('#mediaUploadResult').value=j.url;alert('\u2713 G\u00f6rsel y\u00fcklendi. HTTPS adresi haz\u0131r.')}catch(e){alert('Hata: '+e.message)}};const mf=document.querySelector('#mediaForm');if(mf)mf.onsubmit=async e=>{e.preventDefault();try{await post('/api/media',Object.fromEntries(new FormData(mf)));location.reload()}catch(e){alert('Hata: '+e.message)}};
      const vf=document.querySelector('#revisionForm');if(vf)vf.onsubmit=async e=>{e.preventDefault();try{const b=Object.fromEntries(new FormData(vf));b.payload=JSON.parse(b.payload||'{}');await post('/api/content_revisions',b);location.reload()}catch(e){alert('Hata: '+e.message)}};
      const pd=document.querySelector('#photoDownload');if(pd)pd.onclick=async()=>{if(!confirm('Foto\u011fraf tam indirildikten sonra sistemdeki ge\u00e7ici kopya silinecek. Devam edilsin mi?'))return;pd.disabled=true;const photoId=${safePhotoId};try{const start=await post('/api/photo-messages/'+photoId+'/view-start',{}),token=start.transferToken;const q=await fetch('/api/photo-messages/'+photoId+'/file?token='+encodeURIComponent(token),{cache:'no-store'});if(!q.ok){let x={};try{x=await q.json()}catch{}throw Error(x.error||'Foto\u011fraf al\u0131namad\u0131')}const blob=await q.blob(),bytes=await blob.arrayBuffer(),digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join(''),a=document.createElement('a'),u=URL.createObjectURL(new Blob([bytes],{type:blob.type||'application/octet-stream'}));a.href=u;a.download=photoId+'-alis-listesi';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),30000);let done=await post('/api/photo-messages/'+photoId+'/ack-delete',{transferToken:token,sha256:digest,byteCount:bytes.byteLength});if(done.status==='DELETE_PENDING'){await new Promise(r=>setTimeout(r,1200));done=await post('/api/photo-messages/'+photoId+'/ack-delete',{transferToken:token,sha256:digest,byteCount:bytes.byteLength})}alert(done.status==='DELETED'?'Foto\u011fraf indirildi ve sistemdeki ge\u00e7ici kopya silindi.':'Foto\u011fraf indirildi; silme do\u011frulamas\u0131 devam ediyor.');location.reload()}catch(e){alert('Hata: '+e.message);pd.disabled=false}};
      const sf=document.querySelector('#studioForm');if(sf){const stage=document.querySelector('#studioStage'),stageMedia=document.querySelector('#stageMedia'),timeline=document.querySelector('#studioTimeline'),sceneList=document.querySelector('#sceneList');let scenes=[];
      const sceneCard=(x,i)=>'<div class="sceneCard" data-i="'+i+'"><div class="sceneHead"><b>Sahne '+(i+1)+'</b><span><button type="button" class="sceneUp">\u2191</button><button type="button" class="sceneDown">\u2193</button><button type="button" class="sceneDelete danger">Sil</button></span></div><div class="grid"><select class="sType"><option value="image" '+(x.type==='image'?'selected':'')+'>G\u00f6rsel</option><option value="video" '+(x.type==='video'?'selected':'')+'>Video</option><option value="text" '+(x.type==='text'?'selected':'')+'>Metin</option></select><input class="sDuration" type="number" min="1" max="30" value="'+escClient(x.duration||5)+'" placeholder="S\u00fcre"></div><div class="grid"><input class="sUrl" type="url" value="'+escClient(x.url||'')+'" placeholder="HTTPS g\u00f6rsel/video ba\u011flant\u0131s\u0131"><label class="button sceneUploadLabel">\ud83d\udcf7 G\u00f6rsel Se\u00e7<input class="sFile" type="file" accept="image/jpeg,image/png,image/webp" hidden></label></div><small class="uploadState muted"></small><input class="sHeadline" maxlength="180" value="'+escClient(x.headline||'')+'" placeholder="Ba\u015fl\u0131k"><textarea class="sText" maxlength="600" placeholder="Metin">'+escClient(x.text||'')+'</textarea><div class="grid"><input class="sCta" maxlength="80" value="'+escClient(x.cta||'')+'" placeholder="CTA"><select class="sTransition"><option value="fade">Fade</option><option value="slide">Slide</option><option value="zoom">Zoom</option><option value="cut">Cut</option></select></div></div>';
      const sync=()=>{[...sceneList.querySelectorAll('.sceneCard')].forEach((c,i)=>{const x=scenes[i];x.type=c.querySelector('.sType').value;x.duration=Number(c.querySelector('.sDuration').value||5);x.url=c.querySelector('.sUrl').value;x.headline=c.querySelector('.sHeadline').value;x.text=c.querySelector('.sText').value;x.cta=c.querySelector('.sCta').value;x.transition=c.querySelector('.sTransition').value})};
      const render=()=>{sceneList.innerHTML=scenes.map(sceneCard).join('');sceneList.querySelectorAll('.sceneCard').forEach((c,i)=>{c.querySelector('.sTransition').value=scenes[i].transition||'fade';c.oninput=preview;const fi=c.querySelector('.sFile'),us=c.querySelector('.uploadState');if(fi)fi.onchange=async()=>{const f=fi.files&&fi.files[0];if(!f)return;if(f.size>8*1024*1024){alert('G\u00f6rsel en fazla 8 MB olabilir.');fi.value='';return}try{us.textContent='Y\u00fckleniyor...';const fd=new FormData();fd.append('file',f);const rr=await fetch('/api/studio-media',{method:'POST',headers:{'X-CSRF-Token':csrf()},body:fd});const jj=await rr.json();if(!rr.ok)throw Error(jj.message||jj.error||'Y\u00fckleme ba\u015far\u0131s\u0131z');c.querySelector('.sUrl').value=jj.url;scenes[i].url=jj.url;scenes[i].type='image';c.querySelector('.sType').value='image';us.textContent='\u2713 G\u00f6rsel y\u00fcklendi';preview()}catch(e){us.textContent='';alert('G\u00f6rsel y\u00fckleme hatas\u0131: '+e.message)}};c.querySelector('.sceneDelete').onclick=()=>{sync();scenes.splice(i,1);if(!scenes.length)scenes.push({type:'image',duration:5,transition:'fade'});render();preview()};c.querySelector('.sceneUp').onclick=()=>{sync();if(i>0)[scenes[i-1],scenes[i]]=[scenes[i],scenes[i-1]];render();preview()};c.querySelector('.sceneDown').onclick=()=>{sync();if(i<scenes.length-1)[scenes[i+1],scenes[i]]=[scenes[i],scenes[i+1]];render();preview()}});preview()};
      function preview(){sync();const b=Object.fromEntries(new FormData(sf)),x=scenes[0]||{};stage.style.aspectRatio=(b.aspectRatio||'16:9').replace(':','/');stage.querySelector('.stageCopy b').textContent=x.headline||b.title||'Okyanus EDT';stage.querySelector('.stageCopy span').textContent=x.text||x.cta||'Canl\u0131 \u00f6nizleme';stageMedia.innerHTML='';if(x.url){if(x.type==='video')stageMedia.innerHTML='<video muted playsinline controls src="'+escClient(x.url)+'"></video>';else if(x.type==='image')stageMedia.innerHTML='<img alt="" src="'+escClient(x.url)+'">'}timeline.innerHTML=scenes.map((z,i)=>'<span title="'+escClient(z.transition||'fade')+'">'+(i+1)+' \u00b7 '+escClient(z.duration||5)+'sn</span>').join('')}
      document.querySelector('#addScene').onclick=()=>{sync();if(scenes.length>=30)return alert('En fazla 30 sahne kullan\u0131labilir.');scenes.push({type:'image',duration:5,transition:'fade'});render()};sf.onsubmit=async e=>{e.preventDefault();try{sync();const b=Object.fromEntries(new FormData(sf));b.scenes=scenes;await post('/api/studio',b);location.reload()}catch(e){alert('Hata: '+e.message)}};scenes=[{type:'image',duration:5,transition:'fade'}];render()}
      document.querySelectorAll('.studioRemix').forEach(b=>b.onclick=async()=>{try{await post('/api/studio/'+encodeURIComponent(b.dataset.id)+'/remix',{});alert('Yeni otomatik montaj \u00fcretildi.');location.reload()}catch(e){alert('Hata: '+e.message)}});
      document.querySelectorAll('.studioPublish').forEach(b=>b.onclick=async()=>{if(!confirm('Bu \u00e7al\u0131\u015fma ana sayfadaki Okyanus Vitrinine g\u00f6nderilsin mi?'))return;try{await post('/api/studio/'+encodeURIComponent(b.dataset.id)+'/publish',{});alert('\u2713 Okyanus Vitrinine yay\u0131nland\u0131.');location.reload()}catch(e){alert('Hata: '+e.message)}});
      function escClient(v){return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
      document.querySelector('#logout').onclick=async()=>{try{const r=await fetch('/logout',{method:'POST',headers:{'X-CSRF-Token':csrf()}});if(r.ok)location='/login'}catch(e){location='/login'}};`;
      return shell('Y\u00f6netici Paneli',`<button id="menuToggle" class="menuToggle" type="button">\u2630 Y\u00f6netim</button><div id="menuShade" class="menuShade"></div><aside id="sideMenu" class="sideMenu"><div class="sideBrand"><h2>Okyanus EDT</h2><small>Y\u00f6netici Merkezi</small></div><div class="sideUser">${escapeHtml(user.user.display_name)}<small>${escapeHtml(role)}</small></div>${nav}</aside><div class="adminContent"><header><div><h1>Okyanus EDT Y\u00f6netici</h1><small>G\u00fcvenli i\u00e7erik ve ileti\u015fim merkezi</small></div><span class="user">${escapeHtml(user.user.display_name)} \u00b7 ${escapeHtml(role)}</span></header><section class="panel"><div class="panelhead"><div><h2>${escapeHtml(title)}</h2><p>${escapeHtml(help)}</p></div><a class="button" href="${escapeHtml(url.pathname+url.search)}">Yenile</a></div>${body}<div id="notice"></div></section><script>${actionScript}</script></div>`);
    }

    async function cesniAdminPage(user, env){
      const one = async (sql) => Number((await env.DB.prepare(sql).first())?.n || 0);

      const items = await one(`SELECT COUNT(*) AS n FROM cesni_items`);
      const sources = await one(`SELECT COUNT(*) AS n FROM cesni_sources`);
      const claims = await one(`SELECT COUNT(*) AS n FROM cesni_claims`);
      const aromas = await one(`SELECT COUNT(*) AS n FROM cesni_aroma_profiles`);
      const blocking = await one(`SELECT COUNT(*) AS n FROM cesni_validation_queue WHERE severity='blocking' AND status='open'`);
      const approvals = await one(`SELECT COUNT(*) AS n FROM cesni_approvals WHERE decision='approved'`);

      const rows = (await env.DB.prepare(`
        SELECT
          i.id,
          i.name_tr,
          i.name_original,
          i.item_type,
          i.status,
          a.aroma_summary,
          a.intensity,
          (
            SELECT COUNT(*)
            FROM cesni_claims c
            WHERE c.item_id=i.id
          ) AS claim_count,
          (
            SELECT COUNT(*)
            FROM cesni_validation_queue v
            WHERE v.entity_type='item'
              AND v.entity_id=i.id
              AND v.severity='blocking'
              AND v.status='open'
          ) AS blocking_count
        FROM cesni_items i
        LEFT JOIN cesni_aroma_profiles a ON a.item_id=i.id
        ORDER BY i.id
        LIMIT 106
      `).all()).results || [];

      const qaState = blocking > 0 ? 'BEKLEMEDE' : 'QA PASS';
      const publishState = blocking > 0 ? 'KAPALI' : 'KONTROLE HAZIR';

      const tableRows = rows.map(r => `<tr>
        <td>${escapeHtml(r.id)}</td>
        <td>${escapeHtml(r.name_tr)}</td>
        <td>${escapeHtml(r.name_original || '\u2014')}</td>
        <td>${escapeHtml(r.aroma_summary || '\u2014')}</td>
        <td>${escapeHtml(r.intensity ?? '\u2014')}</td>
        <td>${escapeHtml(r.claim_count)}</td>
        <td>${escapeHtml(r.blocking_count)}</td>
        <td>${escapeHtml(r.status)}</td>
      </tr>`).join('');

      return shell('\u00c7E\u015eN\u0130 Y\u00f6netim Merkezi',`
      <header>
        <div>
          <h1>\u00c7E\u015eN\u0130 Y\u00f6netim Merkezi</h1>
          <small>Okyanus EDT \u00b7 ger\u00e7ek D1 veri, QA ve yay\u0131n merkezi</small>
        </div>
        <span class="user">${escapeHtml(user.user.display_name)} \u00b7 ${escapeHtml(user.user.role)}</span>
      </header>

      <nav>
        <a href="/">\u2190 Y\u00f6netici Ana Sayfa</a>
        <a href="/cesni">\u21bb D1 Verilerini Yenile</a>
        <a href="https://okyanus-edt-v2.hasan-kaya474.workers.dev/cesni" target="_blank" rel="noopener noreferrer">Ziyaret\u00e7i \u00c7E\u015eN\u0130 \u00d6nizleme \u2197</a>
      </nav>

      <section class="panel">
        <div class="panelhead">
          <div>
            <h2>\u00c7E\u015eN\u0130 Kontrol Merkezi</h2>
            <p>RAW \u2192 PARSED \u2192 NORMALIZED \u2192 CROSS CHECK \u2192 QA PASS \u2192 APPROVED \u2192 PUBLISHED</p>
          </div>
        </div>

        <div class="stats">
          <article><b>${items}</b><span>D1 \u00fcr\u00fcn kayd\u0131</span></article>
          <article><b>${aromas}</b><span>Aroma profili</span></article>
          <article><b>${claims}</b><span>Kaynak claim</span></article>
          <article><b>${blocking}</b><span>A\u00e7\u0131k blocking QA</span></article>
          <article><b>${sources}</b><span>Kaynak</span></article>
        </div>

        <div class="grid">
          <section class="guide">
            <h3>1 \u00b7 Veri & Kaynak</h3>
            <p><b>${items}</b> \u00fcr\u00fcn \u00b7 <b>${aromas}</b> aroma \u00b7 <b>${claims}</b> claim \u00b7 <b>${sources}</b> kaynak.</p>
            <p>Bu de\u011ferler art\u0131k sabit HTML de\u011fil, do\u011frudan Y\u00f6netici D1 veritaban\u0131ndan okunuyor.</p>
          </section>

          <section class="guide">
            <h3>2 \u00b7 QA & G\u00fcvenlik</h3>
            <p>A\u00e7\u0131k blocking kontrol: <b>${blocking}</b></p>
            <p>QA durumu: <b>${qaState}</b></p>
          </section>

          <section class="guide">
            <h3>3 \u00b7 Onay</h3>
            <p>Onay kay\u0131tlar\u0131: <b>${approvals}</b></p>
            <p>${blocking > 0 ? 'Blocking kay\u0131tlar \u00e7\u00f6z\u00fclmeden APPROVED a\u015famas\u0131na ge\u00e7ilmeyecek.' : 'Blocking kontrol kalmad\u0131; onay a\u015famas\u0131 ayr\u0131ca yetkili karar\u0131 gerektirir.'}</p>
          </section>

          <section class="guide">
            <h3>4 \u00b7 Yay\u0131n</h3>
            <p>Yay\u0131n kap\u0131s\u0131: <b>${publishState}</b></p>
            <p>Ziyaret\u00e7i \u00c7E\u015eN\u0130 sistemi bu de\u011fi\u015fiklikle otomatik de\u011fi\u015ftirilmez. Mevcut canl\u0131 ziyaret\u00e7i yap\u0131s\u0131 korunur.</p>
          </section>
        </div>

        <section class="guide">
          <h3>D1 \u00dcr\u00fcnlar\u0131 \u00b7 SP-001 \u2192 SP-106</h3>
          <p>Kimlik, aroma, claim ve a\u00e7\u0131k blocking kontrol\u00fc birlikte g\u00f6sterilir.</p>
          <div class="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>T\u00fcrk\u00e7e ad</th>
                  <th>Orijinal ad</th>
                  <th>Aroma</th>
                  <th>G\u00fc\u00e7</th>
                  <th>Claim</th>
                  <th>Blocking</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>${tableRows || '<tr><td colspan="8">D1 \u00fczerinde \u00c7E\u015eN\u0130 kayd\u0131 bulunamad\u0131.</td></tr>'}</tbody>
            </table>
          </div>
        </section>

        <section class="guide">
          <h3>Ba\u011flant\u0131 durumu</h3>
          <p><b>Y\u00f6netici D1 ba\u011flant\u0131s\u0131 aktif.</b> Bu sayfadaki saya\u00e7lar ve \u00fcr\u00fcn listesi ger\u00e7ek D1 sorgular\u0131ndan \u00fcretilir. QA ve yay\u0131n kap\u0131lar\u0131 kontroll\u00fc olarak kilitli kal\u0131r.</p>
        </section>
      </section>`);
    }

    function passwordPage(){return shell('Parola De\u011fi\u015ftir',`<section class="card"><h1>Parola De\u011fi\u015ftir</h1><p>En az 14 karakter; b\u00fcy\u00fck/k\u00fc\u00e7\u00fck harf, rakam ve \u00f6zel karakter kullan\u0131n.</p><form id="pw"><input name="currentPassword" type="password" required autocomplete="current-password" placeholder="Mevcut parola"><input name="newPassword" type="password" required minlength="14" autocomplete="new-password" placeholder="Yeni g\u00fc\u00e7l\u00fc parola"><button>Parolay\u0131 g\u00fcncelle</button><a href="/">Panele d\u00f6n</a></form><pre id="msg"></pre></section><script>${clientHelpers()}document.querySelector('#pw').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),r=await fetch('/account/password',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf()},body:JSON.stringify(Object.fromEntries(f))}),j=await r.json();document.querySelector('#msg').textContent=j.ok?'Parola ba\u015far\u0131yla de\u011fi\u015ftirildi.':('Hata: '+j.error);if(j.ok)e.target.reset()}</script>`)}
    function clientHelpers(){return `function csrf(){return decodeURIComponent((document.cookie.match(/(?:^|;\\s*)__Host-oky_csrf=([^;]+)/)||[])[1]||'')}`}
    function printPage(){return shell('Okyanus EDT Rapor',`<section class="report"><h1>Okyanus EDT Y\u00f6netici Raporu</h1><p>Tarih: <span id="d"></span></p><pre id="out">Y\u00fckleniyor\u2026</pre><button onclick="print()">PDF indir / Yazd\u0131r</button></section><script>document.getElementById('d').textContent=new Date().toLocaleString('tr-TR');fetch('/api/summary').then(r=>r.json()).then(j=>document.getElementById('out').textContent=JSON.stringify(j.data,null,2))</script>`)}
    function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
    function css(){return `.sideMenu{position:fixed;left:0;top:0;bottom:0;width:245px;background:#061a33;padding:24px 16px;z-index:50;overflow:auto;border-right:1px solid #173b61}.sideBrand{padding:4px 10px 18px;border-bottom:1px solid #173b61}.sideBrand h2{color:#fff;margin:0 0 4px}.sideUser{margin:16px 5px;padding:12px;background:#102d50;border-radius:12px;font-weight:bold}.sideUser small{display:block;margin-top:4px}.sideNav{display:block;margin:0}.sideNav button,.sideNav a{display:block;width:100%;text-align:left;margin:5px 0;background:#0b3158}.sideNav .danger{background:#842a39;margin-top:18px}.adminContent{margin-left:245px}.menuToggle{display:none;position:fixed;left:12px;top:12px;z-index:70;box-shadow:0 6px 20px #0005}.menuShade{display:none}*{box-sizing:border-box}body{margin:0;font:15px Arial;background:#071b35;color:#eaf4ff}main{max-width:1280px;margin:auto;padding:28px}.card,.panel,.report{margin:4vh auto;background:#fff;color:#10233e;padding:28px;border-radius:20px;box-shadow:0 20px 60px #0005}.card,.report{max-width:760px}h1{color:#1684d6;margin-bottom:5px}h2,h3{margin:0 0 10px}small{color:#9db7d2}.user{background:#102d50;padding:10px 14px;border-radius:999px}input,select,textarea,button,a{font:inherit}input,select,textarea{display:block;width:100%;padding:12px;margin:8px 0;border:1px solid #bdd0e5;border-radius:10px;background:#fff}textarea{min-height:100px;resize:vertical}button,a{display:inline-block;padding:11px 14px;margin:5px;border:0;border-radius:9px;background:#0b65b1;color:#fff;text-decoration:none;cursor:pointer}.danger{background:#9d2635}header,.panelhead{display:flex;justify-content:space-between;align-items:center}nav{margin:20px 0;display:flex;flex-wrap:wrap}.panel{max-width:none}.panelhead{border-bottom:1px solid #dbe7f2;margin-bottom:18px;padding-bottom:12px}.panelhead p{margin:4px 0;color:#62748a}.stats{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}.stats article{padding:20px;border:1px solid #dceaf6;border-radius:14px;background:#f3f8fd}.stats b{font-size:30px;color:#0b65b1;display:block}.stats span{color:#52677e}.guide,.editor,.empty{padding:20px;margin-top:18px;background:#f3f8fd;border-radius:14px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.tablewrap{overflow:auto;border:1px solid #dbe7f2;border-radius:12px}table{width:100%;border-collapse:collapse;min-width:760px}th,td{text-align:left;padding:12px;border-bottom:1px solid #e5edf5;vertical-align:top}th{background:#edf5fc;color:#23435f;position:sticky;top:0}td{max-width:300px;overflow-wrap:anywhere}.loading,.error{padding:24px;border-radius:12px;background:#f3f8fd}.error{color:#a0182a}#notice{font-weight:bold;color:#087a4b;margin-top:10px}pre{white-space:pre-wrap;overflow:auto;background:#eff6fc;color:#10233e;padding:16px;border-radius:12px}@media(max-width:800px){main{padding:14px}header,.panelhead{display:block}.user{display:inline-block;margin-top:12px}nav button,nav a{flex:1 1 44%;text-align:center}.stats{grid-template-columns:1fr 1fr}.grid{grid-template-columns:1fr}.panel{padding:18px}}@media(max-width:800px){.adminContent{margin-left:0;padding-top:54px}.menuToggle{display:block}.sideMenu{width:min(82vw,300px);transform:translateX(-105%);transition:transform .22s ease;box-shadow:14px 0 40px #0008}.sideMenu.open{transform:translateX(0)}.menuShade{position:fixed;inset:0;background:#0008;z-index:40}.menuShade.open{display:block}.sideNav button,.sideNav a{min-height:46px;padding:13px 14px}}.studioGrid{display:grid;grid-template-columns:1fr 1.25fr;gap:18px}.studioPreview{padding:20px;border:1px solid #dceaf6;border-radius:14px;background:#f3f8fd}.studioStage{aspect-ratio:16/9;border-radius:16px;background:#061831;color:#fff;position:relative;overflow:hidden;display:flex;align-items:flex-end}.studioStage #stageMedia{position:absolute;inset:0}.studioStage img,.studioStage video{width:100%;height:100%;object-fit:cover}.stageCopy{position:relative;z-index:2;width:100%;padding:28px;background:linear-gradient(transparent,#061831dd);display:flex;flex-direction:column}.studioStage b{font-size:28px}.studioStage span{margin-top:8px}.studioToolbar,.sceneHead{display:flex;justify-content:space-between;align-items:center}.sceneCard{padding:14px;margin:10px 0;border:1px solid #d6e4f1;border-radius:12px;background:#fff}.sceneHead button{padding:7px 9px}.studioTimeline{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}.studioTimeline span{background:#0b3158;color:#fff;padding:7px 9px;border-radius:8px;font-size:12px}.muted{color:#62748a;font-size:13px}@media(max-width:800px){.studioGrid{grid-template-columns:1fr}}@media print{body{background:#fff;color:#000}button,nav,header{display:none}.report{box-shadow:none;margin:0;max-width:none}}`}