MamaVoice Companion
Technical Architecture & Mobile Engineering Reference
HelpMum CareCode Hackathon 2.0


This document is the consolidated technical reference for the MamaVoice Companion project. It covers the full engineering picture — starting with the mobile application strategy, then the backend architecture that powers it. The mobile section describes the Android stack, Clean Architecture approach, audio handling, offline resilience, and low-literacy design. The backend section covers the NestJS service design, voice processing pipeline, REST API, job queues, and security model.



PART 1: MOBILE ENGINEERING APPROACH

The MamaVoice mobile application is a native Android app. The guiding priorities are accessibility, offline resilience, and fluid audio processing — all designed specifically for low-literacy users in rural and urban Nigeria.

1. Core Mobile Technology Stack
The stack is modern, industry-standard native Android, chosen for high performance, quick feature iteration, and smooth UI animations.

•Language: Kotlin — the modern standard for native Android development, offering null safety, expressive syntax, and excellent support for asynchronous programming via coroutines.
•UI Framework: Jetpack Compose — Android’s declarative UI toolkit. It lets the team build a dynamic, media-rich, and highly customisable interface rapidly, without the verbosity of legacy XML layout code.
•Networking: Retrofit & OkHttp — a reliable, efficient HTTP client layer for secure REST API requests, multipart audio file uploads, and data fetching from the backend.

2. Architecture: Clean Architecture + MVVM
The codebase is divided into three independent layers to keep it maintainable, testable, and decoupled from external tools:

•Presentation Layer (UI / ViewModels) — owns the visual state machine. Manages states such as Is Recording, Playing Response, and Showing Error. Nothing here contains business rules.
•Domain Layer (Business Logic) — completely independent of frameworks. Defines what the app does, expressed as named use cases: SubmitVoiceQueryUseCase, GetVaccinationScheduleUseCase, and so on.
•Data Layer (Infrastructure) — manages actual data streams: network calls via Retrofit, local database reads and writes, and device hardware interactions such as the microphone and audio player.

3. Special Features & Technical Strategies
Audio Processing
Voice is the primary interface, so audio handling must be flawless and intuitive end-to-end.

•Recording: voice inputs are captured locally in compressed formats (AAC or MP3) to minimise file size and reduce mobile data usage.
•Transmission: audio files are packaged and sent to the backend as Retrofit multipart requests.
•Playback: Android’s Media3 / ExoPlayer is used to stream or play back the TTS audio responses returned from the backend AI.

Offline-First Strategy
Rural and semi-urban areas can have weak or erratic cellular networks. The app is designed to remain fully functional without a stable internet connection.

•Local Database (Room DB): all user tracking data, baby growth logs, and vaccination schedules are written to the local device database first. The app always renders instantly from this cache.
•Background Sync (WorkManager): user updates and logs are queued locally. When a stable connection is detected, WorkManager automatically pushes the data to the backend in the background — even if the app is closed.
•Hardcoded Safety Net: critical emergency information such as maternal danger signs is bundled into the app’s local files as both text and pre-recorded audio clips, accessible without any internet connection.

Low-Literacy & Local Language Adaptation
•UI Design: the interface uses high-contrast colours, large touch-friendly buttons, and clear universally understood icons. Dense text is avoided throughout.
•Dynamic Localisation: all text labels and visual aids switch automatically based on the user’s selected language — Yoruba, Hausa, Igbo, or English — ensuring cultural relevance and comfort.



PART 2: BACKEND ARCHITECTURE

4. System Overview
The MamaVoice backend is a modular, service-oriented application built on NestJS. The system is designed around a single core premise: a low-literacy mother in rural Nigeria should be able to speak a health question in Yoruba, Hausa, or Igbo and receive a spoken, clinically safe answer in under five seconds — even on a weak network.

Below is the high-level flow from client to AI model and back:

Mobile/Web Client
        ↓
API Gateway / BFF
        ↓                    ↓
Voice Processing         Authentication Service
        ↓
STT → Language Detection → Translator
        ↓
AI Orchestration Layer
   ↓                  ↓
MamaBot-Llama       Vax-Llama
        ↓
Response Formatter → Text-to-Speech → Client

Supporting the core flow are several peripheral services: push notifications, vaccination reminder scheduling, pregnancy and baby growth tracking, an offline knowledge cache, and analytics.

5. Core Architecture Principles
Every design decision in the backend traces back to five principles:

