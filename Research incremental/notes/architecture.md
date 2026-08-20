
# Systems

## Clicking

Player clicks → calculate click power → add Amoeba → render

## Upgrades

Upgrade button → check requirements → increase level → update UI

## Synergy

Amoeba → Check if u3, u7, or u18 bought → Amoeba multiplier depending on upgrade
RNA -> Give flat clickPower multiplier based on RNA

## Crits

Click → check if critII occured |crit chance → crit effect → production
                                v 
                                True: Automatically crit, x2 clickMult
## Automator

Timer → automatic click → production
Timer -> Slamo autoclick (0.1x efficiency) -> production

## Slamo

Slamo clicks → milestones → boosts
Future: Slamo DNA
DNA -> Modifiers that change the way you play slamo.
You can gain 1 DNA/s


# Design Notes

## Why calculated stats aren't permanently stored

Stats such as click power can depend on many upgrades. Recalculating
them from the current state prevents accidental compounding.

## Why some upgrade effects are handled by logic

Not every upgrade is a simple multiplier. Some upgrades modify existing
formulas or mechanics.

These are handled by dedicated functions instead of forcing every
possible behavior into the upgrade object.

## Balance philosophy

Early game target:
e0–e9 Amoeba.

Normal upgrades become less common after the early game, with globals,
reset mechanics, Cells, and other progression systems becoming more
important.
