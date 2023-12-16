import Decimal, { DecimalSource } from "break_eternity.js";
import { ComputedRef, capitalize, computed } from "vue";
import { player } from "./playerControl";
import { randfloat, randfloatWithFactor, randint, randintWithFactor } from "../util/helpers";
import { modifierStrength, realmNameData, stdModifierPowers } from "../data/realmData";

export type RealmModifierType = "Experienced" | "Trophiless" | "Overexposed" | "Superranked" | "Shellshocked";

export const realmModifierTypes: Record<number, RealmModifierType[]> = {
    0: ["Experienced", "Trophiless", "Overexposed", "Superranked", "Shellshocked"]
};
const rmtKS = Object.keys(realmModifierTypes);

export const unlockedRealmModifierTypes = computed(() => {
    const ret: RealmModifierType[] = [];

    for (var i=0; i<rmtKS.length; i++) {
        const k = rmtKS[i];

        const n = Number(k);

        if (Decimal.lt(player.realms.number, n)) break;

        realmModifierTypes[n].forEach(t => {
            ret.push(t);
        })
    }

    return ret;
});

export interface RealmModifier {
    name: RealmModifierType,
    power: DecimalSource
}

export interface RealmData {
    name: string,
    goal: DecimalSource,
    modifiers: RealmModifier[]
}

export interface RealmShopData {
    realm: RealmData,
    cost: DecimalSource
}


export interface RealmPlayerData {
    number: number,
    staticEnergy: DecimalSource,
    shards: DecimalSource,
    realmIndex: number,
    realmOptions: RealmShopData[]
}

export function initRealmPlayerData(): RealmPlayerData {
    return {
        number: 0,
        staticEnergy: 0,
        shards: 0,
        realmIndex: 0,
        realmOptions: [{
            cost: 0,
            realm: {
                name: "The Empty",
                goal: 100,
                modifiers: []
            }
        }]
    }
}

export const realmGoal = computed(() => player.realms.realmOptions[player.realms.realmIndex].realm.goal);

const realmModifiers = computed(() => {
    const ret = {} as Record<RealmModifierType, DecimalSource | undefined>;

    player.realms.realmOptions[player.realms.realmIndex].realm.modifiers.forEach(mod => {
        ret[mod.name] = mod.power;
    });

    return ret;
});

export function getRealmModifierPower(name: RealmModifierType) {
    return realmModifiers.value[name] ?? Decimal.dOne;
}

export const realmEnergy = computed(() => {
    const standardEnergy = Object.values(player.bestiary).reduce((a,c) => Decimal.add(a, Decimal.add(c, 1).log10()), Decimal.dOne);
    const sacEnergy = Object.values(player.trophySac).reduce((a,c) => Decimal.add(a, Decimal.add(c, 1).log10()), Decimal.dOne);
    return Decimal.mul(standardEnergy, sacEnergy).plus(player.realms.staticEnergy).sub(1).max(0);
});

export function realmForceReset() {
    player.xp = 0;
    player.damageTaken = 0;
    player.stage = 1;
    player.bestStage = 1;
    player.damageDealt = 0;
    player.enemiesDefeated = 0;
    player.attackCooldown = 0;
    player.enemyAttackCooldown = 0;
    player.enemyAttacks = 0;
    player.playerAttacks = 0;
    player.bestiary = {};
    player.bestiaryChosen = {};
    player.bestiaryGenUpgs = {};
    player.trophySac = {};
    player.trophySacDisabled = {};
    player.realms.shards = 0;
}

export function enterRealm(index: number, next: boolean) {
    const shopData = next ? realmsAvailable.value[index] : player.realms.realmOptions[index];

    if (Decimal.lt(realmEnergy.value, shopData.cost) || (next && Decimal.lte(player.bestStage, realmGoal.value))) return;

    player.realms.realmIndex = index;
    if (next) {
        player.realms.realmOptions = realmsAvailable.value;
        player.realms.number++;
    }
    player.realms.staticEnergy = Decimal.max(player.realms.staticEnergy, shopData.cost);

    realmForceReset();
}

const realmSeed = computed(() => randint(player.realms.number));
export const realmRNGInt = (a: number) => randintWithFactor(realmSeed.value, randint(a), 0x80000000);
export const realmRNG = (a: number) => randfloatWithFactor(realmSeed.value, randint(a), 0x80000000);

export const numRealmsAvailable = computed(() => Math.round(realmRNG(0) * (1 + (Decimal.gte(player.realms.number, 1) ? 1 : 0))) + 2);

export const meanRealmCost = computed(() => Decimal.pow(1.2, player.realms.number).times(Decimal.add(player.realms.number, 1)).times(50000));
export const realmCostDevianceFactor = computed(() => Decimal.mul(0.05, player.realms.number).plus(1.5));

export function genRealmName(seed: number): string {
    seed = randint(seed);

    var syllables = Math.round(randfloat(seed++) * 2) + 1;
    var word = "";

    seed = randint(seed);

    for (var i=0; i<syllables; i++) {
        word += realmNameData.outer[Math.floor(randfloat(seed++) * realmNameData.outer.length)];
        if (randfloat(seed++) >= 0.4) word += realmNameData.inner[Math.floor(randfloat(seed++) * realmNameData.inner.length)];
        word += realmNameData.vowel[Math.floor(randfloat(seed++) * realmNameData.vowel.length)];
        if (randfloat(seed++) >= 0.4) word += realmNameData.inner[Math.floor(randfloat(seed++) * realmNameData.inner.length)];
        word += realmNameData.outer[Math.floor(randfloat(seed++) * realmNameData.outer.length)];

        seed = randint(seed);
    }

    return capitalize(word);
}

export const realmsAvailable: ComputedRef<RealmShopData[]> = computed(() => {
    const avail: RealmShopData[] = [];
    var rngID = 1;

    for (var i=0; i<numRealmsAvailable.value; i++) {
        const name = genRealmName(realmRNGInt(rngID++));
        const modifierCount = Math.round(realmRNG(rngID++)) + 1;

        const modifiers: RealmModifier[] = [];

        for (var j=0; j<modifierCount; j++) {
            const name = unlockedRealmModifierTypes.value[Math.floor(realmRNG(rngID++) * unlockedRealmModifierTypes.value.length)];
            const power = Decimal.sub(stdModifierPowers[name], 1).times(realmRNG(rngID++)).plus(0.5);
            modifiers.push({name, power});
        }

        const totalStrength = modifiers.reduce((a,c) => Decimal.mul(a, modifierStrength(c)), Decimal.dOne);
        const goal = Decimal.div(55, totalStrength).plus(50).times(Decimal.pow(1.1, player.realms.number)).floor();

        avail.push({
            realm: {
                name,
                goal,
                modifiers
            },
            cost: Decimal.mul(meanRealmCost.value, Decimal.pow(realmCostDevianceFactor.value, Decimal.add(realmRNG(rngID++) - 0.5, Decimal.log2(totalStrength))))
        });
    };
    return avail;
});

export const realmShardGain = computed(() => Decimal.div(player.realms.staticEnergy, 1e6));

export const realmShardEff = computed(() => Decimal.div(player.realms.shards, 10).plus(1).cbrt());