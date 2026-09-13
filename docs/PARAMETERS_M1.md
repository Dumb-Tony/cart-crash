# M1 implementation and tuning notes

Build/course/physics/storage version: `m1-1` (2026-09-13).

## Bounded model

One 1,800 m authored hill; projected Canvas 2D with an intentionally stable horizon. Road-local lateral position, longitudinal speed, lateral velocity, jump height/velocity, pitch and roll are integrated at 120 Hz. The broad bend is a road-relative presentation; it does not simulate centrifugal force or require physically turning a chassis. Steering spends speed and moves between surfaces. This approximation remains a human-test question, especially whether carving feels sufficiently like a cart.

Track data carries section ends, slope, width and rolling resistance. One explicit ramp at 900 m launches only the right lane (x > 1.4). The dumpster volume occupies 915–943 m on that side. The full-width road continues underneath the optional obstacle: the left lane always remains finishable. Swept longitudinal crossing checks handle ramp, gap and finish. At a maximum of 42 m/s, a fixed step moves at most 0.35 m; the 28 m obstacle interval cannot be skipped.

## Tunables and decisions

| Parameter | Current value / reason |
| --- | --- |
| Gravity | 18 world units/s²; specification starting point |
| Ground steering response | 6/s; specification starting point |
| Air steering authority | 20%; specification starting point |
| Alignment tolerance | 20° pitch, bounded roll; hard landings are deterministic |
| Speed bounds | 3–42 m/s; braking never leaves the cart permanently stuck |
| Ramp vertical launch | min(14.5, speed × 0.52), minus 0.5 while crouched |
| Original rejected ramp | speed × 0.30 landed normal approaches inside the dumpster volume |
| Pump | Charge on ground over ~0.67 s; release at 635–690 m for up to +4 m/s |
| Off-window / airborne release | Clears charge, adds zero speed or jump energy |
| Safe surface | 2.3× rolling resistance from 770–1090 m, left of x=1.4 |
| Verge surface | 2.8× rolling resistance; curb scrape loses additional speed |
| Recovery | Last safe ground before/after jump; speed 9 m/s; +2 s; bank retained |
| FLOW | Gap 100; landing 50 × current multiplier; unique IDs; +0.25 per event |
| Banking | 0.5 s settled on ground; decay toward 1× after 2 s settled |

The normal scripted ramp line banks 100 + round(50 × 1.25) = 163 points. No near misses, rails, damage, unlocks, bail or later content were added. Placeholder synthesized event tones are muted by default. Reduced effects defaults on; turning it off adds peripheral streaks without shaking the horizon.

The ramp impulse is deliberately arcade, capped to keep maximum-speed landings recoverable. Low-speed approaches can still hit the dumpster; steer left after recovery to take the safe lane. No automatic full restart occurs. Scores and times remain separate, with no score-derived time bonuses. A rules-version change must use a new storage key.

## Developer checks

Backquote toggles the physical-state and frame-cost overlay. `?test=1` reveals explicitly labeled safe/ramp replay and real-time ten-minute soak buttons. Start the game, then select a replay. These supply the same deterministic input trace used in the test suite through the ordinary frame/simulation loop; they do not save records. R exits replay into normal play. The soak repeats full ramp routes until at least 600 wall seconds have elapsed and the current route finishes. This is automation, not human feel testing.

The frame loop uses a 1/120 s accumulator, eight-step cap, discarded excessive backlog, and focus/visibility pause with cleared input. Blocked localStorage falls back to memory. No network request, asset dependency, install, or build is required by the game itself.
