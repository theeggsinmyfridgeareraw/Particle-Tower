import Decimal, { DecimalSource } from "break_eternity.js";
import { computed } from "vue";
import { ENEMY_DATA, fromEnemyData } from "../data/enemyData";
import { objectMapK } from "../util/helpers";
import { player } from "./playerControl";
import { resetStage } from "./stage";
import { trophySacUnl } from "./trophySac";
import { enemyData } from "./enemy";
import { getRealmModifierPower } from "./realms";

export type StackType = "add" | "mult" | "multAfter1";

function bestStageLimitSC(n: DecimalSource): Decimal {
    if (Decimal.lte(n, 25)) return new Decimal(n);
	return Decimal.pow(n, 0.75).times(Math.sqrt(5));
}
function invBestStageLimitSC(n: Decimal): Decimal {
    if (Decimal.lte(n, 25)) return n;
    return Decimal.div(n, Math.sqrt(5)).root(.75);
}

export const bestiaryLimit = computed(() => bestStageLimitSC(player.bestStage).div(5).root(1.1).plus(1).floor().min(Object.keys(ENEMY_DATA).length).toNumber());
export const nextBestiaryLimit = computed(() => invBestStageLimitSC(Decimal.pow(bestiaryLimit.value, 1.1).times(5)).ceil());
export const bestiaryChosen = computed(() => Object.values(player.bestiaryChosen).filter(x => x).length);

export const bestiaryAmtMultPreGhost = computed(() => getTrophyEff(24).sub(1).times(player.bestStage).plus(1).max(1));
export const bestiaryAmtDiv = computed(() => enemyData.value.special.includes("drain") ? Decimal.pow(bestiaryChosen.value / 100 + 1, player.enemyAttacks) : Decimal.dOne);

export function modifyBestiaryAmt(amt: DecimalSource, id: number): Decimal {
    const modified = Decimal.div(amt, bestiaryAmtDiv.value);
    return id < 24 ? modified.times(bestiaryAmtMultPreGhost.value) : modified;
}

export const trophyEffects = computed(() => objectMapK(ENEMY_DATA, e => {
        return fromEnemyData(Number(e), "trophyEff")?.(new Decimal(player.bestiaryChosen[Number(e)] ? modifyBestiaryAmt(player.bestiary[Number(e)] ?? 0, Number(e)) : 0))
            ?? Decimal.dZero
        }
    ));
export const trophySacEffects = computed(() => objectMapK(ENEMY_DATA, e => {
        return fromEnemyData(Number(e), "sacEff")?.(new Decimal(trophySacUnl(Number(e)) && !player.trophySacDisabled[Number(e)] ? modifyBestiaryAmt(player.trophySac[Number(e)] ?? 0, Number(e)) : 0)) 
            ?? Decimal.dZero
        }
    ));

export function toggleTrophy(id: number) {
    if ((bestiaryChosen.value < bestiaryLimit.value) || player.bestiaryChosen[id]) {
        player.bestiaryChosen[id] = !player.bestiaryChosen[id]
    }
    resetStage();
}

function fuseEffects(e1: Decimal, e2: Decimal, type: StackType) {
    if (type == "add") return e1.plus(e2);
    if (type == "mult") return e1.times(e2);
    if (type == "multAfter1") return e1.plus(1).times(e2.plus(1)).sub(1);
    return e1;
}

export function getTrophyEff(id: number, b = 2) { 
    if (b == 0) return fromEnemyData(id, "trophyEff")?.(modifyBestiaryAmt(player.bestiary[id]||0, id)) ?? Decimal.dZero;
    if (b == 1) return fromEnemyData(id, "sacEff")?.(modifyBestiaryAmt(player.trophySac[id]||0, id)) ?? Decimal.dZero;
    if (b == 3) return trophyEffects.value?.[id.toString()] ?? fromEnemyData(id, "trophyEff")?.(modifyBestiaryAmt(player.bestiary[id]||0, id)) ?? Decimal.dZero;
    if (b == 4) return trophySacEffects.value[id.toString()] ?? fromEnemyData(id, "sacEff")?.(modifyBestiaryAmt(player.trophySac[id]||0, id)) ?? Decimal.dZero;

    return fuseEffects(trophyEffects.value?.[id.toString()] ?? fromEnemyData(id, "trophyEff")?.(modifyBestiaryAmt(player.bestiary[id]||0, id)) ?? Decimal.dZero, trophySacEffects.value?.[id.toString()] ?? fromEnemyData(id, "sacEff")?.(modifyBestiaryAmt(player.trophySac[id]||0, id)) ?? Decimal.dZero, fromEnemyData(id, "stackType") ?? "mult");
};

export function getTrophyGenUpgCost(id: number) {
    return Decimal.pow(id+6, player.bestiaryGenUpgs[id]||0);
}

export function getTrophyGen(id: number) {
    if (Decimal.lte(player.bestiaryGenUpgs[id]||0, 0)) return 0;
    return Decimal.pow(id+6, Decimal.sub(player.bestiaryGenUpgs[id]||0, 1)).div(2.5).max(player.bestiaryGenUpgs[id]||0).max(0).div(getRealmModifierPower("Trophiless"));
}

export function buyTrophyGenUpg(id: number) {
    if (player.bestiary[id]===undefined) return;
    let cost = getTrophyGenUpgCost(id);
    if (Decimal.lt(player.bestiary[id+6]||0, cost)) return;
    player.bestiary[id+6] = Decimal.sub(player.bestiary[id+6] ?? 0, cost);
    player.bestiaryGenUpgs[id] = Decimal.add(player.bestiaryGenUpgs[id]||0, 1);
}