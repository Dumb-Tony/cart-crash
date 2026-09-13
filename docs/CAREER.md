# Cart Crash career

Play: https://dumb-tony.github.io/cart-crash/

Finish any challenge on a hill to unlock the next. Beating the optional challenge goal awards a star; you do not need a star to progress. Each hill offers Dash, Slalom, and Air mail, with separate local bests. The courses share the pump dip and dumpster ramp, then develop distinct bends and obstacle sequences.

| Hill | Length | Stock speed cap | Dash target | Course character |
| --- | --- | --- | --- | --- |
| Sunset Hill | 1.8 km | 230 km/h | under 38 s | Original bend, dip, and optional dumpster ramp |
| Market Mile | 2.4 km | 252 km/h | under 46 s | Alternating bends, 3 barricades, cones, oil, boost strip |
| Quarry Drop | 3.0 km | 274 km/h | under 49 s | Steeper descent, 4 bends, 4 barricades, oil, cones, 2 boost strips |

Caps are limits, not guaranteed sustained speeds. Braking, steering, rough ground, and grade affect actual pace. Stock carts can finish every course. Steering remains partially guided by the casters; bends still require corrections.

## Road features

- Orange barricades: steer around or clear their 1.3 m height with a well-timed jump. Hits recover the cart with the usual time penalty.
- Cone clusters: hitting one sharply reduces speed.
- Dark oil spills: reduce speed and knock the cart sideways; countersteer.
- Green boost strips: cross on the ground for a speed burst and points.

Hold Space up to a quarter-second, then release to hop. Release early enough to gain height before a barricade. The dumpster ramp still launches automatically and accepts small approach hops. Slalom requires all six gates, even if a detour around an obstacle is necessary.

## Bolts and garage

Every ordinary finish earns 100 bolts, plus floor(banked score / 5), capped at a 100-bolt score bonus. Zero-recovery runs earn another 50. Replaying hills earns more bolts; restarting or abandoning does not. Developer practice replays award nothing.

| Upgrade | Cost | Effect |
| --- | --- | --- |
| Race bearings | 180 | +36 km/h speed cap and stronger downhill acceleration |
| Caster stabilizers | 220 | 25% stronger steering, quicker response |
| Spring chassis | 160 | Landing pitch tolerance 20 to 28 degrees; vertical touchdown limit 17 to 21 m/s |

Purchases fit automatically on every hill, are bought once, and persist locally. The garage disables unaffordable and already fitted upgrades. Records include upgraded runs.

## Save behavior

Progress uses the stable localStorage key `cart-crash-career`. The first load migrates settings, records, and challenge stars from `cart-crash-m1-6` when present. New career progress starts with Sunset Hill unlocked. Reset local records clears bests and stars but preserves earned bolts, purchased upgrades, and course unlocks. If storage is blocked, play still works, but progress lasts only for the current session.
