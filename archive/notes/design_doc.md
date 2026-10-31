# design_doc.md

Status: Up to date (as of Oct 28)
Research Incremental: Revamped

Changelog
v0.1 - start

- added g1, u1-u6

v0.1.1 - planning

- didn’t add upgrades
- instead, planned for cells/research

v0.2 - breakthrough

- planned breakthrough, some challenges
- very wip; might be overpowered

v0.3 - changes

- planning breakthrough again,
- created skill tree, balanced time a bit

v0.4 - mutations

- added slamo DNA feature
- adjusted early game rates

v0.5 - farewell apple notes

- switching to google docs
- making a game documentation tab in there

Slow-paced, limit = e308, no offline progress, active play, 6-9 hours playtime needed to beat, WIP

Key features:
Start - Cells (0-1e9)
Unlocks key mechanics such as clicking, critical hits, cells as the first mechanic. You can select a node and upgrade it via a tree (size, efficiency). Size is for active play, while efficiency is for idling. You can respec the tree at a cost of 24h

Cells - Research (1e9-1e63)
Research is gained by resetting your cells, at e13 amoeba. Cells and their upgrades will now scale up quicker, but in return for extreme efficiency, lessened softcap on cell scaling

Research -> Breakthroughs (1e63-1e130)

time: 1-1.5h
Breakthroughs are gained when you have 1e63 amoeba. It allows you to invest in a skill tree with extremely powerful upgrades (respec/12h), and unlocks Challenges

Challenges: C1 (e80) C2, (e110)

Breakthroughs -> Singularity (1e130- 1e308)
Your automators evolved, growing so rapidly it exceeds infinity..

Your automators created a new AI, This will be the main feature throughout the Singularity. Your goal is to feed it data and compute, while it can grant features and automation.

Be careful.

You gain 1e308 amoeba…

Singularity -> Automator Trials (0 RP - e10 RP)
Intended time: 30-45m
RT 5 is endgame.

e308, the rift. You gain infinity energy every second. You can get tiers by harvesting some rift power. Buy upgrades, get new rift tiers.

Automator trials

Do a 2-minute trial, collecting rift power, Get as much as you can, when the timer ends, rift power gets converted into tokens which you can spend on permanent upgrades to make your future rift power run stronger. There are modifiers that you can choose to change the run a bit

I am planning, at the end of automator trials to add like an extremely large boost and watch your number go up before the end of the game (1e308 rp) the actual endgame is like e10-12 rp

Time map

5m -> clicking, not much activity going on sikce it is the start of the game. most upgrades give a little boost (1.2-2x).

10m -> critical hits are the main driver of getting amoeba, upgrades increase chance and a little boost is applied to crits

15m -> starting to get near the cells reset, upgrades are scaling faster yet effects are more powerful. e6-e9

25m -> cells, unlocks some new upgrades upon reset for around e15-25 amoeba

40m -> recovering from cells, size upgraded 1-4 times. starting to get near research, upgrades are now mostly based on cells synergy

1h -> Research layer unlocked recovering and pushing more, DT1

1.5h -> Progressing in research, around DT2-3 and resources are exploding, amoeba softcap is scaling more though.

2-4h -> Breakthrough, anywhere to first breakthrough to C2

3-5h -> undecided..

First few unlocks: critical hits -> cells -> global upgrade 2 (which automates clicks)

Automation appears at e40 amoeba, automating small upgrades such as U1-U5 using automation power, it generates passively

The player wants to reset for research since cells get softcapped around e9 amoeba, it is basically impossible to progress.

The game will probably feel like a bit slow, getting to e3-4, after that progress will speed up a bit with more upgrades with powerful effects.

cells

This resets amoeba

Size gives you a multiplier and a formula that gets boosted based on some currencies. The multiplier can be gained by compleying minigames every 20 minutes to stop overgrowth of size

Efficiency gives you a “worse” formula, you do not need to play a minigame, it is intended for idle play

You can edit a cell (there is only one) by clicking on it. There is a skill tree of

Size Efficiency
x2 x2
x2 x2
x2 x2
x2 x2

With every upgrade you buy, it increases the cost of all other upgrades in the tree. Whenever you buy a later upgrade in the “size” tree, the minigame’s difficulty gets harder

Only one Cell exists.
The player clicks the Cell to edit its skill tree.
Size = stronger, active-play route.
Efficiency = weaker, idle route.
Size requires a minigame every 20 minutes.
Higher Size upgrades increase minigame difficulty.
Buying an upgrade increases the cost of the other tree upgrades.
The Cell produces Entropy.
Entropy provides an Amoeba multiplier.
Rough target: 100 Entropy → 1.4× Amoeba.
Exact Entropy formula is undecided

