<template>
    <div>
        <br><br>
        Level <b>{{formatWhole(level)}}</b><br>
        XP: <b>{{formatWhole(player.xp)}} / {{formatWhole(nextLevel)}}</b><br><br>
        HP: <b>{{formatWhole(hp.sub(player.damageTaken).max(0))}} / {{formatWhole(hp)}}</b><br>
        DMG: <b>{{formatWhole(dmg)}}</b>, SPD: <b>{{format(spd)}}</b><br><br><br>

        <button :class="{mini: true, unlocked: Decimal.gt(player.stage, 1), locked: Decimal.lte(player.stage, 1)}" @click="prevStage">
            &larr;
        </button>
        &nbsp;Stage <b>{{getStageName(new Decimal(player.stage))}}</b>
        &nbsp;<button :class="{mini: true, unlocked: Decimal.lt(player.stage, player.bestStage), locked: Decimal.gte(player.stage, player.bestStage)}" @click="nextStage">
            &rarr;
        </button><br>
        
        Defeated: <b>{{formatWhole(player.enemiesDefeated)}} / {{Decimal.eq(player.stage, player.bestStage) ? formatWhole(enemiesInStage) : "&#8734;"}}</b><br><br>
        <img :src="enemyData.img" :style="{filter: enemyData.filter ?? 'none'}" style="width: 128px; height: 128px;" /><br>
        <span :style="{color: enemyData.nameColor ?? 'white', filter: enemyData.filter ?? 'none'}">
            {{enemyData.name}} {{stageData.rank.gt(1) ? ("[Rk "+ formatWhole(stageData.rank) +"]") : ""}}</span><br>
        HP: <b>{{formatWhole(Decimal.sub(enemyTotalHP, player.damageDealt).max(0))}} / {{formatWhole(enemyTotalHP)}}</b><br>
        DMG: <b>{{formatWhole(enemyRealDMG)}}</b>, SPD: <b>{{format(enemyRealSPD)}}</b><br>
        <span v-if="enemyData.special.length > 0">
            Abilities: <span v-for="spec in enemyData.special" v-bind:tooltip="ABILITY_DATA[spec].desc">{{ ABILITY_DATA[spec].name }}; </span>
        </span><br><br>
    </div>
</template>

<script setup lang="ts">
import Decimal from 'break_eternity.js';
import { formatWhole, format } from '../game/format';
import { level, nextLevel, hp, dmg, spd } from '../game/player';
import { player } from '../game/playerControl';
import { prevStage, nextStage, getStageName, enemiesInStage, stageData } from '../game/stage';
import { enemyData, enemyTotalHP, enemyRealDMG, enemyRealSPD } from '../game/enemy';
import { ABILITY_DATA } from '../data/abilityData';
</script>