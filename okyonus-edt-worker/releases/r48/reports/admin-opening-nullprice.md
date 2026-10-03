# R48 opening campaign and missing price regression

Actual SQLite-backed ZAMAN commerceAdminApi settings/product writes and DENIZ public homepage/API reads run locally against the shared test database. No live writes.

Opening campaign enabled image/title/description/CTA changes propagate into actual homepage dialog. Supported disabled values false,0,off,FALSE remain disabled after unrelated title changes; saved image remains unchanged while disabled. Explicitly clearing image is preserved and no default image is restored. Product with null base/list/sale price remains selected/public and metadata edits preserve null values. No price rows or fictitious zero price inserted; publication-check matches. OUT stock is retained in public canonical data, not rewritten to ORDER.

Proven minor defect: opening settings dropdown only recognizes case-sensitive false/0 while public parser recognizes case-insensitive false/0/off. A saved off/FALSE shows active in admin but disabled publicly, and saving untouched form could activate it. Standalone patch only aligns that dropdown parsing. Baseline generated browser script reproduces mismatch; patched generated script passes every supported disabled value.

Actual member quote acceptance/rejection and stock enforcement coordinated to flows agent. This audit does not claim full quote submission from canonical API alone. All local checks pass against temporary patched ZAMAN and R47 DENIZ; final Worker sources were not edited.
