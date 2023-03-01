<template>
    <div class="nrow">
        <div class="ncol">
            <q-btn no-caps outline :color="player.autosave ? 'positive' : 'negative'" class="small unlocked" @click="() => { player.autosave = !player.autosave }">
                Autosave: {{player.autosave ? "ON" : "OFF"}}
            </q-btn>
            <q-btn no-caps outline :color="player.offProd ? 'positive' : 'negative'" class="small unlocked" @click="() => { player.offProd = !player.offProd }">
                Offline: {{player.offProd ? "ON" : "OFF"}}
            </q-btn>
        </div>
        <div class="ncol">
            <q-btn no-caps outline color="positive" class="small unlocked" @click="save">Save</q-btn>
            <q-btn no-caps outline color="accent" class="small unlocked" @click="importSave">Import</q-btn>
        </div>
        <div class="ncol">
            <q-btn no-caps outline color="negative" class="small unlocked" style="background-color: #820000;" @click="hardReset">HARD RESET</q-btn>
            <q-btn no-caps outline color="accent" class="small unlocked" @click="exportSave">Export</q-btn>
        </div>
    </div>
</template>

<script setup lang="ts">
import { player } from '../game/playerControl';
import { save, importSave, exportSave, hardReset } from '../game/saveload';
</script>