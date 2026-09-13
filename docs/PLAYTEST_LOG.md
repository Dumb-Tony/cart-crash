# Cart Crash — Playtest log

## 2026-09-13 — m1-3 faster world-space descent

User feedback: still slow; looked like the world scrolling toward the cart rather than descending a hill. Replaced the flat fixed-depth projection with an elevation-aware chase camera, near road continuing behind the cart, stronger perspective/parallax and camera lag. Increased actual starting speed/downhill acceleration/cap, made lateral motion inertial in world coordinates, and retained controllable braking and jumping. Parameters and the deliberate 35–55 s timing revision are documented in PARAMETERS_M1.md.

Final Node regressions: safe 38.050 s / ramp 37.767 s, identical across synthetic 30/60/120 render schedules, 0 / 163 points, no recoveries. New checks establish over 300 m of actual course elevation drop, variable grade, nonzero bend drift/camera heading and braking from 50 m/s to below 40 m/s in two seconds. Maximum-speed ramp check now uses the new 58 m/s cap. Prior jump buffering, recovery, banking, focus, storage, restart and ten-minute simulated stability checks also pass (15 completed simulated routes). This is automated evidence, not proof that the subjective motion-feel gate passes.

Final browser replays, 1280×720 on the previously recorded PC, mute/reduced effects enabled: ramp 37.77 s / 163 banked points / zero recoveries, 126.8 average rendered FPS, 3.10 ms maximum measured JS work; safe 38.05 s / zero points/recoveries, 106.4 average rendered FPS, 3.30 ms maximum JS work. Browser warnings/errors were empty after both. Screenshots inspected the closer road perspective and full foreground coverage. Actual human motion-feel testing is still needed; no new real-time ten-minute soak is claimed for this revision.

## 2026-09-13 — m1-2 jump and sunset visual revision

User feedback: the aesthetic needed substantial work and the jump did not actually jump. The previous Space behavior only boosted in the dip; it was not a general jump. Implemented real grounded tap/charged hops and buffered releases between frames, while keeping air releases powerless and preserving the ramp route. This supersedes the pump-only M1 hypothesis. Reworked the environment, cart/rider, ramp/bin presentation, HUD/menu palette, and explicit airborne separation from a grounded shadow.

Node regression suite passes, including new flat-ground tap/charged rise-and-land assertions and a keydown+keyup wholly between frames. Safe and ramp complete traces still finish in 65.575 / 63.208 s at synthetic 30/60/120 render schedules, with 0 / 163 banked points and no recoveries. Existing crash, repeated event, restart, focus, storage and simulated ten-minute checks pass. The prior real-time ten-minute soak below applies to m1-1, not this renderer. Browser verification for this revision is recorded after the route checks. Human feel/visual quality gates remain unclaimed.

Browser checks (same PC, 1280×720 in-app browser): actual Space keypress produced HOP feedback on ordinary road. An automated apex inspection showed clear airborne cart/shadow separation. Inspection also exposed the ramp-top/flight-height discontinuity, now fixed by starting flight at 1.3 m and allowing the corresponding 17 m/s vertical landing threshold. A regression asserts launch height never drops below the lip. The final corrected ramp replay completed in 63.21 s with 163 points, one gap/landing/pump and zero recoveries, averaging 116.8 rendered FPS with 2.60 ms maximum measured JS work; browser warnings/errors were empty. These are agent-operated/automated checks, not human feel testing.

Final safe-route browser replay: 65.57 s, zero score/recoveries, one pump, 132.2 average rendered FPS, 2.40 ms maximum measured JS work, no browser warnings/errors. Both final routes completed after the movement changes.

## 2026-09-13 — M1 implementation validation

Build/course/physics version: `m1-1`. Tester: coding agent using Node regressions and browser interaction/automated input, not a fresh human player. No five-player sample has been recruited or invented.

### Environment

- CPU: AMD Ryzen 9 9950X, 16 cores.
- GPUs reported by Windows: AMD Radeon RX 9070 XT and AMD Radeon integrated graphics. Browser GPU selection was not established.
- Browser: Codex in-app Chromium; 1280 × 720 viewport in screenshots, default device settings.
- Node: 24.19.0 at `C:\Program Files\nodejs\node.exe`. The separate bundled runtime exited without diagnostics when executing scripts, so the installed Node executable was used.
- Mute and reduced effects enabled for initial browser runs.

### Automated and browser evidence

`tests/m1.test.cjs` runs the actual embedded simulation code in a small Node VM with a mocked DOM/canvas. It does not use a duplicate physics implementation. Scripted traces hold Space between 590 and 650 m; the ramp trace steers right after 700 m until x ≥ 3.5. No steering/pumping energy is injected directly into those complete route runs.

| Complete scripted route | 30 render Hz | 60 render Hz | 120 render Hz | Bank | Crashes |
| --- | --- | --- | --- | --- | --- |
| Safe, with pump | 65.575 s | 65.575 s | 65.575 s | 0 | 0 |
| Right ramp, with pump | 63.208 s | 63.208 s | 63.208 s | 163 | 0 |

