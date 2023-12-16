import Decimal, { DecimalSource } from "break_eternity.js";
import { RealmModifier, RealmModifierType } from "../game/realms";
import { format } from "../game/format";

export const realmNameData = {
    outer: ["p", "t", "k", "b", "d", "g", "f", "th", "s", "v", "z", "m", "n"],
    inner: ["l", "r"],
    vowel: ["a", "e", "i", "o", "u"]
};

export function modifierDesc(modifier: RealmModifier): string {
    switch(modifier.name) {
        case "Trophiless":
            return "Divide Trophy gain from all sources by " + format(modifier.power);
        case "Experienced":
            return "Multiply XP gain by " + format(modifier.power) + ", but increase the Level requirement exponent by " + format(Decimal.sub(modifier.power, 1));
        case "Overexposed":
            return "Enemies with the \"Mutator\" ability have their HP & DMG multiplied by " + format(modifier.power);
        case "Superranked":
            return "Increase all enemy ranks by " + format(Decimal.sub(modifier.power, 1));
        case "Shellshocked":
            return "Divide player SPD by " + format(modifier.power) + " & multiply enemy SPD by " + format(modifier.power)
    }
}

export function modifierStrength(modifier: RealmModifier): Decimal {
    switch(modifier.name) {
        case "Trophiless":
            return Decimal.sqrt(modifier.power);
        case "Experienced":
            return Decimal.pow(1e3, Decimal.sub(modifier.power, 1));
        case "Overexposed":
            return Decimal.sub(modifier.power, 1).div(2.5).plus(1);
        case "Superranked":
            return Decimal.pow(2.5, Decimal.sub(modifier.power, 1));
        case "Shellshocked":
            return new Decimal(modifier.power)
    }
}

export const stdModifierPowers: Record<RealmModifierType, DecimalSource> = {
    "Trophiless": 4,
    "Experienced": 1.1,
    "Overexposed": 3.5,
    "Superranked": 1.75,
    "Shellshocked": 2
}