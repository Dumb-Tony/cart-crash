# Cart Crash — Game Design Document

## Elevator pitch
A downhill shopping-cart stunt game where ordinary streets become improbable racing lines. Reach the bottom, link speed, jumps and near misses into FLOW, and discover that the fastest route goes through the scenery. Target runs: 1–4 minutes.

## Design pillars
- Momentum is earned through terrain and conserved through decisions.
- Finishing is approachable; finishing stylishly is a mastery problem.
- Instability is legible and recoverable, never random punishment.
- Shortcuts and physical comedy emerge from the same movement rules.

## Player fantasy
Become dangerously competent at something obviously foolish. A wobbling cart clearing a dumpster and landing on a ramp should feel like an intentional stunt that almost went wrong. The player controls the line; the cart supplies character.

## Core gameplay loop
Choose a course and goal → launch → build momentum → choose safe or risky lines → link stunts → recover or bail → cross the finish → compare time and score → restart. Time trial and score attack share courses but retain separate records; a slow trick-heavy run must not ambiguously beat a fast time trial.

## Controls

M1-2 revision after user feedback: Space hold/release now makes a real grounded hop anywhere, with additional speed only in the pump zone. Quick releases are buffered between simulation frames. This supersedes the original pump-only hypothesis below; details and tests are in docs/PARAMETERS_M1.md and docs/PLAYTEST_LOG.md.
Proposed keyboard: A/D or arrows steer; W/S lean forward/back; Space crouch, release to pump; Shift brake; B bail; R restart; Escape pause. Steering also supplies modest airborne roll correction. Gamepad later: left stick steer/lean, right trigger crouch, left trigger brake, face button bail. Remap everything; avoid mandatory simultaneous three-key chords. Pumping only adds a small impulse from stored compression when contacting suitable terrain; it is not an unlimited jump button.

## Moment-to-moment mechanics
Read the next landing, crouch into a dip, release toward a crest, and steer into a shortcut. Lean offsets balance and helps align the chassis with a landing. Hard steering spends speed and risks a two-wheel tip. A scrape interrupts neither run nor all earned score. A severe tumble drops the active combo; a brief settle or checkpoint recovery restores control. Bailing is an optional comedic cash-out of part of the active combo, not a required ragdoll minigame.

## Physics and systems
Represent downhill progress and lateral position on a projected course, with height, vertical velocity, pitch and roll. Gravity projected along slope produces speed; rolling resistance and brake force oppose it. Steering authority decreases at extreme speed and in the air. Ground contact samples support points and slope; suspension is initially a spring-damper approximation. Landing severity depends on normal velocity and orientation error, not a hidden random roll.

After M1, test asymmetric wheel friction and a capped damage state. Bent frames and caster wobble must remain predictable; damage cannot make a course unwinnable without a quick recovery. Authored rail volumes may assist alignment within a narrow entry angle, then require balance. Destructibles have finite break thresholds and award each event once.

## Scoring
Proposed score attack: unique events award base points—gap 100, clean landing 50, near miss 75, breakable 25, rail 20/second. An active FLOW multiplier starts at 1x, increases by 0.25 for a new valid stunt up to 5x, and decays after two seconds without meaningful motion or events. Repeated contacts with one prop cannot score again. Land and maintain control for 0.5 seconds to bank the pending sequence; severe crashes lose pending points, not banked points. Tune windows through tests. Time trial ranks elapsed time, with recovery time included and no score-derived time reductions.

## Level and environment design
Each course needs a readable beginner route, a signposted intermediate cut, and a discoverable expert line. Sightlines show landing zones before commitment. Use curbs, awnings, rails and dumpsters as coherent geometry. M1 is one hill with a ramp and alternate line. Conditional small release: four courses—supermarket, parking garage, suburb, downtown—with time and score challenges. Mega Mall, airport, mountain town and The Hill remain backlog. Avoid unpredictable cross traffic on mandatory beginner lines.

## Progression and unlocks
Medals unlock courses without requiring gold performance. Cart variants are tradeoffs: standard balanced; mini agile/tippy; warehouse heavy/slow-turning. Cosmetic stickers and helmets reward optional goals. No grinding for acceleration upgrades. Unlock eligibility and record compatibility are visible; each handling class has separate bests.

## Replayability
Route discovery, score chains, local medals and personal bests provide the first hooks. A later local ghost aids time trials. Challenge variants can restrict braking or require named gaps using existing levels. Daily seeds, online records and course generation are deferred; fixed courses establish reliable mastery first.

## Art direction
Chunky stylized suburban geometry, clear asphalt/grass/metal materials, bright cart silhouette, and comic signs. Camera looks ahead with speed but preserves stable horizon and landing visibility. The cart remains readable against clutter. Final dimension and renderer are a post-M1 decision.

## Animation and VFX
Wheel wobble and chassis compression communicate load. Rider lean anticipates turns; recoveries are short and interruptible after a safe state. Sparks identify scrapes, a brief tire trace describes carving, and restrained landing squash sells impact. Camera shake and speed streaks have independent intensity controls. No VFX may obscure the course.

## Audio
Layer wheel rattle by speed and roughness, caster clacks by damage, wind by speed, and distinct land/scrape/crash transients. FLOW feedback rises gently without becoming a continuous alarm. Audio must distinguish a clean landing from a costly impact. Use generated placeholder sounds for M1; mute is available before play.

