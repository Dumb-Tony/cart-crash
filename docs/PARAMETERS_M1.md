# M1 implementation and tuning notes

Current build/physics/storage version: `m2-1` (2026-09-13). The sections below retain tuning history; newest revisions supersede older parameters.

## Quick charge, forgiving ramp entry, and visual detail

User reported intermittent ramp jumps and requested quicker charging plus another graphics pass. Full Space charge now takes 0.25 s (rate 4/s) instead of 0.67 s. A visible bar above the cart shows charge and READY. Ramp launch is automatic, independent of holding/releasing Space; text/signage now makes that explicit.

The inconsistency came from ramp entry requiring grounded state: a pre-ramp Space release could create a small hop, causing the automatic lip trigger to be skipped. The ramp now accepts approach hops up to 3 m above road height, preserves existing upward velocity if greater, and uses at least the 1.3 m lip height. Grounded releases in the right lane from 870–900 m are buffered to the lip instead of creating a premature hop. Holding crouch no longer subtracts launch impulse. Charge can add up to .5 m/s to launch before the existing 14.5 cap. Ordinary midair Space releases still add no energy; this forgiveness is tied to crossing the authored ramp. Slow approaches can still hit the obstacle, and poor landing alignment still matters.

Graphics: detailed shopfront windows/doors/reflections/striped awnings/signage/planters; layered tree canopies and branches; clouds, subtle asphalt texture and manholes; ramp approach chevrons and dark metal dumpster lids; 12% larger cart with rotating caster highlights and helmet/backpack details. Terrain/scenery samples are now fixed to world coordinates to avoid small placement jumps as the camera advances. All remain embedded Canvas assets. Developer `Early-release ramp` deliberately releases at 865 m to exercise the airborne-entry case during a complete ordinary replay.

## Partial caster guidance through curves

User requested an intermediate behavior between automatic line-holding and immediately driving straight into a curb. The caster's target world lateral velocity now follows only a fraction of road tangent: `1 - 0.38 × min(1, speed / 45)`. At 45 m/s and above this is 62% natural following; slower approaches get more help. The player supplies the missing turn using the existing steering input. This remains deliberate arcade assistance, not a claim about a real shopping cart's tire forces.

No-input first-bend traversal drifts 6.91 m from center (8 m half-width), spends 0.95 s on the rough shoulder, and does not crash. Digital correction taps around a ±1.5 m band limit deviation to 1.74 m with 1.87 s of total steering over the 16.07 s start/bend traversal. A controlled slower approach peaks at 4.21 m without steering. Curb response reflects road-relative lateral velocity, preserving road motion rather than incorrectly reversing the entire world velocity.

Safe/ramp developer replays now use those same explicit correction taps in the bend; their successful routes are no longer evidence of no-input line holding. `Freeze hands-off bend` is a separate zero-input replay which pauses at 405 m for inspection; Escape continues. Rules/records are versioned separately.

## Faster descent and world-space chase camera

User feedback identified slow pace and a conveyor-belt presentation. The hill now has continuous world elevation (about 332 m total descent), including broad rolls and a compression dip. Acceleration uses the derivative of that same elevation profile. Longitudinal downhill acceleration uses a 38 coefficient, initial speed is 14 m/s, speed cap 58 m/s, drag coefficient .002 and brake force 12. Jump gravity stays 18 to preserve controllable airtime. Scripted completions now take 38.050 s safe / 37.767 s ramp: approximately 40–42% shorter than m1-2. The revised M1 duration check is 35–55 s, intentionally superseding the original 45–75 s hypothesis in response to the request for more pace.

Projection now transforms world coordinates through an actual elevated chase-camera position, yaw and pitch, then performs perspective division. Camera position is 18 m behind and 9 m above road height, replacing the old fixed 42-unit projection. Road geometry continues 12 m behind the cart, with 500 m forward visibility. World elevation affects road, scenery and airborne position consistently. Focal length widens slightly with speed. Smoothed camera position/yaw trails the cart; pitch follows grade, and distant scenery pans with the view. Reduced effects disables small banking while retaining necessary terrain perspective.

