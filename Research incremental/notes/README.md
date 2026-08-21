# RI:R

A browser-based incremental game focused on Amoeba production,
upgrades, automation, Cells, and eventually deeper progression systems.

# SMALL GOAL:

Slamo DNA

- [ ] design DNA structure
- [ ] implement DNA data
- [ ] implement DNA selection/unlock logic
- [ ] render DNA
- [ ] commect DNA to slamo effects
- [ ] playtest (intended time: 20-40 minutes)

  ## s

### Data structures:

cells upgrades (re1, re2, re3) live in the upgrades folder
Amoeba/main game environment lives inside amoebaTab
Cells environment (entropy, RNA, re1-2-3) lives inside cellsTab
RNA becomes useless around 1000

=- SLAMO DNA -=

Slamo DNA upgrades are bought by entropy.
Slamo DNA upgrades work the same way as normal upgrades, living inside the "upgrades" array.
Slamo DNA changes your playstyle into active, passive, or aggressive (most efficient but rng based)
slamo dna upgrades are just repeatables.
slamo dna is meant to be a little side feature, not doing much (3-5x amoeba boost, e5-e12)

# Debugging procedure

1. What exactly is supposed to happen?

2. What actually happens?

3. Where does the behavior first become wrong?
4. What value did I expect?
5. What value did I actually get?
6. console.log() it.
7. Change ONE thing.
8. Test again.

Current progression target:
e0 → e20 Amoeba = early game

# Architecture

The project is divided into three major responsibilities.

## State

`state.js`

Stores the current game state.

Examples:

- Amoeba
- Click power
- Upgrade levels
- Automator state
- Slamo clicks

State should contain values that represent the current game.

It should NOT contain values that can simply be calculated from
other state values.

## Logic

`logic.js`

Calculates derived values and performs game mechanics.

Examples:

- getClickPower()
- getSynergyMultiplier()
- getCritChance()
- getClickCooldown()
- getSlamoBoost()

Functions in logic should generally calculate values and return them
rather than permanently modifying those values.

## Rendering

`render.js`

Updates the HTML/UI.

Examples:

- renderStats()
- renderUpgrade()
- renderButtonText()
- renderSlamo()

# Important Design Rules

## Derived values

Do not permanently store values that can be calculated from state.

Example:

Bad:
state.clickPower \*= 2

Preferred:
getClickPower()

`getClickPower()` recalculates click power from the current upgrade
levels. This prevents upgrades from being accidentally applied multiple
times every time the function is called.

# Upgrades

Upgrades are stored as objects in `upgrades.js`.

An upgrade may contain:

- id
- name
- level
- maxLevel
- cost
- costCurrency
- effect
- effectCurrency
- effectFormula
- etc.

Not every upgrade needs every property.

Some upgrades have special behavior that is handled by logic
functions instead of forcing everything into the upgrade data.

## Special upgrade interactions

Some upgrades modify existing mechanics rather than directly providing
a simple multiplier.

Example:

U3 — Synergy
Calculates a multiplier based on current Amoeba.

U7 — Synergism
Modifies the formula used by U3.

These interactions are handled by the relevant logic functions rather
than adding large numbers of special properties to the upgrade object.
