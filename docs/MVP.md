# Inner Depths MVP

## Goal

Deploy a usable Inner Depths application to real freedivers and learn whether
they find value in tracking dives, training and performance insights.

## Core user journey

User signs up
→ creates a profile
→ logs dives
→ logs training
→ views Home dashboard
→ sees progress over time
→ completes Performance Assessment
→ views assessment result

## MVP features

### Authentication
- Sign up
- Sign in
- Sign out
- Protected user routes

### Profile
- Name
- Experience level
- Primary freediving discipline
- Optional personal-best values

### Dive Log
- Create dive
- View dive history
- Edit dive
- Delete dive

Initial dive fields:
- date
- discipline
- depth
- duration
- location
- perceived effort
- comfort
- notes

### Training
- Create training session
- Session type
- duration
- difficulty
- notes

### Home
- User greeting
- recent activity
- summary metrics
- most recent dive
- simple training insight

### Progress
- dive count
- maximum depth
- average depth
- training sessions
- simple time-series chart

### Performance Assessment
- complete assessment
- save responses
- calculate existing prototype result logic
- show user-facing result

## Explicitly out of scope for initial MVP

- WHOOP API integration
- social/community platform
- lab integrations
- advanced AI recommendations
- neurofeedback
- clinician dashboard
- ARS public onboarding
- research enrollment automation
- payment system

## MVP success criteria

We should be able to invite a small group of real users and have them:

1. create an account
2. log at least one dive
3. log at least one training session
4. return later and still see their data
5. understand their Progress screen
6. complete the Performance Assessment
7. provide structured feedback