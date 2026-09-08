# RI:R

A browser-based incremental game focused on Amoeba production,
upgrades, automation, Cells, and eventually deeper progression systems.

## Current work:

Get global milestone system to work

[ ] Milestones need to be global
[ ] Milestones need to have an applyMilestoneEffect() function
[ ] and an isMilestoneUnlocked() function too.

[ ] Map out data structure! :D

`architecture.md`

> =- TODO: RESEARCH -=

Planning

- [ ] Plan DT 4-6
- [ ] Add some clarifications/more content inside of the design doc -> research
- [ ] Small cleanup

Implementation

- [ ] Add the global milestone system
- [ ] Implement the data for EM1-2
- [ ] Implement the data for DT 1-3

## Architecture:

cells upgrades (re1, re2, re3) live in the upgrades folder
Amoeba/main game environment lives inside amoebaTab
Cells environment (entropy, RNA, re1-2-3) lives inside cellsTab
RNA has little to no further upgrades after 1000

### SLAMO DNA

Slamo DNA upgrades are bought by entropy.
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
- DT4: EM1 (entropy milestone 1) effectiveness formula +0.1
- DT5: Automation power x10, AP boosted on RE1 levels.
  Side-effect: x1.8 automator speed (3s -> 5s)

Research upgrades correspond with the discovery tier you're on.
Example: DT2 -> unlocked R1, R2

### RESEARCH UPGRADES:

- R1: Crit upgrades boosted and possibly reworked
- R2: Click cooldown increased by x2, in return entropy and amoeba are increased both by x1.66
  Additionally, U2 cap +5, G1 cap +17
- R3: Slamo DNA effectiveness +0.05, x1.7 RNA
- R4: Minigames' boosts are increased
- R5: Cheapen cell upgrades based on entropy (formula weak to prevent feedback loop).

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
