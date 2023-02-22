import Decimal, { DecimalSource } from "break_eternity.js";
import { computed } from "vue";
import { ENEMY_DATA, fromEnemyData } from "../data/enemyData";
import { objectMapK } from "../util/helpers";
import { player } from "./playerControl";
import { resetStage } from "./stage";
import { trophySacUnl } from "./trophySac";

export type StackType = "add" | "mult" | "multAfter1";

function bestStageLimitSC(n: DecimalSource): Decimal {
    if (Decimal.lte(n, 25)) return new Decimal(n);
	return Decimal.pow(n, 0.75).times(Math.sqrt(5));
}

export const bestiaryLimit = computed(() => bestStageLimitSC(player.bestStage).div(5).root(1.1).plus(1).floor().min(Object.keys(ENEMY_DATA).length).toNumber());
export const bestiaryChosen = computed(() => Object.values(player.bestiaryChosen).filter(x => x).length);

export const trophyEffects = computed(() => objectMapK(ENEMY_DATA, e => {
        return fromEnemyData(Number(e), "trophyEff")?.(new Decimal(player.bestiaryChosen[Number(e)] ? (player.bestiary[Number(e)] ?? 0) : 0))
            ?? Decimal.dZero
        }
    ));
export const trophySacEffects = computed(() => objectMapK(ENEMY_DATA, e => {
        return fromEnemyData(Number(e), "sacEff")?.(new Decimal(trophySacUnl(Number(e)) && !player.trophySacDisabled[Number(e)] ? (player.trophySac[Number(e)] ?? 0) : 0)) 
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
    if (b == 0) return fromEnemyData(id, "trophyEff")?.(new Decimal(player.bestiary[id]||0)) ?? Decimal.dZero;
    if (b == 1) return fromEnemyData(id, "sacEff")?.(new Decimal(player.trophySac[id]||0)) ?? Decimal.dZero;
    if (b == 3) return trophyEffects.value[id.toString()];
    if (b == 4) return trophySacEffects.value[id.toString()];

    return fuseEffects(trophyEffects.value[id.toString()], trophySacEffects.value[id.toString()], fromEnemyData(id, "stackType") ?? "mult");
};

export function getTrophyGenUpgCost(id: number) {
    return Decimal.pow(id+6, player.bestiaryGenUpgs[id]||0);
}

export function getTrophyGen(id: number) {
    if (Decimal.lte(player.bestiaryGenUpgs[id]||0, 0)) return 0;
    return Decimal.pow(id+6, Decimal.sub(player.bestiaryGenUpgs[id]||0, 1)).div(2.5).max(player.bestiaryGenUpgs[id]||0).max(0);
}

export function buyTrophyGenUpg(id: number) {
    if (player.bestiary[id]===undefined) return;
    let cost = getTrophyGenUpgCost(id);
    if (Decimal.lt(player.bestiary[id+6]||0, cost)) return;
    player.bestiary[id+6] = Decimal.sub(player.bestiary[id+6] ?? 0, cost);
    player.bestiaryGenUpgs[id] = Decimal.add(player.bestiaryGenUpgs[id]||0, 1);
}