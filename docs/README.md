# RI:R

A browser-based incremental game focused on Amoeba production,
upgrades, automation, Cells, and eventually deeper progression systems.

## Current work:

Game architeacture REVAMP!!

Step-by-step orchestration

Each phase should end with npm run typecheck, npm run dev, and a manual smoke test: click, buy U1, hit a milestone, reload to check the save, and do a Cell reset. Commit after every phase.

Phase 0: Get a working baseline.

[ x] Make a git commit or branch.
[ x ] Fix the for…of on milestones in app.ts (use Object.values) so the game renders again.
[x ] Add a check:cycles script (madge --circular --extensions ts .) so you can watch the two cycles shrink.

Phase 1: Config and hygiene (no code logic touched).

[ x] Use one tsconfig: delete jsconfig.json and set moduleResolution: "Bundler". Then imports no longer need .js.
[ x] Do the deletions from Section 3 and add .DS_Store to .gitignore.
[x ] Remove break_infinity.js or decide to keep it.
(Note: I dont use any library now.)
[x ] Merge the duplicate CSS selectors.
[x ] Get typecheck to 0 errors. This is the safety net for every later phase.

Phase 2: Move types and constants.

[ x] Create core/types.ts and core/config.ts. Move the interfaces and literals such as 250000 and the save key. Only type imports change, so behavior is the same.
[x ] Use VS Code’s “Move to a new file” action so the imports update for you.

Phase 3: Break Cycle A (data versus logic).

