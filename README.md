# Hyundai Autoever Mexico — MES / System Administrator Technical Assessment

Candidate assessment + HR dashboard.

## Assessment
- 45-minute assessment
- 29 questions
- Exact assessment requested for MES / System Administrator hiring
- Candidate sees only a submission confirmation
- Automatic answers are graded server-side in Supabase
- Open-ended answers are reviewed by HR

## Scoring
- Automatic questions: 50 points
- Open-ended questions: 50 points
- Final score: 100 points
- Recommended passing threshold: 70

## Setup
1. In Supabase, run `supabase/schema.sql`. This upgrades the existing `assessment_submissions` table; it does not recreate it.
2. In Supabase Authentication, create the HR user (email + password).
3. Verify the Supabase project URL and publishable/anon key in `js/config.js`. Never put a service-role/secret key in the frontend.
4. Deploy the repository through GitHub Pages.
5. Candidate page: `/`
6. HR dashboard: `/admin.html`
