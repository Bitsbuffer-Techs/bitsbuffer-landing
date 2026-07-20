# Pending images — homepage Solutions Explorer

**2026-07-16:** sweetHeart v3 audit pass. Deleted all 13 confirmed-orphaned
originals flagged below as safe-to-delete (~25.4MB reclaimed) — see
`docs/06_audit_report.md` for the full list. `Feedback JV.docx` left as-is,
still unresolved. Started sourcing the 30 remaining slots via open-license
stock (Unsplash, license=free filter) — proved the pipeline works on one
Agri-tech match, then paused at Adnan's call: he's dropping the files in
himself, same cadence as before. Briefs below are unchanged and still the
source of truth for what's needed.

**2026-07-10, update 4:** Risk & fraud monitoring fixed. New upload `Risk management in fintech.png` decoded fine — optimized to `fintech-risk-fraud-monitoring-v2.jpg` and rewired. All 5 FinTech scenarios are now clean, no known stale images left.

**2026-07-10, update 3:** You tried to replace `Reconciliation & ledger` and `Risk & fraud monitoring` by re-uploading over the same filenames. Files in `C:\cowork` can't be overwritten or deleted once written, so:
- **Reconciliation & ledger** — fixed. Your new upload landed as `Reconciliation & ledger.jpg` (a distinct file, upload went through fine). Re-optimized it as `fintech-reconciliation-ledger-v2.jpg` and rewired the scenario to point to it.
- **Risk & fraud monitoring** — was still broken (corrupted upload) — resolved in update 4 above.

**2026-07-10, update 2:** FinTech module done — all 5 scenarios now use real images (`fintech.jpg`, `fintech-compliance-reporting.jpg`, `fintech-risk-fraud-monitoring-v2.jpg`, `fintech-lending-underwriting.jpg`, `fintech-reconciliation-ledger-v2.jpg`), swapped in for the generic office/training/ceo photos. 30 scenario slots remain across the other 6 industries below.

Where the images landed:

| Image | Now used in | Slot |
|---|---|---|
| `fintech-compliance-reporting.jpg` | SolutionsExplorerSection | FinTech tab → Compliance & reporting scenario |
| `fintech-risk-fraud-monitoring-v2.jpg` | SolutionsExplorerSection | FinTech tab → Risk & fraud monitoring scenario |
| `fintech-lending-underwriting.jpg` | SolutionsExplorerSection | FinTech tab → Lending & underwriting scenario |
| `fintech-reconciliation-ledger-v2.jpg` | SolutionsExplorerSection | FinTech tab → Reconciliation & ledger scenario |

**2026-07-10, update 1:** E-commerce module done — all 5 scenarios now use real screenshots (`ecommerce-storefront-checkout.jpg`, `ecommerce-inventory-fulfillment.jpg`, `ecommerce-payments-reconciliation.jpg`, `ecommerce-accounts-loyalty.jpg`, `ecommerce-returns-support.jpg`), swapped in for the generic office/meeting photos.

Where the 5 new images landed (2026-07-10):

| New image | Now used in | Slot |
|---|---|---|
| `social-media.jpg` | ServiceToolsSection | Icon Media Manager featured panel |
| `custom-software-1.jpg` | ServiceToolsSection | Custom development featured panel |
| `custom-software-2.jpg` | blog-posts.ts | "Why custom software still wins" thumbnail (feeds FeaturedUpdatesSection on the home page) |
| `fintech.jpg` | SolutionsExplorerSection | FinTech tab → Payments & trade finance scenario |
| `ceo-working.jpg` | TeamProofSection, FinalCTASection | Leadership photo slots (replaced `ceo.jpeg`) |

Everything below is still on generic reused stock (office/meeting/training/celebration photos repeated across unrelated industries) in **SolutionsExplorerSection**, the industry tab + scenario accordion on the home page. 30 slots remain. Each needs either a real photo or an AI-generated image matching the brief — search or generate against the two-liner, then drop the file in `public/images/` with a kebab-case name and I'll wire it in.

## E-commerce — done ✅

## FinTech — done ✅

## Agri-tech — done ✅

**2026-07-16:** You dropped 5 files into a new `public/images/agritech/`
folder. Optimized (resized to a real display width, recompressed, renamed
kebab-case) and wired in 4 of them:

| Optimized file | Original | Size before → after | Wired into |
|---|---|---|---|
| `agritech-field-operations.jpg` | `field operations.png` | 1.2MB → 110KB | Field operations scenario |
| `agritech-supply-chain-traceability.jpg` | `supply cahin and traceablity.jpg` | 3.6MB → 267KB | Supply chain & traceability scenario |
| `agritech-yield-resource-monitoring.jpg` | `yield and resource monitoring.jpg` | 6.3MB → 234KB | Yield & resource monitoring scenario |
| `agritech-procurement-logistics.jpg` | `procurement adn logistic.jpg` | 4.9MB → 250KB | Procurement & logistics scenario |

Verified live on `localhost:3000` — all 4 render correctly, crossfade intact,
zero console errors.

**10. Field operations** — done. Field worker with tablet checking data
overlays over a crop field. Good match.

**11. Supply chain & traceability** — done. Apple sorting/packing line. Good
match for farm-to-buyer traceability.

**12. Yield & resource monitoring** — done, but a looser match than the
brief asked for (tractor + seeding rig at dusk, not a soil sensor/irrigation
panel/dashboard shot). Used it because it's a strong, authentic photo and
better than the generic placeholder it replaced — flag if you want something
closer to the original brief instead.

**13. Procurement & logistics** — same note as #12: it's a tractor pulling
seeding/input equipment, not a delivery-truck/harvest-logistics shot. Used
for the same reason, flag if you want a closer match.

**14. Weather & advisory** — done, strong match (2026-07-16 re-upload). New
`weather advisory.png` replaced the earlier watermarked file — clean, no
overlay, and it's a genuine match: a "Smart Farm" weather/soil advisory app
on a phone shown against a real field weather station. Wired in.

**2026-07-16, update 2:** Adnan swapped Supply chain & traceability out —
replaced with a new **Dairy farm management** scenario using a new upload
(`dairy farm mangemnt.jpg`, tagged dairy cattle in a barn, individual
ear-tag IDs). Optimized (3.0MB → `agritech-dairy-farm-management.jpg`,
320KB) and wired in at the same position in the accordion. The old
`agritech-supply-chain-traceability.jpg` (apple packing line) was deleted
since nothing references it anymore. Agri-tech is now: Field operations,
Dairy farm management, Yield & resource monitoring, Procurement &
logistics, Weather & advisory — all 5 verified live, zero console errors.

Raw uploads still sit in `public/images/agritech/` (~16.6MB total) —
kept in case you want to double check before I delete them; say the word.

## Enterprise / ERP
15. **Order & revenue management** — An ERP order/invoice dashboard on a monitor, multiple line items visible.
16. **Multi-entity operations** — A dashboard showing multiple branches/entities side by side, org-chart or multi-location feel.
17. **Reporting & controls** — An approval-chain or permissions screen, workflow-diagram style.
18. **Procurement** — A purchase order or vendor record screen. Office supply/procurement form visual.
19. **HR & payroll** — A payroll run or employee-records screen (generic UI, no real employee data).

## Healthcare — done ✅

**2026-07-16:** You dropped 5 files into `public/images/healtech/`. All 5
optimized (PNG → JPEG, resized where needed, recompressed) and wired in.
Verified live on `localhost:3000` — renders correctly, zero console errors.

| Optimized file | Original | Size before → after | Wired into |
|---|---|---|---|
| `healthcare-patient-records.jpg` | `patient record.png` | 964KB → 80KB | Patient records scenario |
| `healthcare-scheduling.jpg` | `scheduling.png` | 688KB → 64KB | Scheduling scenario |
| `healthcare-billing-claims.jpg` | `medical billing.png` | 892KB → 72KB | Billing & claims scenario |
| `healthcare-compliance.jpg` | `complience.png` | 968KB → 68KB | Compliance scenario |
| `healthcare-telehealth.jpg` | `telemedicine.png` | 728KB → 56KB | Telehealth scenario |

