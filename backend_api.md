======================================================
MamaVoice Companion - Backend API Specification
======================================================

## 1. Core Technical Architecture & Goals
- Role: Pure text-based REST API. (All audio/speech processing is handled natively on the Android client).
- Security: Token-based authentication (JWT) passed via `Authorization: Bearer <token>` for all protected routes.
- Language: English.
- Personalization: Dashboard endpoints must calculate states dynamically (e.g., current pregnancy week or baby's age) based on the user's `target_date`.

## 2. Core Data Models
These are the primary entities required.

1. Users Table
- email (unique, required)
- password_hash (required)
- first_name
- profile_type ('PREGNANT' or 'NEW_MOM')
- target_date (Pregnancy Due Date or Baby's DOB)

2. Local Foods Table
- name, category, benefits, image_url

3. Immunization Tracker Table
- user_id, vaccine_id, vaccine_name, due_date_string (e.g., 'At Birth', '6 Weeks')
- is_completed (boolean), administered_date
- side_effects

4. Health & Nutrition Tracker Table
- user_id, log_date, weight_kg, blood_pressure, nutrition_notes, symptoms

## 3. API Endpoint Specifications

[AUTH & PROFILE]
- POST /api/auth/register -> Body: { email, password } | Response: { token, isExistingUser: false }
- POST /api/auth/login -> Body: { email, password } | Response: { token, isExistingUser: true }
- POST /api/user/profile -> Body: { firstName, type, targetDate } | Response: { status: "SUCCESS" }

[DASHBOARD]
- GET /api/dashboard -> Response: { firstName, statusText, currentWeek, daysToNextVaccine, nextVaccineName }

[VOICE AI LOGIC]
- POST /api/ai/query -> Body: { textQuery } | Response: { aiResponseText, isDangerSign: boolean }
  * Accepts a text query from the client's STT.
  * Queries an LLM/Llama model to generate advice.
  * Checks if the query indicates a health emergency, setting `isDangerSign` to true if so.

[DATA DIRECTORIES]
- GET /api/foods -> Returns list of standard local foods with nutritional values.
- GET /api/vaccines -> Returns the user's specific vaccination checklist timeline.
- POST /api/vaccines/log -> Body: { vaccineId, administeredDate } | Records/updates a dose.

[HEALTH TRACKER]
- GET /api/tracker/history -> Returns chronological history of health logs.
- POST /api/tracker/log -> Body: { logDate, weightKg, bloodPressure, nutritionNotes, symptoms }