The compared simulation outcomes are identical (0% difference). These are synthetic render schedules around the 120 Hz fixed-step simulation, not physical monitor refresh modes. Both routes are within the proposed 45–75 s window.

Passing regression assertions:

- Maximum-cap-speed (42 m/s) ramp sweep clears the obstacle and lands without tunnelling or a forced crash.
- Releasing full compression in air adds exactly zero speed/vertical energy compared with the uncharged trace.
- Under-speed dumpster collision and misaligned landing recover at safe ground, apply time cost, and retain already banked points; severe landing clears pending points.
- Re-traversing the same ramp cannot farm banked events.
- Twenty rapid restart input sequences leave no held keys, charge, event IDs or progress.
- Focus loss pauses and clears inputs; frame calls while paused do not advance time.
- Large frame backlog is bounded to eight simulation steps.
- Crossing finish produces results; retry reconstructs clean play state.
- Storage exceptions do not break startup, finish, results or restart.
- Malformed numeric records fall back safely; valid settings/records round-trip; explicit local reset clears records.
- Ten minutes of simulated duration complete nine full ramp routes with finite state. This is not a wall-clock/browser soak claim.
- Source check finds no remote script or fetch dependency.

Browser interaction: started the game normally and let the safe line complete with no steering/pumping. Result: **66.99 s, 0 points, 0 recoveries**, with start → play → results confirmed in the DOM and road/cart inspected in a screenshot. This was an agent-operated browser check, not manual human feel testing.

The browser URL policy blocked direct `file://` navigation. Direct offline browser execution is therefore **unverified**; all game assets/code are embedded and the VM passed without network or working storage. Browser checks use a localhost server restricted to this one HTML file. That server is optional development tooling, not a game dependency.

A real-time browser replay soak completed **10 full ramp routes** (roughly 632 s of simulated play, result observed at 640 wall seconds). Final route: **63.21 s, 163 banked points, one gap, one clean landing, one pump, zero recoveries**, peak FLOW 1.50×. The browser reported **168.9 average rendered FPS**, with **1.70 ms maximum measured JavaScript render-plus-simulation work**. This cost excludes compositor/GPU/OS time; it is not a universal performance guarantee. Checkpoints at 114, 218, 340, 437, 516 and 579 wall seconds stayed responsive, with roughly 169 average FPS and no observed decline. Browser warning/error log was empty at completion. This is real-time automated input and rendering, not a human enjoyment test.

After the soak, 20 actual browser R presses followed by Escape produced a clean paused run: 0.00 s, 0 score, 1.00× FLOW, initial speed. The explicit replay controls do not save bests: the final replay results still showed the earlier ordinary safe best (66.99 s / 0 points).

Publication: public repository `Dumb-Tony/cart-crash`; GitHub Actions regression/deployment runs 34739411341 and 34739968019 succeeded. https://dumb-tony.github.io/cart-crash/ returned HTTP 200 with HTML identical to the committed artifact (normalized line endings). The public browser completed the safe route in 66.99 s with zero recoveries and no warnings/errors. Public reset cleared the test record. Pages receives only the standalone HTML; private SOURCE_BASIS.md remained local and absent from the public repository. Final follow-up updates retain the same tested physics and add record-value validation plus evidence documentation. Final screenshot inspection caught white-on-white secondary-button hover text; a dedicated dark hover background fixes that contrast defect.

### Iteration and decision

The first ramp impulse (speed × 0.30) repeatedly landed a normal approach inside the obstacle. Changed to min(14.5, speed × 0.52), then reran normal, low-speed and maximum-speed cases. Also fixed repeated clean-landing counters after recovery and prevented short jumps before the dumpster from awarding a clean-landing event. Added a dark HUD backing after screenshot inspection exposed weak contrast against the sky.

**Decision: iterate M1 with fresh humans; do not begin M2.** Technical implementation supports the bounded experiment, but enjoyment, comprehension, meaningful carving and voluntary retry remain unmeasured. The broad bend is road-relative and has no centrifugal dynamics. Depth readability near the ramp, usefulness of lean, and the modest time benefit of the alternate line need human observation before further tuning.

### Required human gate

Recruit five fresh players if available; essential bindings, one practice run, five measured runs each. Record completion by run three, ≥10% time improvement or a reproducible alternate line, voluntary retries, explanations of momentum, and controls/camera confusion separately. The proposed four-of-five completion and three-of-five mastery/retry gates remain **pending**. Do not infer them from automation. HUMAN_TEST_SHEET.md is a blank worksheet for that experiment.

## Entry template

- Date / build / course / physics version:
- Test PC CPU, GPU, browser, resolution:
- Tester familiarity and accessibility settings:
- Hypothesis being tested:
- Task, attempt count and observed results:
- Completion time / relevant score / mechanic-specific metrics:
- Voluntary retry and comprehension observations:
- Bugs, unfair states and performance measurements:
- Parameter changes and why:
- Retest evidence:
- Decision: proceed / iterate / park:
- Unresolved questions and next bounded experiment:
