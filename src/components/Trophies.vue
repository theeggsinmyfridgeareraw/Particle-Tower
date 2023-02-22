<template>
 <div>
    <br><br>
    <b>Selected: {{formatWhole(bestiaryChosen)}} / {{formatWhole(bestiaryLimit)}}</b>
    <br><br>
    <div class="row" style="display: flex; margin-bottom: 10px;" v-for="r in Math.ceil(Object.keys(player.bestiary).length/6)">
        <div v-for="(value, id) in reducedBestiary(r)">
            <button :class="{bestiaryDiv: true, unlocked: true, enabled: player.bestiaryChosen[id]}" @click="() => toggleTrophy(Number(id))">
                <h4>{{ENEMY_DATA[id].name}} [{{formatWhole(value)}}]</h4>
                {{fromEnemyData(id, "trophyDesc")?.(0) ?? "???"}}
            </button><br>
            <button v-if="player.bestiary[Number(id)+6]!==undefined" :class="{bestiaryDiv: true, short: true, unlocked: true, canbuy: Decimal.gte(player.bestiary[Number(id)+6]||0, getTrophyGenUpgCost(Number(id)))}" @click="() => buyTrophyGenUpg(Number(id))">
                <h4 style="margin-top: 2px;">+{{formatWhole(getTrophyGen(Number(id)))}} {{ENEMY_DATA[id].name}} Trophies/sec</h4>
                Cost: {{formatWhole(getTrophyGenUpgCost(Number(id)))}} {{(ENEMY_DATA[Number(id)+6]!==undefined)?(ENEMY_DATA[Number(id)+6].name+" Trophies"):"???"}}
            </button><br>
            <button :tooltip="'Sacrificed Trophies add to Trophy effects, but are permanent (i.e. don\'t have to be selected to work). \n Cost: 50% of Trophies (req amt: ' + formatWhole(trophySacReq(Number(id))) + ') \n Loss Rate: 50%'" v-if="trophySacUnl(Number(id))" :class="{bestiaryDiv: true, tall: true, unlocked: true, canbuy: canTrophySac(Number(id))}" @click="() => trophySac(Number(id))">
                <h4 style="margin-top: 2px;">{{formatWhole(player.trophySac[id] ?? 0)}} Sacrificed {{ENEMY_DATA[id].name}} Trophies</h4>
                {{(fromEnemyData(id, "sacDesc") ?? fromEnemyData(id, "trophyDesc"))?.(1) ?? "???"}}
            </button><br>
            <button v-if="trophySacUnl(Number(id))" :class="{ binary: true, enabled: !(player.trophySacDisabled[id] ?? false), disabled: player.trophySacDisabled[id] ?? false }" @click="() => toggleSac(Number(id))">
                {{ player.trophySacDisabled[id] ? "OFF" : "ON" }}
            </button>
        </div>
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