•Separation of Concerns — each NestJS module owns exactly one domain. The VoiceModule handles speech-to-text and nothing else; the PregnancyModule manages pregnancy records and nothing else. Modules do not reach into each other’s database tables.
•Single Source of Truth — user profiles, pregnancy records, and vaccination histories are each managed in one place (PostgreSQL via Prisma ORM) and read via the responsible module’s service layer.
•Fail-Safe Design — if the AI model is unavailable, the system returns a cached response. If translation fails, the query proceeds in English. The user always receives a response.
•Asynchronous by Default — STT, translation, and AI inference are async operations processed through BullMQ job queues, keeping the API response layer fast and non-blocking.
•Security First — all routes require valid JWT credentials. No health data is accessible without authentication.

6. Module Map
The backend is composed of eleven NestJS modules. Each module has a single, clearly bounded responsibility:

Module	Responsibility	Key Dependencies
AuthModule	Phone OTP registration and login. Issues JWT access + refresh tokens. Manages token revocation via Redis.	Termii SMS API, Redis, bcrypt
UsersModule	CRUD for user profiles. Stores language preference, role (mother / CHW / TBA), state, and LGA.	PostgreSQL, Prisma
PregnancyModule	Creates and updates pregnancy records. Calculates gestational age from EDD. Tracks ANC visits and complications.	PostgreSQL, Prisma
BabyModule	Manages baby profiles. Records weight, height, and growth milestones. Links to vaccination records.	PostgreSQL, Prisma
VoiceModule	Receives audio blob, sends to STT service, stores transcript, triggers translation pipeline.	Google STT API, BullMQ
TranslationModule	Bi-directional translation between English and Yoruba / Igbo / Hausa using HelpMum’s NMT model.	HelpMum 9ja/Eng API, BullMQ
AIRouterModule	Classifies query intent, injects user context, routes to correct AI model, merges dual responses.	MamaBot-Llama API, Vax-Llama API, Redis Cache
VaccinationModule	Manages the NPHCDA vaccination schedule per baby. Tracks given / due / overdue doses. Generates reminder events.	PostgreSQL, BullMQ, Scheduler
HealthDashboardModule	Aggregates data from Pregnancy, Baby, and Vaccination modules into a single dashboard response.	PostgreSQL, Redis Cache
OfflineSyncModule	Receives queued offline queries from the device, processes them through the full AI pipeline, and returns responses.	BullMQ, Redis
AdminModule	Usage analytics and moderation. Anonymised metrics only — no access to individual health conversations.	PostgreSQL, Prisma



7. Voice Processing Pipeline
The voice pipeline is the most critical part of the system. Every spoken query follows the same seven-step sequence. Each step is a discrete, independently testable service method.

Step 1 — Audio Ingestion (VoiceController)
The mobile app sends the audio file as a multipart/form-data POST to POST /voice/query. The VoiceController validates the file (max 5 MB, OGG/WAV/MP3 accepted), stores it temporarily, and emits a voice.received event to BullMQ. The backend stores only the temporary audio file path, user_id, session_id, and timestamp. The audio file is deleted as soon as STT completes.

Step 2 — Speech-to-Text & Language Detection (VoiceService)
The VoiceService dequeues the job from BullMQ and sends the audio to Google Cloud Speech-to-Text (multi-language model). The API returns a transcript, a language code (yo, ig, ha, or en), and a confidence score. If confidence is below 0.55, the backend asks the user to re-record. The transcript and language code are stored in the ConversationsTable before the job advances.

Step 3 — Translation to English (TranslationService)
If the detected language is not English, the TranslationService sends the transcript to HelpMum’s 9ja/Eng Neural Machine Translation (NMT) API. This model is specifically trained on Nigerian maternal health vocabulary, local food names, and the clinical terms used in Nigerian communities. If the HelpMum API times out (>3 seconds), the service falls back to Google Translate and flags the conversation record accordingly.

Step 4 — Intent Classification & Context Injection (AIRouterService)
The translated query is classified into one of three categories using lightweight DistilBERT cosine similarity (runs in-process in under 50ms, no external API call):

•PREGNANCY — danger signs, nutrition, symptoms, newborn care → routes to MamaBot-Llama.
•VACCINATION — schedules, due dates, side effects, AEFI → routes to Vax-Llama.
•MIXED — ambiguous queries hit both models in parallel; the router merges the responses.

Before routing, the router injects user context as the model system prompt. For pregnancy queries this includes EDD, current gestational week, risk level, ANC visit count, and any noted complications. For vaccination queries it includes the baby’s date of birth, vaccines already given, and the next due vaccine.

Step 5 — AI Model Inference (AIRouterService → HelpMum APIs)
The enriched prompt is sent to the appropriate model. The backend expects a structured JSON response:

Field	Type	Purpose
spoken_summary	string (max 2 sentences)	Short plain-language answer converted to speech and played to the user.
full_advice	string[]	3–5 bullet points displayed as a card in the UI.
danger_level	enum: GREEN | AMBER | RED	GREEN = normal, AMBER = monitor / book appointment, RED = go to hospital now.
action_items	string[] (optional)	Specific steps such as ‘Drink more water’ or ‘Visit clinic within 24 hours’.
disclaimer	string	Mandatory: ‘This is general health information. Please consult a health worker for personal medical advice.’

