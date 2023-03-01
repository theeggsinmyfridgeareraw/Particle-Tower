<template>
 <div>
    <br><br>
    <b>Selected: {{formatWhole(bestiaryChosen)}} / {{formatWhole(bestiaryLimit)}}</b>
    <br><br>
    <div class="nrow" style="margin-bottom: 10px;" v-for="r in Math.ceil(Object.keys(player.bestiary).length/6)">
        <q-card v-for="(value, id) in reducedBestiary(r)" class="bg-blue-grey-15 ncol" style="padding: 5px; max-width: 15em; margin-left: 2px; margin-right: 2px;">
            <b>{{ ENEMY_DATA[id].name }} [{{ formatWhole(value) }}]</b> <span v-if="player.bestiary[Number(id)+6]!==undefined">(+{{formatWhole(getTrophyGen(Number(id)))}}/s)</span>
            <i>Effect: {{fromEnemyData(id, "trophyDesc")?.(0) ?? "???"}}</i>
            <q-btn no-caps :color="player.bestiaryChosen[id] ? 'positive' : 'negative'" outline class="unlocked" @click="() => toggleTrophy(Number(id))">
                {{ player.bestiaryChosen[id] ? 'ON' : 'OFF' }}
            </q-btn>
            <q-btn no-caps v-if="player.bestiary[Number(id)+6]!==undefined" :color="Decimal.gte(player.bestiary[Number(id)+6]||0, getTrophyGenUpgCost(Number(id))) ? 'positive' : 'negative'" :class="{short: true, unlocked: true, disabled: Decimal.lt(player.bestiary[Number(id)+6]||0, getTrophyGenUpgCost(Number(id)))}" @click="() => buyTrophyGenUpg(Number(id))">
                Auto Cost: {{formatWhole(getTrophyGenUpgCost(Number(id)))}} {{(ENEMY_DATA[Number(id)+6]!==undefined)?(ENEMY_DATA[Number(id)+6].name+" Trophies"):"???"}}
            </q-btn>
            <div v-if="trophySacUnl(Number(id))">
                <br/><b>{{formatWhole(player.trophySac[id] ?? 0)}} Sacrificed {{ENEMY_DATA[id].name}} Trophies</b><br/>
                <i>Effect: {{fromEnemyData(id, "sacDesc")?.(1) ?? fromEnemyData(id, "trophyDesc")?.(1) ?? "???"}}</i><br/>
                <div class="nrow">
                    <q-btn no-caps :color="canTrophySac(Number(id)) ? 'positive' : 'negative'" :class="{tall: true, unlocked: true, canbuy: canTrophySac(Number(id)), disabled: !canTrophySac(Number(id)) }" @click="() => trophySac(Number(id))">
                        <q-tooltip class="bg-grey-10" style="font-size: 0.9em;" max-width="15em">
                            {{ 'Sacrificed Trophies add to Trophy effects, but are permanent (i.e. don\'t have to be selected to work). \n Cost: 50% of Trophies (req amt: ' + formatWhole(trophySacReq(Number(id))) + ') \n Loss Rate: 50%' }}
                        </q-tooltip>
                        Sacrifice
                    </q-btn>
                    <q-btn no-caps :color="!(player.trophySacDisabled[id] ?? false) ? 'positive' : 'negative'" outline @click="() => toggleSac(Number(id))">
                        {{ player.trophySacDisabled[id] ? "OFF" : "ON" }}
                    </q-btn>
                </div>
            </div>
        </q-card>
    </div>
 </div>
</template>

<script setup lang="ts">
import { formatWhole } from '../game/format';
import { player } from '../game/playerControl';
import { ENEMY_DATA, fromEnemyData } from '../data/enemyData';
import { trophySacUnl, trophySacReq, canTrophySac, trophySac } from '../game/trophySac';
import { bestiaryChosen, bestiaryLimit, toggleTrophy, getTrophyGenUpgCost, buyTrophyGenUpg, getTrophyGen } from '../game/trophies';
import Decimal, { DecimalSource } from 'break_eternity.js';
import { resetStage } from '../game/stage';

const reducedBestiary = (r: number) => {
    const keys = Object.keys(player.bestiary).map(n => Number(n));
    return keys.reduce((result: Record<number, DecimalSource>, key: number) => { 
        if (key > (6*(r-1))&&key<=r*6) result[key] = player.bestiary[key]; 
        return result; 
    }, {} as Record<number, DecimalSource>);
};

function toggleSac(id: number) {
    player.trophySacDisabled[id] = !(player.trophySacDisabled[id] ?? false); 
    resetStage();
}
</script>