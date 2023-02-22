<template>
    <div class="row">
        <div class="col">
            <button class="small unlocked options" @click="() => { player.autosave = !player.autosave }">
                Autosave: {{player.autosave ? "ON" : "OFF"}}
            </button>
            <button class="small unlocked options" @click="() => { player.offProd = !player.offProd }">
                Offline: {{player.offProd ? "ON" : "OFF"}}
            </button>
        </div>
        <div class="col">
            <button class="small unlocked options" @click="save">Save</button>
            <button class="small unlocked options" @click="importSave">Import</button>
        </div>
        <div class="col">
            <button class="small unlocked" style="background-color: #820000;" @click="hardReset">HARD RESET</button>
            <button class="small unlocked options" @click="exportSave">Export</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { player } from '../game/playerControl';
import { save, importSave, exportSave, hardReset } from '../game/saveload';
</script>