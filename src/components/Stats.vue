<template>
    <div>
        <h3>Abilities</h3>
			<div v-for="data in ABILITY_DATA">
				<b :tooltip="data.desc">{{data.name}}</b><br>
			</div>
    </div>
</template>

<script setup lang="ts">
import { ABILITY_DATA } from '../data/abilityData';
</script>