Safety override: if danger_level is RED, or if the transcript contains any emergency keyword (convulsion, not breathing, excessive bleeding, no movement, loss of consciousness), the AIRouterService immediately triggers the EmergencyAlertService, bypassing the normal pipeline regardless of model confidence.

Step 6 — Back-Translation to Native Language (TranslationService)
The spoken_summary and full_advice bullets are passed back to TranslationService and translated from English into the user’s detected language. Medical terms with no direct local equivalent are either left in English with a descriptive note appended, or replaced with a culturally understood phrase.

Step 7 — TTS Audio Generation (TTSService)
The translated spoken_summary is sent to Google Cloud Text-to-Speech using the appropriate voice model (yo-NG-Standard-A for Yoruba, ha-NG for Hausa, ig-NG for Igbo). The returned MP3 is stored temporarily and a signed URL — valid for five minutes — is returned to the client. The client plays the audio and simultaneously renders the full_advice card on screen. No audio is stored permanently.



8. REST API Endpoint Reference
All endpoints are prefixed with /api/v1. All routes except /auth/* require a valid JWT Bearer token in the Authorization header.

Authentication
Method	Endpoint	Description
POST	/auth/request-otp	Send a 6-digit OTP via SMS to the user’s phone number (Termii).
POST	/auth/verify-otp	Verify OTP and return access_token (15 min) + refresh_token (30 days).
POST	/auth/refresh	Exchange a refresh_token for a new access_token.
POST	/auth/logout	Invalidate the refresh_token. Removes it from the Redis allowlist.

Voice & AI
Method	Endpoint	Description
POST	/voice/query	Upload audio file (multipart). Returns spoken_summary audio URL, full_advice card, and danger_level.
POST	/voice/text-query	Text fallback — submit a query as a text string. Same response shape as /voice/query.
POST	/voice/offline-sync	Submit a batch of queued offline queries. Processed async; responses delivered via push notification.

User & Profile
Method	Endpoint	Description
GET	/users/me	Get the current user’s profile.
PATCH	/users/me	Update language preference, name, or location.
DELETE	/users/me	NDPR-compliant account deletion. Anonymises all health records.

Pregnancy
Method	Endpoint	Description
POST	/pregnancy	Create a new pregnancy record with EDD.
GET	/pregnancy/:id	Get pregnancy details including current gestational week and risk level.
PATCH	/pregnancy/:id	Update ANC visit count, complications, or risk level.
GET	/pregnancy/:id/dashboard	Aggregated dashboard: gestational week, next ANC, nutrition tips, danger sign status.

Baby & Vaccination
Method	Endpoint	Description
POST	/baby	Register a new baby profile with date of birth.
GET	/baby/:id	Get baby details and current growth records.
PATCH	/baby/:id/growth	Log a new weight and height measurement.
GET	/baby/:id/vaccinations	Full vaccination schedule with status: given, due, or overdue.
PATCH	/baby/:id/vaccinations/:vaxId	Mark a vaccine as given. Records facility and date.
GET	/baby/:id/vaccinations/next	Returns the next due vaccine name, date, and preparation instructions.

Notifications
Method	Endpoint	Description
POST	/notifications/register-device	Register an FCM push token for the user’s device.
PATCH	/notifications/preferences	Toggle vaccine reminders, daily check-in alerts, and emergency alerts on/off.



9. Scheduled Jobs & Queue Workers
The backend uses BullMQ (backed by Redis) for async job processing and @nestjs/schedule for cron jobs. These handle all non-real-time tasks so that the main API layer stays responsive.

Job Name	Trigger	What It Does
voice-processing-queue	On audio upload event	Runs the full pipeline: STT → Translation → AI Router → Back-Translation → TTS. Each step is a separate Bull job with automatic retry on failure.
offline-sync-queue	On POST /voice/offline-sync	Processes batches of offline queries through the full pipeline and sends a push notification when complete.
vaccination-status-updater	Cron: daily at 00:00	Scans all vaccination rows with status=due where due_date < today and updates them to overdue.
vaccination-reminder-job	Cron: daily at 09:00	Finds vaccinations due in 7 days, 3 days, and tomorrow. Sends push notification + SMS in the user’s preferred language.
check-in-reminder-job	Cron: daily at 08:00	Sends a gentle daily check-in reminder to active mothers. Skipped if the user has already interacted today.
token-cleanup-job	Cron: every 6 hours	Purges expired refresh tokens from Redis.



10. Security Architecture
Health data is among the most sensitive categories of personal data. Security is a first principle in MamaVoice, not an afterthought.

Authentication & Authorisation
1.Phone OTP authentication via Termii — no passwords, no email required.
2.JWT access tokens (15-minute expiry) and refresh tokens (30-day expiry) stored in a Redis allowlist.
3.On logout, the refresh token is immediately removed from Redis, invalidating future use.
4.All routes protected by JwtAuthGuard. Role-based access via RolesGuard.
5.Rate limiting on /auth/request-otp: maximum 3 OTP requests per phone number per 10 minutes.

Data Privacy (NDPR Compliance)
6.Audio files are deleted from the server within 60 seconds of STT processing completing.
7.Conversation transcripts are stored encrypted at rest (AES-256) in PostgreSQL.
8.Users can request account deletion via DELETE /users/me at any time. All PII is anonymised; health records are retained in anonymised form for aggregate research only.
9.Community Health Workers can only access profiles of mothers who have explicitly granted access via an invitation code.
10.Admin users can access only anonymised aggregate metrics — no individual conversation content.

Transport Security
•All API communication over HTTPS with TLS 1.3.
•CORS configured to allow only the registered mobile app origin.
•Helmet.js applied to all NestJS responses, setting secure HTTP headers.
•Request body validation via class-validator + class-transformer on all DTOs. Malformed requests are rejected before reaching the service layer.

AI Safety Controls
•AI model temperature set to 0.2 — produces consistent, conservative responses.
•Emergency keyword blocklist is checked before model inference. Any match triggers an immediate RED danger_level override.
•A mandatory medical disclaimer is appended to every AI response at the service layer and cannot be removed by the model.
•Response schema validation: if the AI model returns malformed JSON, the backend returns a safe fallback message rather than propagating the error to the user.



11. Backend Technology Stack

Component	Technology	Rationale
Backend Framework	NestJS (TypeScript)	Modular architecture with built-in DI, decorators, and guard system. TypeScript safety reduces runtime errors.
ORM	Prisma	Type-safe database queries, auto-generated client, and easy schema migrations.
Primary Database	PostgreSQL (Supabase)	Relational structure suits health records. Supabase provides hosted PostgreSQL with auth and storage on a free tier.
Cache & Job Queue	Redis (Upstash) + BullMQ	Redis for session tokens and response cache. BullMQ for reliable async job processing with retry logic.
SMS / OTP	Termii	Nigerian-first SMS provider with local number support, cheaper and more reliable than Twilio for Nigerian numbers.
Push Notifications	Firebase Cloud Messaging	Industry standard for Android push notifications. Free tier sufficient for MVP scale.
Speech-to-Text	Google Cloud STT	Supports Yoruba and Hausa language models with streaming API for fast transcription.
Text-to-Speech	Google Cloud TTS	Native Yoruba (yo-NG) and Hausa (ha-NG) voice synthesis with MP3 output.
Translation	HelpMum 9ja/Eng NMT API	Purpose-built for Nigerian languages and maternal health domain. Open-source, no licensing cost.
AI — Pregnancy/Newborn	HelpMum MamaBot-Llama API	Fine-tuned on Nigerian maternal health data. Outputs structured JSON with danger level classification.
AI — Vaccination	HelpMum Vax-Llama API	Trained on NPHCDA and WHO vaccination data with Nigerian context built in.
Task Scheduler	@nestjs/schedule	Built into NestJS. Handles cron jobs for vaccination reminders and status updates.
Validation	class-validator + class-transformer	DTO-level validation on all incoming requests. Malformed data never reaches the service layer.
Authentication	JWT (RS256) + Passport.js	RS256 asymmetric signing for token security. Passport strategy for NestJS guard integration.
API Security	Helmet.js + NestJS Throttler	HTTP security headers and request rate limiting.
Deployment	Render.com / Railway	Free tier for hackathon with auto-deploy from GitHub and Docker container support.
Config	NestJS ConfigModule + .env	Centralised environment variable management with validation schema.



12. Open Questions for Team Decision
The following items require a deliberate team decision before or during development:

11.CHW note-taking: should Community Health Workers be able to add notes to a mother’s profile during home visits? This increases data richness but requires careful consent design.
12.Conversation history visibility: should users see their conversation history in-app? This could build trust but raises sensitivity concerns if the device is shared.
13.USSD shortcode provider: which provider should serve the feature-phone fallback — Infobip, Africa’s Talking, or Termii?
14.AI model hosting: should the team self-host the HelpMum models or rely entirely on their hosted API? Self-hosting improves latency and removes the external dependency, but requires GPU infrastructure.
15.Minimum viable CHW dashboard: what should the demo-facing CHW view show? Should it surface mothers who are overdue for vaccination?

End of Document