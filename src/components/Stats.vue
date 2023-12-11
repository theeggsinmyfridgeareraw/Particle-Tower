<template>
    <div>
        <div class="row justify-center">
            <div v-if="statsTabs.length > 1" v-for="name in statsTabs">
                <q-btn 
                        outline
                        no-caps
                        color="white"
                        :class="{small: true, unlocked: true, [name.toLowerCase().replaceAll(' ', '_')]: true}" 
                        @click="() => { statsTab = name; }">
                {{name}}
            </q-btn>
            </div>
        </div><br/><br/>
        <div v-if="statsTab == 'Enemies'">
            <h4>Enemies</h4>
            <div class="q-pa-md">
                <div class="q-pa-md q-gutter-sm">
                        <div class="row justify-center" v-for="enemyRow in enemyTable">
                            <div class="col-md-1" v-for="eID in enemyRow" style="width: 45px;">
                                <q-btn @click="enemyID = eID" no-caps color="dark" style="width: 37.5px; height: 37.5px;" v-if="player.guideRecords.enemies[eID]">
                                    <img :src="E(eID).img" :style="{filter: E(eID).filter ?? 'none'}" style="width: 32px; height: 32px; margin: 0 auto;" />
                                </q-btn>
                            </div>
                        </div>
                    </div><br/><br/><br/>

                <q-separator />

                <div v-if="enemyID != -1">
                    <q-card class="bg-blue-grey-15" style="padding: 5px; margin: 0 auto; max-width: 15em;">
                        <img :src="E(enemyID).img" :style="{filter: E(enemyID).filter ?? 'none'}" style="width: 128px; height: 128px; margin: 0 auto;" /><br>
                        <span :style="{color: E(enemyID).nameColor ?? 'white', filter: E(enemyID).filter ?? 'none'}">
                            {{E(enemyID).name}}</span><br>
                        HP: <b>{{formatWhole(E(enemyID).hp)}}</b><br>
                        DMG: <b>{{formatWhole(E(enemyID).dmg)}}</b>, SPD: <b>{{format(E(enemyID).spd)}}</b><br>
                        XP: <b>{{formatWhole(E(enemyID).xp)}}</b><br/>
                        <span v-if="E(enemyID).special.length > 0">
                            Abilities: <span v-for="spec in E(enemyID).special">
                                <q-tooltip class="bg-grey-10" style="font-size: 0.9em;" max-width="15em">
                                    {{ ABILITY_DATA[spec].desc }}
                                </q-tooltip>
                                {{ ABILITY_DATA[spec].name }}; 
                            </span>
                        </span><br><br>
                        <i>{{E(enemyID)?.desc ?? ""}}</i><br>
                    </q-card>
                </div>
            </div>
        </div>
        <div v-else-if="statsTab == 'Guide'">
            <h4>Guide</h4>

            <div style="max-width: 350px; margin: 0 auto;">
                <q-list padding style="border-color: white;" bordered class="rounded-borders">
                    <div v-for="data in guideData">
                        <q-expansion-item
                        expand-separator
                        :label="data.name"
                        v-if="unref(data.unl)"
                        >
                            <q-card class="bg-grey-15">
                            <q-card-section>
                                <div v-for="row in data.descRows">
                                    <div style="line-height: 1em;"><br/></div>
                                    {{ row }}
                                </div>
                                <div style="line-height: 1em;"><br/></div>
                            </q-card-section>
                            </q-card>
                        </q-expansion-item>
                    </div>
                </q-list>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ComputedRef, computed, ref, unref } from 'vue';
import { ENEMY_DATA } from '../data/enemyData';
import { formatWhole, format } from '../game/format';
import { ABILITY_DATA } from '../data/abilityData';
import Decimal from 'break_eternity.js';
import { player } from '../game/playerControl';

const statsTab = ref<string>("Enemies");
const statsTabs = ["Enemies", "Guide"];
const E = (n: number) => ENEMY_DATA[n];

const enemyTable = [
    [1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17/*, 24 */],
    [18, 19, 20, 21, 22/*, 23 */]
];

const guideData: { name: string, unl: boolean | ComputedRef<boolean>, descRows: string[] }[] = [
    {
        name: "Trophies",
        unl: true,
        descRows: ["Gain trophies by defeating enemies.", "Trophies of a given type will provide a unique boost of some kind.", "Only a certain number of these boosts can be active at once."]
    },
    {
        name: "Ranks",
        unl: computed(() => Decimal.gte(player.bestStage, 25)),
        descRows: ["Enemy ranks magnify their strength.", "Each rank after 1 multiplies their HP, DMG, & XP/Trophy gain by 2.5."]
    },
    {
        name: "Trophy Sacrifice",
        unl: computed(() => Decimal.gte(player.bestStage, 51)),
        descRows: ["Eventually, trophies can be sacrificed!", "This creates \"sacrificed trophies\", which have a similar (but sometimes distinct) effect to the regular trophies.", "Trophy Sacrifice for a given enemy can be unlocked by reaching a certain stage threshold (50 + EnemyID^2)."]
    },
    {
        name: "Alternate Enemy Forms",
        unl: computed(() => Decimal.gte(player.bestStage, 81)),
        descRows: ["There are alternate forms of existing enemies, such as antiparticles.", "As such, rather than having their own trophies, they give much higher amounts of trophies of their regular counterparts (6e16x).", "These alternate enemy forms also drop the equivalent amount of sacrificed trophies."]
    }
]

const enemyID = ref<number>(-1);
</script>