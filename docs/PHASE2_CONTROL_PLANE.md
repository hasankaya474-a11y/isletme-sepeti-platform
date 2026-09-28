# Phase 2 Control Plane
Status: IMPLEMENTED FOUNDATION

Komutan Admin control plane now has four first-class centers: Configuration, Feature Flags, Vitrin Studio/Content and Help Center.

Content is versioned. Rollback creates a new version instead of rewriting history. Preview access uses expiring hashed tokens. Scheduled publication is represented as auditable jobs. Contextual Help is route- and role-aware.

The constitutional rule remains: normal operation and publishable content must be manageable without source-code edits. Arbitrary code editing is not an Admin feature.
