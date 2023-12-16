<template>
    <div>
        <br><br>
        Level <b>{{formatWhole(level)}}</b><br>
        XP: <b>{{formatWhole(player.xp)}} / {{formatWhole(nextLevel)}}</b><br><br>
        HP: <b>{{formatWhole(hp.sub(player.damageTaken).max(0))}} / {{formatWhole(hp)}}</b><br>
        DMG: <b>{{formatWhole(dmg)}}</b>, SPD: <b>{{format(spd)}}</b><br><br><br>

        <q-btn :style="{ visibility: Decimal.gt(player.stage, 1) ? 'visible' : 'hidden' }" no-caps color="dark" class="mini" @click="prevStage">
            &larr;
        </q-btn>
        &nbsp;Stage <b>{{getStageName(player.stage)}}</b>
        &nbsp;<q-btn :style="{ visibility: Decimal.lt(player.stage, player.bestStage) ? 'visible' : 'hidden' }" no-caps color="dark" class="mini" @click="nextStage">
            &rarr;
        </q-btn><br>
        
        Defeated: <b>{{formatWhole(player.enemiesDefeated)}} / {{Decimal.eq(player.stage, player.bestStage) ? formatWhole(enemiesInStage) : "&#8734;"}}</b><br><br>
        <q-card class="bg-blue-grey-15" style="padding: 5px; max-width: 15em; margin: 0 auto;">
            <img :src="enemyData.img" :style="{filter: enemyData.filter ?? 'none'}" style="width: 128px; height: 128px; margin: 0 auto;" /><br>
            <span :style="{color: enemyData.nameColor ?? 'white', filter: enemyData.filter ?? 'none'}">
                {{enemyData.name}} {{stageData.rank.neq(1) ? ("[Rk "+ formatWhether(stageData.rank) +"]") : ""}}</span><br>
            HP: <b>{{formatWhole(Decimal.sub(enemyTotalHP, player.damageDealt).max(0))}} / {{formatWhole(enemyTotalHP)}}</b><br>
            DMG: <b>{{formatWhole(enemyRealDMG)}}</b>, SPD: <b>{{format(enemyRealSPD)}}</b><br>
            <span v-if="enemyData.special.length > 0">
                Abilities: <span v-for="spec in enemyData.special">
                    <q-tooltip class="bg-grey-10" style="font-size: 0.9em;" max-width="15em">
                        {{ ABILITY_DATA[spec].desc }}
                    </q-tooltip>
                    {{ ABILITY_DATA[spec].name }}; 
                </span>
            </span>
        </q-card>
        <br><br>
    </div>
</template>

<script setup lang="ts">
import Decimal from 'break_eternity.js';
import { formatWhole, format, formatWhether } from '../game/format';
import { level, nextLevel, hp, dmg, spd } from '../game/player';
import { player } from '../game/playerControl';
import { prevStage, nextStage, getStageName, enemiesInStage, stageData } from '../game/stage';
import { enemyData, enemyTotalHP, enemyRealDMG, enemyRealSPD } from '../game/enemy';
import { ABILITY_DATA } from '../data/abilityData';
</script>