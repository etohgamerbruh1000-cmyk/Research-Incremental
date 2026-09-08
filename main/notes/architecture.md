# RI:R Architecture

## State

player → currencies / progression
slamoData → Slamo stats
milestones -> milestone boosts

## Systems

milestones → boosts to progreession
upgrades → more boosts to progression, except it deletes some currency when purchased
research → Discovery tiers, R1-5 and U20-25

## Important functions

applyMilestoneEffect() → ...
checkMilestone() → ...
renderUpgrade() → ...

## Important conventions

...

## Architecture summary

The game splits tasks into modules.
Logic, rendering, gameloop, hard-coded data, cells,...

# Data structures

Milestones follow this general structure:

M1 Example

```js
  {
    ID: "M1",
    needed: 10,
    description: "+1% click power per click, cap at 250",
    type: "dynamic",
    category: "slamoMilestone",
    stat: "slamoClicks",

    claimed: false,

    effect: {
      array: "state",
      stat: "clickPower",
      type: "multiply",
      cap: 250,
      amount: 0.01,
    },
  },
```