wait hold on, i think im onto something

maybe instead of like 10 actual upgrades in the cells layer, i add like a few infinitely repeatable ipgrades

like this:
DNA mutation
+0.2 base RNA production per level
Evolved cells
x1.1 cell strength
entropic cheapener
/1.001 repeatable cost per repeatable upgrade, added x1.2 entropy per upgrade

its like addition -> multiplication -> probably exponentiation

also the upgrades are a bit weird, this is just a prototype i thought of in like a minute, i will think about them more thouroughly next session

To be honest, i might scrap the cells and size + efficiency, the size and efficiency upgrades sound good but the cells layer is too short for like 10 upgtades. I will only have the cell most likely and the repeatables will add more cell power

Why would I buy another level of this?”

It increases growth of amoeba + entropy, if you do not buy it you will be basically capped at e11-e12 entropy

“What prevents one repeatable from becoming obviously superior?”

All upgrades scale accordingly to their effect. There might be like a tier system that resets these upgrades for boosts

“What does entropy actually mean in the Cells layer?”

It is a currency that cells generate automatically. It provides multiplier to clickPower based on entropy, it can have more uses later, but for now the clickPower boost is the only use

“How do DNA choices change the optimal strategy?”

DNA adjusts what currencies are for you to aim for and what to not really. If you choose aggressiveness, the tide shifts from a currency -> critPower

“If I have infinite levels, what prevents the numbers from exploding too quickly?”

A softcap past level 50, extreme scaling at level 250 and a hardcap at level 1000 that cannot be changed. Numbers may vary

Research

Entropy, cells, amoeba gets reset upon research

Note there are no research points, just debuffs and milestones.

Research is a reset layer that changes the game by reducing the severity of the amoeba softcap, in exchange for harsher cell upgrades. Upon your first research, you gain some new upgrades (R1-R5) which cost e20-30 amoeba.

R1 -> Crit upgrades boosted to be more powerful,
R2 -> Click cooldown increased by x3, in return entropy and amoeba are increased both by x1.66 and g1 gets a cap of 40 instead of 33
R3 -> Cell upgrades +0.05 effectiveness (2x -> 2.05x)
R4 -> Minigames’ boosts are increased (bad: 0.9x, good: 1.1x, amazing: 1.4x) -> increase boost by +0.2

R5 -> Cheapen cell upgrades by a formula based on entropy (undecided)

Every e5 amoeba after e20, reset and you gain reduced amoeba softcap. These are called discovery tiers.

Reqs:
e20
e25
e33
e39
e49
e56

DT 1 -> x3 amoeba, more cell upgrades
DT 2 -> R1 + R2 unlocked
DT 3 -> G1 effect +0.01 (/1.05 -> 1.06)

DT 4+ -> undecided

Breakthroughs

This layer is designed to last around 45m-1 hour. It resets amoeba and amoeba upgrades only

Breakthrough points are gained when you have 1e63 amoeba. It allows you to invest in a skill tree with powerful upgrades (no respeccing, this can easily be earned in 1 session), and unlocks Challenges

Challenges: C1 (e80) C2, (e110)
All challenges perform a breakthrough reset for no BP

C1: primitive
0.5 amoeba exponent, cells just gives a flat multiplier to amoba based on the cell ipgrades you have (3 cell upgrades -> x1.7 amoeba as an example)

Goal: undecided
Reward; unlocks G3, -15% crit chance, +0.025 amoeba exponent

C2: expensiver
You have e100 amoeba. Each upgrade you buy divides your current amoeba by /1M, gaining amoeba is forbidden until you buy all of the upgrades you can afford.

Reward; all upgrades cheapened by /1.05 every time you buy a unique upgrade (repeatables only count once for the first upgrade)
Goal: \_\_\_\_

Skill Tree
6 upgrades, with nerfs, buffs.
ALL UPGRADES ARE OPTIONAL

B1 - QoL
Keep /1e55 of amoeba on breakthrough (capped at e10), /5 amoeba
Ex. Reset, e63 amoeba -> e7 amoeba
e100 amoeba -> e10 amoeba (capped)
Cost: 100 BP

B2 - the singularity is near
automation power x100, the automator’s click effectiveness multiplied by this formula:
Debuff: Cell and amoeba softcap increased by a certain amount
Cost: 250 BP

sqrt(log(AP))
log(10000) ‎ = 4
sqrt(4) ‎ = 2

log(10,000,000,000) ‎ = 10
sqrt(10) ‎ = 3.162

B3 - Automation-synergy
Automator clicks have a chance to crit, but it is lowered.
Cost: 1,000 BP

UPGRADES WITHOUT DEBUFFS

B5 - wait..
if you click after 3 seconds (1.5s normally), crit chance is multiplied by 2
cost: 100 BP

