import { Component, computed, ComputedRef, ref } from "vue";
import Options from "../components/Options.vue";
import Main from "../components/Main.vue";
import Trophies from "../components/Trophies.vue";
import Stats from "../components/Stats.vue";
import { player } from "../game/playerControl";
import Decimal from "break_eternity.js";
import { realmGoal } from "../game/realms";
import Realms from "../components/Realms.vue";

type Tab = "Options" | "Stats" | "Main" | "Trophies" | "Realms";
export const currentTab = ref<Tab>("Main");

interface TabData {
    name: Tab,
    unl: boolean | ComputedRef<boolean>,
    color?: string,
    component: Component
}

export const tabData: Record<Tab, TabData> = {
    Options: {
        name: "Options",
        unl: true,
        color: "grey-6",
        component: Options
    },
    Stats: {
        name: "Stats",
        unl: true,
        color: "secondary",
        component: Stats
    },
    Main: {
        name: "Main",
        unl: true,
        color: "primary",
        component: Main
    },
    Trophies: {
        name: "Trophies",
        unl: computed(() => Object.keys(player.bestiary).length >= 1),
        color: "amber-10",
        component: Trophies
    },
    Realms: {
        name: "Realms",
        unl: computed(() => Decimal.gt(player.bestStage, realmGoal.value) || Decimal.gte(player.realms.number, 1)),
        color: "pink-6",
        component: Realms
    }
};