import { DecimalSource } from "break_eternity.js";
import { reactive } from "vue";

export const player: Player = reactive(getStartPlayer());

interface Player {
    currTime: number,
    timePlayed: number,
    autosave: boolean,
    offProd: boolean,
    xp: DecimalSource,
    damageTaken: DecimalSource,
    stage: DecimalSource,
    bestStage: DecimalSource,
    damageDealt: DecimalSource,
    enemiesDefeated: DecimalSource,
    attackCooldown: DecimalSource,
    enemyAttackCooldown: DecimalSource,
    enemyAttacks: DecimalSource,
	playerAttacks: DecimalSource,
    bestiary: Record<number, DecimalSource>,
    bestiaryChosen: Record<number, boolean>,
    bestiaryGenUpgs: Record<number, DecimalSource>,
    trophySac: Record<number, DecimalSource>,
    trophySacDisabled: Record<number, boolean>,
	guideRecords: {
		enemies: Record<number, boolean>
	}
}

export function getStartPlayer(): Player {
	return {
		currTime: new Date().getTime(),
		timePlayed: 0,
		autosave: true,
		offProd: true,
		xp: 0,
		damageTaken: 0,
		stage: 1,
		bestStage: 1,
		damageDealt: 0,
		enemiesDefeated: 0,
		attackCooldown: 0,
		enemyAttackCooldown: 0,
		enemyAttacks: 0,
		playerAttacks: 0,
		bestiary: {},
		bestiaryChosen: {},
		bestiaryGenUpgs: {},
		trophySac: {},
		trophySacDisabled: {},
		guideRecords: {
			enemies: {}
		}
	};
}