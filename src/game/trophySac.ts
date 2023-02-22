import Decimal from "break_eternity.js";
import { computed } from "vue";
import { fromEnemyData } from "../data/enemyData";
import { player } from "./playerControl";
import { resetStage } from "./stage";

export function trophySacUnl(id: number) {
    return Decimal.gte(player.bestStage, 50 + Math.pow(Number(id), 2));
}

export function trophySacReq(id: number) {
    return fromEnemyData(id, "sacReq") ?? new Decimal(5e5);
}

export const trophySacRatio = computed(() => 0.5);

export function canTrophySac(id: number) {
    return trophySacUnl(id) && player.bestiary[id] !== undefined && Decimal.gte(player.bestiary[id], trophySacReq(id));
}

export function trophySac(id: number) {
    if (!canTrophySac(id)) return;

    player.trophySac[id] = Decimal.mul(trophySacRatio.value, Decimal.div(player.bestiary[id], 2)).plus(player.trophySac[id] ?? 0);
    player.bestiary[id] = Decimal.div(player.bestiary[id], 2);

    resetStage();
}