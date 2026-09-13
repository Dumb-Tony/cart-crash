# Milestone 1 — Standalone HTML vertical prototype

**Status: M1 implemented on 2026-09-13; human exit gate pending.** The sole purpose of this milestone is proving the core mechanic/verb before expanding content. Follow the offline, fixed-step, restart, storage, and measurement contract in GDD.md. All thresholds are initial acceptance targets to validate, not completed test results. Actual implementation decisions and evidence are in PARAMETERS_M1.md and PLAYTEST_LOG.md.

## Question and hypothesis
Does steering, pumping and landing a shopping cart on one hill create understandable momentum mastery? Players should retry to improve their line even with flat colors and no unlocks.

## Exact playable slice

M1-3 pace revision: following user feedback that the run was too slow and looked like a conveyor belt, the same hill now targets 35–55 seconds with world elevation and a chase camera. This supersedes the original timing hypothesis below; no new course was added.
A 45–75 second projected downhill course: start slope, broad turn, one pumpable dip, one ramp, optional dumpster gap, recovery runoff, finish. One cart; steer, lean, crouch/release, brake, restart. Bail may be omitted until it tests recovery rather than adds complexity. Show speed, elapsed time and a tiny FLOW counter for gap/clean landing events. Full crash resets to the last safe ground point with a two-second time cost; never restart automatically.

## Implementation specification
Track segments define slope, width, lateral boundaries, surface friction and ramp normals. Maintain longitudinal speed, lateral velocity, jump height/velocity and orientation. Clamp lateral authority in air. Use swept crossing checks for ramp, finish and gap triggers so high speed cannot skip them. Restart rebuilds all simulation state from the same track seed. Initial tunables: gravity 18 world units/s², grounded steering response 6/s, air authority 20% of ground, landing alignment tolerance 20 degrees. These are starting points.

## Deliberate exclusions
No cart shop, damage, advanced tricks, grinding, traffic, campaign, online features or external art. The hill is the content budget.

## Test procedure and exit gate
Give five fresh players the essential bindings, one practice run and five measured runs. At least four finish by run three; at least three improve completion time by 10% from first successful run or demonstrate a reproducible alternate line. At least three voluntarily request another run and can explain how they retained or lost momentum. Collect controls/camera confusion separately from enjoyment.

Verify that a ramp hit at maximum reachable speed cannot tunnel through ground, releasing pump in air adds no energy, 20 rapid restarts leave no stale input/events, and a ten-minute session stays responsive. Test 30/60/120 rendered FPS using identical input traces.

## Decision rule and deliverables
Deliver one offline index.html, a short test record, parameter notes and known limitations. If players cannot read depth, adjust camera before changing physics. If speed feels automatic, strengthen line-dependent friction/pumping. If steering feels random, remove wobble entirely. Iterate the same hill; do not add courses to obtain a pass.

## Authorized expansion: 2026-09-13

The user explicitly requested better cart graphics and continued game building. This supersedes the original content hold for the three Sunset Hill challenges in m1-6. Original human mechanic gates remain pending and are not inferred from automated testing.