B6 - generic upgrade
x3 cell efficiency
Cost: 250 BP

The Singularity

1-1.5h needed

You have an excess of amoeba.
Resets entire game below, -0.1 amoeba exponent but gain the knowledge of AI.

Singularity:

- e100–e308 needs additional content
- Consider meta-upgrades
- Meta-upgrades modify repeatable upgrade behavior/scaling
- Should feel different from normal multipliers

AI
Compute upgrade: 10,000 BP (breakthrough points)
x1.4 compute/upgrade
Formula: 10000^(1 + (level \* 0.05))
AI can unlock more automations, upgrades.

Organize your compute into diffrrent sectors (Processing, data, energy)
You have to manage all your different sectors; if you invest in one, the other lacks.

The AI can automate tasks if it has enough compute, but it has less safety and uses more power.

Randomly, the AI does something unexpected (changes its own code, talks to itself). You need to solve a puzzle/minigame to regain control. In return, the AI learns and optimizes its code, giving a small cheapener to Compute upgrades (/1.1)

There are infinitely repeatable upgrades. They are:

Compute, Energy, data. Data has a softcap at around 1e15

Once it has enough compute (e33) AI starts rapidly growing and exponentially changing its internals, lessening softcaps, mixmaxing amoeba,… Be extremely alert in these few minutes, the AI is bound to make huge errors.

!!! SINGULARITY MET !!!

e308 amoeba reached
Automator Trials

The AI and Automator went rogue from the singularity, humans tried to stop but it was too late..

The AI is only going to let you go if:
You do their trial and collect rift energy from the earth’s core. it is dangerous for them since they cannot connect to a server deep underground

Automator Trials

Do a 2-minute trial, collecting rift power, Get as much as you can, when the timer ends, rift power gets converted into tokens which you can spend on permanent upgrades to make your future rift power run stronger. There are modifiers that you can choose to change the run a bit

At the end of automator trials, there is an extremely large boost and watch your number go up before the end of the game (1e308 rp) the actual endgame is like e10-12 rp

e308, the rift. You gain infinity energy every second. Trial upgrades can increase infinity energu. You can get tiers by harvesting some rift power.

RT 1 - unfinished
RT 2 - unfinished
RT 3 - unfinished

Find loopholes

“What happens if I maximize Size?”
The game becomes active-focused, a few minutes of active play can become extremely efficient with a size-focused build

“What happens if I maximize Efficiency?”
The game becomes extremely idle-focused, leaving your computer on for 30-40 minutes without anything can grant major progress

“What happens if I take every automation upgrade?”
The game will be almost entirely automated, with you only having to buy upgrades/reset

“What happens if I deliberately take every debuff?”
The game will be powerful in one aspect but lack in another.

“Can a player make a build that is objectively better than every other build?”
Yes, a player theoretically can, if they can calculate all the math.

“Can an upgrade accidentally multiply itself?”
I don’t know what that means, but i guess you are saying like the upgrade cap can be multiplied? If so, no.

“Can a reset be exploited to gain more resources than intended?”

cells -> 1 node, no
research -> I don’t know, the upgrades are 1-time use but an upgrade might be overpowered
breakthrough -> checked, No. It has optional upgrades, none of which are multi-use.

singularity -> I FOUND IT!

“In return, the AI learns and optimizes its code, giving a small cheapener to Compute upgrades (/1.1)”

It can be abused to get infinite compute upgrades if waiting long enough.

end -> unfinished, checking later

Upgrades

Clicks have a cooldown of 0.5 seconds.
Amoeba: 0

G1 - Global upgrade (1/33)
/1.05 click cooldown
formula: (1.3^level) \* 100

G2 - the automator (1/50)
First upgrade automatically clicks every 10 seconds. All other automator upgrades give a -0.025s boost to the automator’s time
formula: (10^(level + 1)) \* 1e38
floor: 1s

G3 (unlocked from C1) (1/10)
crit effectiveness +33% per upgrade, +0.15 click cooldown (10s -> 10.15s)
formula: log10(level^7) + 1 BP

log(1) = 1 BP
log(2^7) =2.69 BP
log(3^7)=4.34 BP

Old ideas, can repurpose them later

C2: Simple
-1% amoeba/second
50 seconds -> 50%
99 seconds -> 1%
100 seconds -> Challenge instantly terminates

## Upgrades

Status: Up to date (as of Oct 28)

RI:R Upgrades

Upgrades

Clicks have a cooldown of 0.5 seconds.
Amoeba: 0

G1 - Global upgrade (1/33)
/1.025 click cooldown
formula: (1.45^level) \* 100

