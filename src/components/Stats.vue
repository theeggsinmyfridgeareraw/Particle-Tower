<template>
    <div>
        <div v-if="statsTabs.length > 1" v-for="name in statsTabs">
            <button 
                    :class="{smallw: true, unlocked: true, [name.toLowerCase().replaceAll(' ', '_')]: true}" 
                    @click="() => { statsTab = name; }">
            {{name}}
            </button>
        </div><br/><br/>
        <div v-if="statsTab == 'Enemies'">
            <h3>Enemies</h3>
            <q-carousel 
                v-model="enemySlide"
                transition-prev="scale"
                transition-next="scale"
                swipeable
                animated
                control-color="white"
                navigation
                padding
                arrows
                height="300px"
                class="bg-grey-15 text-white shadow-1 rounded-borders" style="height: 50em;">
                <q-carousel-slide :name="Number(id)" class="column no-wrap flex-center" v-for="id in Object.keys(ENEMY_DATA).filter(id => player.guideRecords.enemies[Number(id)])"><br/><br/>
                    <br/><br/><q-card class="bg-blue-grey-15" style="padding: 5px; max-width: 15em;">
                        <img :src="E(id).img" :style="{filter: E(id).filter ?? 'none'}" style="width: 128px; height: 128px; margin: 0 auto;" /><br>
                        <span :style="{color: E(id).nameColor ?? 'white', filter: E(id).filter ?? 'none'}">
                            {{E(id).name}}</span><br>
                        HP: <b>{{formatWhole(E(id).hp)}}</b><br>
                        DMG: <b>{{formatWhole(E(id).dmg)}}</b>, SPD: <b>{{format(E(id).spd)}}</b><br>
                        <span v-if="E(id).special.length > 0">
                            Abilities: <span v-for="spec in E(id).special">
                                <q-tooltip class="bg-grey-10" style="font-size: 0.9em;" max-width="15em">
                                    {{ ABILITY_DATA[spec].desc }}
                                </q-tooltip>
                                {{ ABILITY_DATA[spec].name }}; 
                            </span>
                        </span><br><br>
                        <i>{{E(id)?.desc ?? ""}}</i><br>
                    </q-card><br/><br/>
                </q-carousel-slide>
            </q-carousel>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ENEMY_DATA } from '../data/enemyData';
import { player } from '../game/playerControl';
import { formatWhole, format } from '../game/format';
import { ABILITY_DATA } from '../data/abilityData';

const statsTab = ref<string>("Enemies");
const statsTabs = ["Enemies"]
const E = (s: string) => ENEMY_DATA[Number(s)];

const enemySlide = ref<number>(1);
</script>