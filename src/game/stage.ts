import Decimal, { DecimalSource } from "break_eternity.js";
import { computed } from "vue";
import { STAGE_DATA } from "../data/stageData";
import { formatWhole } from "./format";
import { trySeeEnemy } from "./loop";
import { player } from "./playerControl";

export const stageData = computed(() => getStageData(player.stage));
export const enemiesInStage = computed(() => stageData.value.data.length);

export function getStageData(stage: DecimalSource) {
    let totalStages = Object.keys(STAGE_DATA).length;
    let activeStage = Decimal.sub(stage, Decimal.sub(stage, 1).div(totalStages).floor().times(totalStages)).toNumber();

    let data = STAGE_DATA[activeStage.toString()];
    let rank = Decimal.sub(stage, 1).div(totalStages).floor().times(Math.floor(totalStages * 3 / 4))
            .plus(Decimal.sub(stage, 1).sub(totalStages).times(3 / 4).floor().max(0))
            .plus(data[new Decimal(player.enemiesDefeated).toNumber() % data.length][1]);

    let mag = Decimal.pow(2.5, rank.sub(1));
    return {data, rank, mag};   
}

export function prevStage() {
	player.stage = Decimal.sub(player.stage, 1).max(1);
	resetStage();
}

export function nextStage() {
	player.stage = Decimal.add(player.stage, 1).min(player.bestStage);
	resetStage();
}

export function resetStage() {
	player.enemiesDefeated = 0;
	player.damageDealt = 0;
	player.attackCooldown = 0;
	player.damageTaken = 0;
	player.enemyAttackCooldown = 0;
	player.enemyAttacks = 0;
	player.playerAttacks = 0;
	trySeeEnemy();
}

export function getStageName(stage: DecimalSource) {
	const d = new Decimal(stage);
	const totalStages = Object.keys(STAGE_DATA).length;
	const activeStage = d.sub(d.sub(1).div(totalStages).floor().times(totalStages));
	const xFactor = d.sub(1).div(totalStages).floor();

	return formatWhole(activeStage) + (xFactor.gt(0) ? ("X" + (xFactor.gt(1) ? formatWhole(xFactor) : "")) : "");
}