G2 - the automator (1/50)
First upgrade automatically clicks every 10 seconds. All other automator upgrades give a -0.025s boost to the automator’s time
formula: (5^(level + 1)) \* 1e6
floor: 1s

G3 (unlocked from C1) (1/10)
crit effectiveness +33% per upgrade, +0.15 click cooldown (10s -> 10.15s)
formula: log10(level^7) + 1 BP

log(1) = 1 BP
log(49) =2.69 BP
log(2,187)=4.34 BP

main upgs

U1 - The start
x2 amoeba, nothing crazy
cost: 10a

U2 - Repeatable (0/5)
x1.25a per upgrade
Formula: (levels^2) \* 6, cost: 6a

U3 - synergy
Amoeba boosts itself
Boost formula: x(log100(1 + amoeba^0.5)), cost: 30

U4 - critical (0/10)
Amoeba can “replicate” giving x2 every few clicks! Every upgrade boosts the chance by 3% :)
Formula: (level^1.2)\* 50

U5 - cellular growth
x3 amoeba
Cost: 400

U6 - Experiments [optional]

+125% crit effectiveness, G1’s cost scaled from (1.3^level) _ 100 -> (1.35^level) _ 100
Cost: 500

U7 - Synergism
U3’s formula, x(log100(1 + amoeba^0.5)), changed to x(log70(1 + amoeba^0.6)),
cost: 2000

U8!- Repeatable II (0/5)
click cooldown increased by +5% crit effectiveness +6.66%
cost: 1200 formula: (1.33^level) \* 1200

U9 - crit ii
every 10 clicks, you are guaranteed to have a crit + crit effectiveness x2 for 1 click
cost: 2500

U10 - the cube
unlock slamo, click him for milestones and a small boost on amoeba [cooldown: 3s]
cost: 5000

=- Milestones -=
10 clicks
+1% clickPower every click. hardcap at 250
—————
25 clicks
+2 max upgrades to U2
—————
100 clicks
-0.25s click cooldown (floor: 0.25s)
—————-

U11 - slamo will like this (0/2)
+1 cube click/click (+1 -> +2)

formula: level/0.5 \* 30000

U12 - G1’s effect formula 1.05x -> 1.065x
cost: 50,000

U13 - Riskgrade [optional]
Buff:
Slamo’s milestone 1 cap deleted, now there is a softcap at 750 clicks. Hardcap at 1250 clicks

Debuff:
U9 (crit ii)’s effect from 10 clicks -> 50 clicks
amoeba /3

Cost: 125,000

U14 - basic (0/3)
x1.2 amoeba
Cost: 100 slamo clicks
Formula: (level ^ 1.35) \* 150000

U15 - Loan
/1.5 slamo click power, M1 softcap power decreased by -0.05

In return, get 200,000 amoeba

U16 - exponential
added multiplier to U2’s effect formula based on current amoeba
multi: log(amoeba) / 100

log(1m amoeba) = 6
6 / 100 ‎ = 0.06

U2: 1.25x + 0.06 -> 1.31x
cost: 6,000,000

mutually exclusive - U17

!! <- CHOOSE WISELY -> !!

U17a - Automation-idle based
Slamo autoclicks itself, the automator can crit every few clicks, and automator clicks +50% effectiveness

Both cost 15,000,000 amoeba

U17b - Active/manual focused
the automator gets -33% effectiveness, every time you do a crit, it automatically clicks slamo
x1.5 amoeba

U18 - calm before the storm
U7’s formula, x(log70(1 + amoeba^0.6)), buffed to

x(log40(1 + amoeba^0.70)),

Cost: 50,000,000

U19 - Cell development
The Amoeba are forming cells…
x2 amoeba

Cost: 1e9 amoeba

U20 - FINALLY
Unlock cells, they cost e9 amoeba, Your amoeba gets reset upon unlocking them

=- End of Main Upgrades -=
Look in the “Cells” tab…

RE1 - addition
cost: 100 entropy
level: 0/1000
+20% entropy gain..
formula: q

RE2 - multiplication
cost: 1750 entropy + 20 RNA
level: 0/150
+50% RE1 effect

RE3 - scaler :)
cost: 5000 entropy, 1e12 amoeba
level: 0/25
-0.25 cost scaling formula for RE1
-0.1 cost scaling formula for RE2
+0.1 multiplication effect (+50% -> +51%)

new feature - U20

Amoeba
Click cooldown
Click power
Crit chance
Crit effectiveness
Automator interval
Cell Size
Cell Efficiency
Entropy
Cell upgrade cost
Research softcap
...

Ideas i scrapped for now, csn repurpose them later

U16 - Blast
This upgrade gives an incentive to click slamo even if they reached the cap

Every 10th slamo click, you can get amoeba that is +1000% of clickPower
