import Decimal, { DecimalSource } from "break_eternity.js";
import { computed } from "vue";
import { ENEMY_DATA, EveryEnemyData } from "../data/enemyData";
import { player } from "./playerControl";
import { stageData } from "./stage";
import { getTrophyEff } from "./trophies";

export const enemyData = computed(() => ENEMY_DATA[new Decimal(stageData.value.data[
        new Decimal(player.enemiesDefeated).toNumber()%stageData.value.data.length
    ][0]).toNumber()]);

export function fromCurrentEnemyData<K extends keyof EveryEnemyData>(prop: K): EveryEnemyData[K] | undefined {
    const data = enemyData.value as EveryEnemyData;
    return prop in data ? data[prop] : undefined;
}

export const enemyTotalHP = computed(() => adjustEnemyHP(Decimal.mul(enemyData.value.hp, stageData.value.mag)));

export const enemyRealDMG = computed(() => adjustEnemyDMG(Decimal.mul(enemyData.value.dmg, stageData.value.mag)));

export const enemyRealSPD = computed(() => adjustEnemySPD(enemyData.value.spd));

export const enemyBlock = computed(() => {
	let block = 1;

	if (enemyData.value.special.includes("extremist")) block *= 2 - Decimal.div(player.enemyAttacks, 25).min(1).toNumber();
	if (enemyData.value.special.includes("neutrality")) block *= 1 + Decimal.div(player.enemyAttacks, 25).min(1).toNumber();

	return Math.min(block - 1, 1);
})

function adjustEnemyDMG(dmg: DecimalSource) {
	if (enemyData.value.special.includes("strengthen")) {
        dmg = Decimal.mul(dmg, Decimal.div(player.damageDealt, enemyTotalHP.value ?? 1).times(2).plus(1).pow(3));
    }

	if (player.bestiaryChosen[16]) dmg = Decimal.mul(dmg, Decimal.pow(1.1, player.enemyAttacks));

	if (enemyData.value.special.includes("mutator")) return dmg;

	dmg = Decimal.div(dmg, getTrophyEff(4));
	dmg = Decimal.div(dmg, getTrophyEff(16));
	dmg = Decimal.div(dmg, getTrophyEff(6, 4));
	return dmg;
}

function adjustEnemySPD(spd: DecimalSource) {
	if (player.bestiaryChosen[13]) spd = Decimal.mul(spd, 2);

	spd = Decimal.mul(spd, getTrophyEff(6, 4).pow(0.75));

	if (enemyData.value.special.includes("mutator")) return spd;

	spd = Decimal.div(spd, getTrophyEff(6, 3));
	return spd;
}

export function adjustEnemyHP(hp: DecimalSource) {
	if (enemyData.value.special.includes("mutator")) return hp;

	hp = Decimal.div(hp, getTrophyEff(13));
	return hp;
}

export function enemyAtk(bulk: DecimalSource) {
	player.damageTaken = Decimal.add(player.damageTaken, Decimal.mul(enemyRealDMG.value, bulk));
	player.enemyAttackCooldown = 0;
	player.enemyAttacks = Decimal.add(player.enemyAttacks, bulk);
	attemptEnemyHeal(bulk);
}

export function attemptEnemyHeal(bulk: DecimalSource) {
	if (enemyData.value.special.includes("heal") && (Math.random() < (1 - getTrophyEff(11).toNumber()))) {
		player.damageDealt = Decimal.sub(player.damageDealt, Decimal.mul(enemyRealDMG.value, bulk).div(getTrophyEff(8))).max(0)
	}
}