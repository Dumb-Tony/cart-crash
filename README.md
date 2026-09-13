# Cart Crash

Single-player downhill shopping-cart experiment. **Milestone 1 implemented; human mechanic gates remain open.**

Play: https://dumb-tony.github.io/cart-crash/

Offline: open `prototypes/m1/index.html` in a desktop browser. The file embeds all CSS, game code, geometry and synthesized audio. No installation, build, CDN or external assets are needed. Keyboard required.

Steer with A/D or left/right; W/S or up/down lean; hold/release Space to jump (longer hold gives more height); release in the dip's striped exit for a speed boost; Shift brakes; Esc pauses; R immediately restarts. Stay left of the ramp for the safe route, or retain speed and take the right dumpster jump. Mute and reduced effects are available before play. Results show separate local time and score bests. The start screen can reset local records.

- Read [GDD.md](GDD.md) for the comprehensive design and scope.
- Read [docs/PROTOTYPE_M1.md](docs/PROTOTYPE_M1.md) for the standalone HTML mechanic test and acceptance gates.
- Record actual test evidence in [docs/PLAYTEST_LOG.md](docs/PLAYTEST_LOG.md).
- Read [docs/PARAMETERS_M1.md](docs/PARAMETERS_M1.md) for tuning and developer checks.
- Private design provenance remains locally in `docs/SOURCE_BASIS.md`, excluded from Git.

Intended working directory: C:\GPT_DEV\cart-crash

Run regressions with `node tests/m1.test.cjs` (Node 24; no packages). Optional local browser preview: `node tests/serve.cjs`, then open http://127.0.0.1:4178/. The server exposes only the game HTML. GitHub Actions runs the regressions and deploys only that HTML to Pages on pushes to main.

M1 must pass its fresh-player comprehension, improvement and voluntary-retry gates before expanding content. Automated replays cannot establish those subjective outcomes.
