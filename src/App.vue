<template>
  <div>
    <br>
    <div class="row">
      <div v-for="data in tabData">
        <button v-if="unref(data.unl)" 
                :class="{smallw: true, unlocked: true, [data.name.toLowerCase().replaceAll(' ', '_')]: true}" 
                @click="() => { currentTab = data.name; }">
          {{data.name}}
        </button>
      </div>
    </div>
    <component :is="tabData[currentTab].component" />
  </div>
</template>

<script setup lang="ts">
import { unref } from 'vue';
import { currentTab, tabData } from './data/tabData';
</script>

<style>
#app {
  background-color: black; 
  color: white;
}
</style>