[ x] Create formulas/ and move getU2Mult, the synergy math and the RNA burst formula there. Make them pure functions.
[ ] Point data.ts at formulas/ only. Delete the duplicate synergy.
[x ] Change makeInitialState to take IDs as parameters.
[ ] Split data.ts into data/upgrades/*.
[x ] Done when madge no longer lists the data/state/calculations group.

Phase 4: Make systems/ DOM-free.

[ ] Split calculations.ts into effects, stats and upgrades.
[ ] Move the DOM lines out of cells.ts and milestones.ts. These are the getElementById calls, unlockUpgrade, unlockSlamoDNA and renderMilestoneText. The logic sets state flags, and the UI reads them.
[ ] Extract the click rules into systems/clicks.ts.
[ ] Fix the logic bugs from the last review as you touch each function, one function per commit.

Phase 5: One way to change state, and the engine.

[ ] Make a decision here. My default is Option A: systems mutate the one live state, and dispatch(action) calls the system function, then fires onChange. This drops the clone-per-action reducer and replaceState(any). Option B keeps the immutable reducer, but every handler must go through it. I’d pick A for a solo game ticking every second, but it’s your call.
[ ] Add engine/events.ts (onChange) so the engine never imports UI. This breaks Cycle B.
[ ] Split gameLoop into engine/tick.ts.

Phase 6: Split the UI.

[ ] Split render.ts into ui/*.
[ ] Reduce app.ts to main.ts (boot only) plus ui/bindings.ts.
[ ] Cache DOM elements once in ui/dom.ts and move per-frame work to ui/frame.ts.
[ ] Do the HTML ID audit and fix the <h2 id="upgradeList"> and nested <footer> issues if they’re still there.

Phase 7: CSS, docs and guardrails.

[ ] Split style.css into styles/*.
[ ] Rewrite docs/architecture.md, which you’ve marked as outdated.
[ ] Add an ESLint no-restricted-imports rule per folder (for example, nothing in systems/ may import from ui/). Add check:cycles to your lint script.
[ ] Optional: add Vitest for systems/ and formulas/, since they’ll be pure.

`architecture.md`

> =- TODO: RESEARCH -=

Planning

- [ ] Plan DT 4-6
- [ ] Add some clarifications/more content inside of the design doc -> research
- [ ] Small cleanup

Implementation

- [ ] Implement the data for EM1-2
- [ ] Implement the data for DT 1-3

## Architecture:

cells upgrades (re1, re2, re3) live in the upgrades folder
Amoeba/main game environment lives inside amoebaTab
Cells environment (kineticEnergy, RNA, re1-2-3) lives inside cellsTab
RNA has little to no further upgrades after 1000

### SLAMO DNA

Slamo DNA upgrades are bought by kineticEnergy.
Slamo DNA upgrades work the same way as normal upgrades, living inside the "upgrades" array.
Slamo DNA changes your playstyle into active, passive, or aggressive (most efficient but rng based)
slamo dna upgrades are just repeatables.
slamo dna is meant to be a side feature, not doing much (3-30x amoeba boost, e5-e12)

### RESEARCH

Entropy, cells, RE1-3, amoeba, and amoeba upgrades get reset upon a research reset.
Research upgrades persist across resets.

### DISCOVERY TIERS:

- DT1: x3 amoeba, adds U20-U25
- DT2: G1 effect +0.02 (/1.05 -> 1.07)
- DT3: RE1's cap -75 (from 250), in return,
  get increased RE1 effectiveness based on cumulative levels of RE1-3
- DT4: EM1 (kineticEnergy milestone 1) effectiveness formula +0.1
- DT5: Automation power x10, AP boosted on RE1 levels.
  Side-effect: x1.8 automator speed (3s -> 5s)

Research upgrades correspond with the discovery tier you're on.
Example: DT2 -> unlocked R1, R2

### RESEARCH UPGRADES:

- R1: Crit upgrades boosted and possibly reworked
- R2: Click cooldown increased by x2, in return kineticEnergy and amoeba are increased both by x1.66
  Additionally, U2 cap +5, G1 cap +17
- R3: Slamo DNA effectiveness +0.05, x1.7 RNA
- R4: Minigames' boosts are increased
- R5: Cheapen cell upgrades based on kineticEnergy (formula weak to prevent feedback loop).

### MAIN UPGRADES II (U20-U25)

- U21: Crit II guarantee chance /2
- U22:
- U23:
- U24:
- U25:

Key features:
Discovery tiers (Dt 1-3) are milestones that you get by doing a research reset.
TODO: CHANG SLAMOMILESTONES INTO MILESTONES
Every time you get another discovery tier, it reduces the severity of the amoeba softcap a, but increases the scaling exponent of RE1-3.

Upon your first research, you get presented with R1-5, all costing around e14-e24 amoeba.

### Breakthroughs

TBD

### Singularity

TBD

### Automator Trials

TBD

## Bugs/loopholes

1. > Crit I / Crit II interaction

Potential loophole:

- player tries to maximize crit effectiveness, not caring about crit chance
- player maximizes crit II chance, since it inherits the effect of a normal crit
- now, the player gets the best of both worlds!

  need to decide whether this is:
  - intentional synergy
  - a tradeoff
  - or something that needs a restriction

## Debugging procedure

You can write here about current bugs to help thinking

1. What exactly is supposed to happen?
2. What actually happens?
3. Where does the behavior first become wrong?
4. What value did I expect?
5. What value did I actually get?
6. console.log() it.
7. Change ONE thing.
8. Test again.

Current progression target:
e0 → e5 Amoeba = cells
e5 -> e12 amoeba = research
...- [RI:R](#rir)

> LINKS!!!!
> [RI:R Github :DDD](https://github.com/etohgamerbruh1000-cmyk)
> ![Screenshot](./images/slamo.png)
> Table of Contents

- [RI:R](#rir)
  - [Current work:](#current-work)
  - [Architecture:](#architecture)
    - [SLAMO DNA](#slamo-dna)
    - [RESEARCH](#research)
    - [DISCOVERY TIERS:](#discovery-tiers)
    - [RESEARCH UPGRADES:](#research-upgrades)
    - [MAIN UPGRADES II (U20-U25)](#main-upgrades-ii-u20-u25)
    - [Breakthroughs](#breakthroughs)
    - [Singularity](#singularity)
    - [Automator Trials](#automator-trials)
  - [Bugs/loopholes](#bugsloopholes)
  - [Debugging procedure](#debugging-procedure)