**20. Patient records** — done, strong match: EHR chart on screen next to a
printed patient file.

**21. Scheduling** — done, strong match: clinician with a calendar/booking
overlay.

**22. Billing & claims** — done, strong match: billing statement close-up.

**23. Compliance** — done, but a looser match than the brief (clinician
checking a pulse at a desk, not an access-log/audit-trail screen). No
defects, just not literally "compliance" — flag if you want something
closer.

**24. Telehealth** — done, close match: phone showing a "Telemedicine" app
login screen (brief asked for a video-call UI specifically; this is a login
screen, same app category, close enough).

Raw uploads still sit in `public/images/healtech/` (~4.2MB total) — kept
in case you want to double check before I delete them.

## Logistics
25. **Fleet tracking** — A live map with vehicle markers, dispatch dashboard.
26. **Warehouse management** — A warehouse floor with pick/pack activity, or a WMS screen.
27. **Route optimization** — A route-planning map with multiple stops, delivery-routing UI.
28. **Customs & documentation** — A customs form or shipping document stack, border/freight feel.
29. **Carrier billing** — A freight invoice or rate-reconciliation screen.

## EdTech — done ✅

**2026-07-16:** You dropped 5 files into `public/images/edtech/`. All 5
optimized (resized where needed, recompressed, renamed kebab-case) and wired
in. Verified live on `localhost:3000` — renders correctly, zero console
errors.

| Optimized file | Original | Size before → after | Wired into |
|---|---|---|---|
| `edtech-course-delivery.jpg` | `course delivery.png` | 1.4MB → 152KB | Course delivery scenario |
| `edtech-enrollment-admissions.jpg` | `enrolment.png` | 1004KB → 84KB | Enrollment & admissions scenario |
| `edtech-grading-assessment.jpg` | `grades.jpg` | 880KB → 124KB | Grading & assessment scenario |
| `edtech-parent-guardian-portal.jpg` | `parent and guardian portal.jpg` | 76KB → 76KB (already optimized) | Parent & guardian portal scenario |
| `edtech-attendance.jpg` | `attendance.jpg` | 56KB → 56KB (already optimized) | Attendance scenario |

**30. Course delivery** — done, but generic: an "Online Education" stock
banner graphic rather than an actual LMS/course screen or classroom shot.
No defects, just abstract — flag if you want something more literal.

**31. Enrollment & admissions** — done, strong match: application form on a
laptop screen.

**32. Grading & assessment** — done, loose match: a student working through
a math worksheet rather than a gradebook/results screen. No defects, still
clearly education-themed.

**33. Parent & guardian portal** — done, loose match: parent and child with
a laptop (no visible app screen). No defects.

**34. Attendance** — done, strong match: fingerprint biometric check-in
scanner.

Raw uploads still sit in `public/images/edtech/` (~3.4MB total) — kept in
case you want to double check before I delete them.

## Real Estate
35. **Listings & CRM** — A property listing page or real-estate CRM pipeline screen.
36. **Lease management** — A lease document or renewal-tracking screen.
37. **Maintenance requests** — A maintenance-ticket app screen, or a technician at a property.
38. **Payments & escrow** — An escrow/rent-collection dashboard, payment confirmation screen.
39. **Reporting & valuation** — A portfolio valuation dashboard or property performance report.

---

**Housekeeping — resolved 2026-07-16:**
- All the oversized/duplicate originals previously flagged below (E-commerce
  and FinTech source uploads, ~25.4MB total, one file alone was 14MB) are
  now deleted — confirmed zero references in `src/` before removal.
  `Risk & fraud monitoring.webp` and the non-`-v2` FinTech first-pass files
  were already gone by this point (resolved in an earlier session).
- `public/images/Feedback JV.docx` — still there, still unresolved. A Word
  doc sitting in the public images folder means it's publicly servable at
  `/images/Feedback%20JV.docx` on the live site. Say the word if it should
  move or go.
- Reminder: files in `C:\cowork` couldn't be overwritten or deleted without
  explicit permission — that's now been granted for this folder, so future
  cleanup here doesn't need to re-ask.
