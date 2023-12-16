import Decimal from "break_eternity.js";
import { player } from "./playerControl";
import { enemyAtk, enemyData, enemyRealSPD, enemyTotalHP, fromCurrentEnemyData } from "./enemy";
import { hp, playerAtk, spd, trophyMult, xpMult } from "./player";
import { enemiesInStage, resetStage, stageData } from "./stage";
import { trophySacRatio } from "./trophySac";
import { getTrophyEff, getTrophyGen } from "./trophies";
import { getRealmModifierPower, realmShardGain } from "./realms";

export function gameLoop(diff: number) {
	if (Decimal.gte(player.realms.number, 1)) {
		player.realms.shards = Decimal.add(player.realms.shards, Decimal.mul(realmShardGain.value, diff));
	}

    if (Decimal.gte(player.enemyAttackCooldown, Decimal.div(1, enemyRealSPD.value))) {
		let bulk = Decimal.mul(player.enemyAttackCooldown, enemyRealSPD.value).floor();
		enemyAtk(bulk)
	}
	let cooldownD = new Decimal(diff);
	if (enemyData.value.special.includes("agile") && (Math.random() < (1 - getTrophyEff(11).toNumber()))) {
        cooldownD = cooldownD.times(Decimal.div(player.damageDealt, enemyTotalHP.value).times(2).plus(1));
    }
	player.enemyAttackCooldown = Decimal.add(player.enemyAttackCooldown, cooldownD);
	
	if (Decimal.gte(player.damageTaken, hp.value)) {
		resetStage()
	} else {
		player.damageTaken = Decimal.sub(player.damageTaken, getTrophyEff(7).times(diff)).max(0);
	
		if (Decimal.gte(player.attackCooldown, Decimal.div(1, spd.value))) {
			let bulk = spd.value.times(player.attackCooldown).floor();
			playerAtk(bulk)
		} 
		if (!(enemyData.value.special.includes("stun") && Math.random()<(.5 * (1 - getTrophyEff(11).toNumber())))) {
            player.attackCooldown = Decimal.add(player.attackCooldown, diff);
        }

		if (enemyData.value.special.includes("regenerator")) {
			player.damageDealt = Decimal.sub(player.damageDealt, Decimal.mul(0.005, diff).times(enemyTotalHP.value).times(getTrophyEff(7, 4)).div(getTrophyEff(8))).max(0)
		}
		
		if (Decimal.gte(player.damageDealt, enemyTotalHP.value)) {
			if ((fromCurrentEnemyData("trophyEff") !== undefined) || (fromCurrentEnemyData("mutates") !== undefined)) {
				const id = fromCurrentEnemyData("mutates") ?? enemyData.value.id;
				const gain = trophyMult.value.times(stageData.value.mag).times(enemyData.value.trophyMult ?? 1).div(getRealmModifierPower("Trophiless"));
				player.bestiary[id] = Decimal.add(player.bestiary[id]||0, gain);
				if (fromCurrentEnemyData("mutates") !== undefined) {
					player.trophySac[id] = gain.times(trophySacRatio.value).plus(player.trophySac[id] ?? 0);
				}
			}
			player.xp = Decimal.add(player.xp, Decimal.mul(enemyData.value.xp, stageData.value.mag).times(xpMult.value));
			player.damageDealt = 0;
			player.enemyAttackCooldown = 0;
			player.enemyAttacks = 0;
			player.playerAttacks = 0;
			player.enemiesDefeated = Decimal.add(player.enemiesDefeated, 1);
			player.damageTaken = player.damageTaken.sub(getTrophyEff(3).times(getTrophyEff(7, 4))).max(0);
			if (player.enemiesDefeated.gte(enemiesInStage.value) && Decimal.eq(player.stage, player.bestStage)) {
				player.bestStage = Decimal.add(player.bestStage, 1);
			}
			trySeeEnemy();
		}
	}
}

export function trySeeEnemy() {
	if (!player.guideRecords.enemies[enemyData.value.id]) {
		player.guideRecords.enemies[enemyData.value.id] = true;
	}
}

export function offGameLoop(diff: number) {
    player.currTime = new Date().getTime();

	for (let key in player.bestiaryGenUpgs) {
        if (player.bestiary[key]) player.bestiary[key] = Decimal.add(player.bestiary[key], Decimal.mul(getTrophyGen(Number(key)), diff));
    }

	player.timePlayed += diff;
}