## UI/UX
Start screen states the objective and essential controls in one view. HUD prioritizes upcoming path, timer, FLOW and pending/banked score. Result screen shows best time, score breakdown, biggest chain and instant retry. Explain why a combo ended. Full restart is immediate; later checkpoint recovery keeps the timer running.

## Accessibility and options
Remapping, sensitivity/deadzone settings, brake/crouch hold-or-toggle, high-contrast route markers, scalable text, reduced motion, separate audio sliders and optional steering stabilization. No color-only hazards. Assisted runs keep separate local records and remain fully playable. M1 supports keyboard, pause, mute and reduced effects; gamepad and richer assistance come after the mechanic gate.

## Technical approach
M1 uses Canvas 2D projection with a short authored course and bounded arcade physics, not four fully simulated wheels. Preserve speed, lateral control, pumping, landing and flow outcomes. If camera depth makes navigation ambiguous, evaluate a low-poly 3D renderer in M2 while retaining the same control experiments. Keep track data separate from simulation parameters. Record input and course version before attempting a ghost system.

## Risks and mitigations
- Too many controls: teach steering/braking before pump and lean; remove a control if it contributes little.
- Cart feels like a car: tune caster response, weight transfer and landing comedy without introducing dice-roll failures.
- FLOW encourages farming: unique event IDs, distance progress requirements and diminishing repeats.
- Damage destroys mastery: delay damage until baseline movement passes; bound penalties and provide recovery.
- Content hides weak handling: the one hill must earn voluntary retries before further courses.

## Scope boundaries
M1 excludes damage, rails, ragdolls, unlocks, traffic and a campaign. Conditional first release caps at four courses, three handling variants, local time/score modes and cosmetic rewards. No open world, vehicle customization economy, multiplayer, procedural cities or advanced wheel deformation. Additions require explicit budget tradeoffs.

## Milestone roadmap
1. **Standalone HTML vertical prototype:** one hill; prove cart momentum, carving, pumping and recoverable landings. Exit only through the M1 playtest gates.
2. **Handling validation:** test projected versus 3D presentation, settle camera, add one rail and bounded damage separately. Keep only systems that improve line choice.
3. **Small game:** build the four-course budget, three balanced cart classes, local progression and records. Every course needs distinct route decisions and a finishable safe path.
4. **Polish and release readiness:** readability, sound, accessibility, performance and save/reset verification; freeze physics before final medal/ghost tuning.
5. **Optional expansion decision:** evaluate new locations, challenge variants or multiplayer as independent proposals after evidence of sustained solo replay.

## Development policy and evidence

This is a planning document, version 0.1, dated 2026-09-12, with M1 implementation status updated 2026-09-13. It is not a production commitment. Private concept-development provenance is retained locally in docs/SOURCE_BASIS.md. The user's current brief takes precedence over older multiplayer brainstorming. Mechanical formulas, key bindings, content budgets, and test thresholds below are proposed hypotheses, not measured results. Actual M1 tuning and evidence are recorded separately.

Single-player first. No accounts, servers, matchmaking, replication, rollback, network authority, or multiplayer-driven entity architecture. A later multiplayer proposal requires its own feasibility and scope decision. Ordinary modular separation of input, simulation, presentation, and save data is sufficient now.

Milestone 1 is a standalone HTML vertical prototype whose sole purpose is proving the core mechanic/verb before expanding content. “Vertical” means a complete tiny start–play–result–restart loop, not production polish. The implementation is now in prototypes/m1/index.html. Human exit gates remain open; no full production build is included.

## Shared implementation and validation contract

Deliver the future M1 as one index.html with embedded CSS, JavaScript, geometry, and generated sound. It must open from file:// offline with no installation, build command, CDN, remote fonts, fetch, or external asset requirement. Use Canvas 2D for initial rendering, including projected geometry where specified. No engine decision for the full game is implied.

Use requestAnimationFrame for presentation and a fixed 1/120-second simulation accumulator, capped at eight catch-up steps. Discard excessive backlog after suspending a tab; pause on lost focus and clear held input. Tune to a stable 60 rendered frames/second on the actual test PC, whose CPU, GPU, browser, and resolution must be recorded. Compare repeated scripted input at 30, 60, and 120 rendered FPS; traversal/score differences above 2% need investigation. This is local repeatability, not a promise of cross-browser bitwise determinism.

Persist only settings and appropriate local records through a versioned localStorage adapter wrapped in try/catch. The game must remain playable in memory when storage is unavailable, especially under file://. Provide an explicit local reset action. Later ghost recordings must carry course, rules, and physics version identifiers. Never silently compare incompatible records.

Developer-only overlays report frame cost, simulation time, relevant physical variables, and reset state. M1 tests cover the normal loop, boundary cases, focus loss, rapid restart, and prolonged use. Do not invest in a general framework before a mechanic passes.

## Milestone governance

Milestones are exit gates, not promised calendar dates. At each gate, record observations, parameter changes, unresolved issues, and a proceed / iterate / park decision in docs/PLAYTEST_LOG.md. Recruit five fresh players where possible; an internal solo test can identify problems but cannot count as the fresh-player comprehension gate. Small samples are directional evidence.

M1 includes only the bespoke prototype specification in docs/PROTOTYPE_M1.md. Do not begin M2 merely because M1 runs without crashing. If the mechanic misses its enjoyment or readability gate, run up to two focused tuning rounds before deciding whether to revise the premise or park it. Adding levels, upgrades, story, or polished assets is not the remedy for an unproven verb.