Lateral velocity is now carried in world coordinates; road-relative position changes by the difference between cart and road motion. Finite steering response produces predictable drift through bends, instead of maintaining a fixed offset automatically. Ground caster alignment remains assisted; this is still a bounded arcade model, not a rigid-body vehicle simulation. World lateral momentum persists in air. Ground steering authority rises from 5.8 to 7.5 to remain useful at the higher pace. New regressions check actual descent, bend drift/camera heading, effective braking and maximum-cap-speed ramp traversal. Records use a new version key.

## User-requested jump and visual revision

Space release now gives a genuine grounded hop anywhere: vertical impulse 5.5 + 3 × charge, with charge in [0,1]. A tap reaches about 0.84 m; a full charge about 2 m. Releasing in the striped dip also retains the existing speed bonus. Airborne releases cannot add lift or longitudinal energy. Keyup buffers a release even when the entire tap occurs between simulation frames. This intentionally supersedes the original pump-only control hypothesis after user feedback that jumping did nothing. No additional course or milestone is added. Old records remain under the old version key and are not compared against these rules.

The cart now rises 32 screen pixels per world metre at the reference viewport, while its shadow remains fixed to road height. A dotted separation guide and AIR height label communicate flight even with reduced effects enabled. The cart visually follows the ramp slope before takeoff. Sunset gradients, distant hills/skyline, sidewalks, trees, buildings, streetlights, solid dumpsters and a perspective cart/rider replace the initial placeholder presentation; all remain embedded Canvas geometry with no network assets.

Ramp flight starts at the visible 1.3 m lip rather than snapping back to road height. The hard vertical landing threshold is now 17 m/s, accommodating the extra drop from the lip; orientation errors still cause a crash. The capped ramp reaches about 7.1 m above road height.

Developer `Freeze ramp apex` runs the same ramp replay and pauses at its physical apex without covering the canvas; Escape resumes it. It is an observation aid, not a position/height teleport, and remains behind `?test=1`.

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

## Cart and challenges: m1-6

Three contracts share Sunset Hill: dash under 40 seconds; slalom through six gates; air requires a gap, clean landing, and zero recoveries. Gates at 180, 330, 520, 720, 1150 and 1440 m accept 1.8 m lateral error and height under 2.2 m. Swept crossings prevent tunneling; recovery cannot farm gates. Each gate awards 50 through FLOW. Per-challenge records and badges save locally. Replays never save progress. Select slalom, start riding, then use Slalom replay in developer mode.

Cart: chromed chassis, deep mesh basket, corner guards, caster forks/hubs, front plate, and redesigned helmeted rider with backpack. Charge posture, steering lean, and landing compression animate the model. Course physics and ramp forgiveness are unchanged.

## Career expansion: m2-1

See CAREER.md for the current authored courses and progression. Stock starting speed is 18 m/s (was 14), downhill acceleration multiplier 42 (was 38), and Sunset cap 64 m/s (was 58). Market/Quarry caps are 70/76 m/s, with base grades .215/.245 and authored alternating bends. Course length, curves, grade, hazards, dash target, and later slalom gates are selected from course data. Existing pump dip and dumpster ramp remain as shared mechanics on each hill. All upgrade combinations retain a stock-compatible route.

Barricades collide over 4 m length below 1.3 m air height, including cart half-width .45 m. Cones/oil/boost occupy 14 m and affect grounded carts below .25 m once per run. Cone speed multiplier .7; oil .87 plus 3 m/s sideways impulse; boost +12 m/s capped at configured speed. Avoiding an obstacle awards 25 through FLOW. Recovery adds 1.2 s collision grace to prevent immediate repeated barricade hits. Geometry and collision use the same authored coordinates.

Developer Course replay follows the selected hill hazard route and right ramp. It saves no records, unlocks, or bolts. In test mode T restarts this replay; other shortcuts are unchanged.
