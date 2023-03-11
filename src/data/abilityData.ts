interface AbilityData {
    name: string,
    desc: string
}

export const ABILITY_DATA: Record<string, AbilityData> = {
    "heal": {
        name: "Heal",
        desc: "Heals enemy by DMG dealt whenever this enemy attacks."
    },
    "weaken": {
        name: "Weaken",
        desc: "Weakens the player's DMG based on player HP (lower HP -> weakened more)."
    },
    "stun": {
        name: "Stun",
        desc: "Has a chance to slightly delay player attacks (effectively halving player SPD on average)."
    },
    "agile": {
        name: "Agile",
        desc: "Skips enemy attack cooldown based on enemy HP (lower HP -> higher effective SPD, up to 3x)."
    },
    "mutator": {
        name: "Mutator",
        desc: "Enemy is immune to HP/DMG/SPD reductions."
    },
    "shield": {
        name: "Shield",
        desc: "Player attacks that deal less than 10% of the enemy's total HP do nothing (unless they are critical hits)."
    },
    "counter": {
        name: "Counter",
        desc: "Enemy has a 40% chance to counterattack the player when attacked."
    },
    "strengthen": {
        name: "Strengthen",
        desc: "Strengthens the enemy's DMG based on enemy HP (lower HP -> strengthened more)."
    },
    "extremist": {
        name: "Extremist",
        desc: "Blocks X% of damage taken. X starts at 100, but decreases by 4 every time this enemy attacks."
    },
    "neutrality": {
        name: "Neutrality",
        desc: "Blocks X% of damage taken. X starts at 0, but increases by 4 every time this enemy attacks."
    },
    "regenerator": {
        name: "Regenerator",
        desc: "Heals enemy by 0.5% of their total HP every second."
    },
    "charm": {
        name: "Charm",
        desc: "Player SPD is slightly reduced every time this enemy attacks."
    },
    "reductive": {
        name: "Reductive",
        desc: "Divides player HP & DMG by X. X starts at 1, but increases by a millionth every time the player attacks."
    }
}