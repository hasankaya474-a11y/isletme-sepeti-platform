# Independent catalogue render cross-review

Executed the actual generated `commerceCatalogPage` script in a Node VM with 1,347 distinct products, DOM/event/storage mocks and controlled debounce timers. Initial rendering produced 48 cards; one load-more click produced 96; repeated clicks exposed all 1,347 unique product IDs. Search and category filters use the complete dataset, reset the shown count to 48, and produce the correct total. Rapid search inputs leave one 120ms timer. Empty results show the existing recovery links and hide load-more.

Cart scenario: selected the last product after loading every batch. The stored item had its correct source ID, quantity 3, price 1,446 and original image. Product image/title links used the stable managed ID; images had lazy, async-decoding and non-draggable attributes.

Two patch fixes made during review: load-more now appends only its next 48 cards through `insertAdjacentHTML`, preserving existing quantity inputs and focus instead of recreating every prior card; form submission clears any pending search debounce to avoid a second redundant render/reset. The existing render path still replaces the grid for an intentional filter change.

`tests/catalog-render-vm.cjs` passes against the temporary review candidate; `node --check` also passes. Only the independent patch and tests were changed; no final Worker was edited. This is generated-JavaScript verification, not mobile browser emulation.
