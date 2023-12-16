<template>
    <div>
        <br/>
        <div v-if="Decimal.gte(player.realms.number, 1)">
            You have <b style="font-size: 2em;">{{ formatWhole(player.realms.staticEnergy) }}</b> Static Energy<br/><br/>

            You have <b>{{ format(player.realms.shards) }}</b> Realm Shards, which multiplies XP gain by {{ format(realmShardEff) }}<br/>
            <i style="font-size: 0.9em;">(+{{ format(realmShardGain) }}/s)</i>
        </div><br/><br/>

        <q-separator dark /><br/><br/>

        <i>Realm {{ formatWhole(player.realms.number + 1) }}: </i><b style="font-size: 1.2em;">{{ player.realms.realmOptions[player.realms.realmIndex].realm.name }}</b><br/>
        [Stage {{ getStageName(Decimal.sub(player.bestStage, 1)) }} / {{ getStageName(realmGoal) }}]<br/><br/>

        <div v-for="mod in player.realms.realmOptions[player.realms.realmIndex].realm.modifiers">
            <b>{{ mod.name }}</b>: {{ modifierDesc(mod) }}
        </div><br/>

        There is <b style="font-size: 1.5em;">{{ formatWhole(realmEnergy) }}</b> Realm Energy<br/>
        <i>(formed by your actual earned & sacrificed trophies<span v-if="Decimal.gt(player.realms.staticEnergy, 0)">, as well as your Realm Shards</span>)</i><br/><br/>
        
        <div class="q-pa-md q-gutter-sm row" v-if="Decimal.gte(player.realms.number, 1) || Decimal.gt(player.bestStage, realmGoal)">
            <q-card v-for="(data, i) in realmsVisible" class="pink-15" style="padding: 5px; max-width: 15em; margin: 0 auto;" dark>
                <b style="font-size: 1.1em">{{ data.realm.name }}</b><br/>
                <i>Req: {{ formatWhole(data.cost) }} Realm Energy</i>
                <q-separator dark /><br/>
                <i>Goal: Stage {{ getStageName(data.realm.goal) }} completed</i><br/><br/>
                <div v-for="mod in data.realm.modifiers">
                    <b>{{ mod.name }}</b>: {{ modifierDesc(mod) }}
                </div><br/>
                <q-btn @click="confirm('Entering Realm ' + data.realm.name, 'Are you sure you want to ' + ((Decimal.lt(player.realms.number, 1) || Decimal.gt(player.bestStage, realmGoal)) ? 'enter another' : 'reset to this') + ' Realm? This will reset all progress within your current Realm!', () => enterRealm(i, Decimal.gt(player.bestStage, realmGoal)))" color="dark" :disable="Decimal.lt(realmEnergy, data.cost)">ENTER</q-btn>
                <br/><br/>
            </q-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import Decimal from 'break_eternity.js';
import { format, formatWhole } from '../game/format';
import { enterRealm, realmEnergy, realmGoal, realmShardEff, realmShardGain, realmsAvailable } from '../game/realms';
import { player } from '../game/playerControl';
import { modifierDesc } from '../data/realmData';
import { confirm } from "../util/helpers";
import { computed } from 'vue';
import { getStageName } from '../game/stage';

const realmsVisible = computed(() => (Decimal.gte(player.realms.number, 1) && Decimal.lte(player.bestStage, realmGoal.value)) ? player.realms.realmOptions : realmsAvailable.value);

</script>