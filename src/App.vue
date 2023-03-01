<template>
  <div>
    <br>
    <div class="nrow">
      <div v-for="data in tabData">
        <q-btn no-caps v-if="unref(data.unl)" 
                :color="data.color"
                outline
                class="smallw unlocked" 
                @click="() => { currentTab = data.name; }" style="font-size: 1em !important; font-weight: bold;">
          {{data.name}}
        </q-btn>
      </div>
    </div><br/>
    <component :is="tabData[currentTab].component" />
  </div>
</template>

<script setup lang="ts">
import { unref } from 'vue';
import { currentTab, tabData } from './data/tabData';
</script>

<style>
#app {
  background-color: rgb(11, 15, 16); 
  color: white;
}
</style>