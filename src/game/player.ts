import { computed } from "vue";
import { player } from "./playerControl";
import Decimal, { DecimalSource } from "break_eternity.js";
import { enemyAtk, enemyBlock, enemyData, enemyRealSPD, enemyTotalHP } from "./enemy";
import { getTrophyEff } from "./trophies";

export const levelReqData = computed(() => ({
    base: 5, 
    exp: 1.02
}));

export const level = computed(() => Decimal.max(player.xp, 1).log(levelReqData.value.base).root(levelReqData.value.exp).plus(1).floor());
export const nextLevel = computed(() => Decimal.pow(levelReqData.value.base, level.value.pow(levelReqData.value.exp)).ceil());

export const xpMult = computed(() => getTrophyEff(15));
export const trophyMult = computed(() => getTrophyEff(15));

export const hp = computed(() => { 
	let hp = Decimal.pow(1.5, level.value.sub(1).root(1.5)).plus(level.value.sub(2).max(0)).times(10).floor();
	hp = hp.times(getTrophyEff(5));
	hp = hp.times(getTrophyEff(17).sub(1).times(level.value).plus(1).max(1));
	return hp;
});

export const dmg = computed(() => { 
	let dmg = level.value.sub(2).max(0).plus(1);
	dmg = dmg.plus(getTrophyEff(10));

	dmg = Decimal.pow(2, level.value.sub(1).sqrt()).times(dmg);

	dmg = dmg.times(getTrophyEff(2));
	if (Decimal.gte(player.damageTaken, hp.value.times(0.6))) dmg = dmg.times(getTrophyEff(12));
	dmg = dmg.div(getTrophyEff(14).pow(2/3).times(1.1));

	if (player.bestiaryChosen[17]) dmg = dmg.div(2);

	if (enemyData.value.special.includes("weaken")) dmg = dmg.div(Decimal.div(player.damageTaken, hp.value ?? 1).times(2).plus(1).pow(3));
	return dmg;
});

export const spd = computed(() => { 
	let spd = level.value.plus(1).div(2);
	spd = spd.plus(getTrophyEff(1));

	spd = spd.times(getTrophyEff(14));

	if (enemyData.value.special.includes("charm")) spd = spd.div(Decimal.pow(1.1, Decimal.sqrt(player.enemyAttacks)));
	return spd;
});

export const critChance = computed(() => getTrophyEff(9));
export const critMult = computed(() => new Decimal(5));

export function playerAtk(bulk: DecimalSource) {
	const isCrit = Decimal.lt(Math.random(), critChance.value.root(bulk));
	let eDmg = dmg.value.times(bulk).times(isCrit ? critMult.value.max(1).sub(1).div(bulk).plus(1) : 1).times(1 - enemyBlock.value);
	if (enemyData.value.special.includes("shield") && eDmg.lt(Decimal.div(enemyTotalHP.value, 10)) && !isCrit) eDmg = new Decimal(0);
	
	player.damageDealt = Decimal.add(player.damageDealt, eDmg);
	player.attackCooldown = 0;

	if (enemyData.value.special.includes("counter") && player.damageDealt.lt(enemyTotalHP.value) && Math.random() < 1 - Decimal.pow(0.6, bulk).toNumber()) {
        enemyAtk(Decimal.sub(bulk, 1).div(5).floor().times(5).plus(1));
    }
}