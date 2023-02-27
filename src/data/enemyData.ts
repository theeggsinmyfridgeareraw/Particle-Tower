import Decimal, { DecimalSource } from "break_eternity.js";
import { format, formatSmall } from "../game/format";
import { level } from "../game/player";
import { getTrophyEff, StackType } from "../game/trophies";

interface BasicEnemyData {
    id: number,
    name: string,
    hp: DecimalSource,
    xp: DecimalSource,
    dmg: DecimalSource,
    spd: DecimalSource,
    img: string,
    special: string[],
    filter?: string,
    nameColor?: string,
    trophyMult?: DecimalSource,
}
type TrophiedEnemyData = BasicEnemyData & {
    trophyDesc: (b: number) => string,
    trophyEff: (x: Decimal) => Decimal
}
type SacEnemyData = TrophiedEnemyData & {
    sacDesc?: (b: number) => string,
    sacEff: (x: Decimal) => Decimal,
    sacReq: DecimalSource,
    stackType: StackType
}

interface MutationData {
    mutates: number,
}

type StandardEnemyData = BasicEnemyData | TrophiedEnemyData | SacEnemyData;

type TotalEnemyData = StandardEnemyData | (StandardEnemyData & MutationData);

export type EveryEnemyData = BasicEnemyData & TrophiedEnemyData & SacEnemyData & MutationData;

export const ENEMY_DATA: Record<number, TotalEnemyData> = {
	1: {
		id: 1,
		name: "Up Quark",
		hp: 5,
		xp: 1,
		dmg: 1,
		spd: 0.6,
		img: "images/up_quark.png",
		special: [],
        trophyDesc(b) { return "+"+format(getTrophyEff(1, b))+" SPD" },
        trophyEff(x) { return x.div(10).plus(1).log10().sqrt() },
        sacEff(x) { return x.div(1e6).cbrt().div(2) },
        sacReq: 5e5,
        stackType: "add"
	},
	2: {
		id: 2,
		name: "Down Quark",
		hp: 15,
		xp: 4,
		dmg: 3,
		spd: 0.7,
		img: "images/down_quark.png",
		special: [],
        trophyDesc(b) { return "+"+format(getTrophyEff(2, b).sub(1).times(100))+"% DMG" },
        trophyEff(x) { return x.div(10).plus(1).cbrt() },
        sacEff(x) { return x.div(1e6).plus(1).log(100).plus(1) },
        sacReq: 1e6,
        stackType: "mult"
	},
    3: {
        id: 3,
        name: "Charm Quark",
        hp: 40,
        xp: 12,
        dmg: 5,
        spd: 1,
        img: "images/charm_quark.png",
        special: ["heal"],
        trophyDesc(b) { return "Heals "+format(getTrophyEff(3, b))+" HP per kill" },
        trophyEff(x) { return x.plus(1).log2().times(5).times(x.div(1e4).plus(1).cbrt()) },
        sacEff(x) { return x.plus(1).log2().times(5).times(x.div(1e4).plus(1).cbrt()).times(1e4).sqrt() },
        sacReq: 2e6,
        stackType: "add"
    },
    4: {
        id: 4,
        name: "Strange Quark",
        hp: 25,
        xp: 8,
        dmg: 4,
        spd: 2.5,
        img: "images/strange_quark.png",
        special: ["weaken"],
        trophyDesc(b) { return "Divides Enemy DMG by "+format(getTrophyEff(4, b)) },
        trophyEff(x) { return x.div(5).plus(1).log10().plus(1).sqrt() },
        sacEff(x) { return x.div(1e6).plus(1).log(3).plus(1).pow(2.75) },
        sacReq: 4e6,
        stackType: "mult"
    },
    5: {
        id: 5,
        name: "Top Quark",
        hp: 100,
        xp: 50,
        dmg: 12,
        spd: 0.8,
        img: "images/top_quark.png",
        special: [],
        trophyDesc(b) { return "+"+format(getTrophyEff(5, b).sub(1).times(100))+"% HP" },
        trophyEff(x) { 
            if (x.gte(1e5)) x = x.sqrt().times(Math.sqrt(1e5))
            return x.div(5).plus(1).sqrt() 
        },
        sacEff(x) { return x.div(1e11).plus(1).root(5) },
        sacReq: 8e6,
        stackType: "mult"
    },
    6: {
        id: 6,
        name: "Bottom Quark",
        hp: 60,
        xp: 40,
        dmg: 10,
        spd: 5,
        img: "images/bottom_quark.png",
        special: [],
        trophyDesc(b) { return "Divides Enemy SPD by "+format(getTrophyEff(6, b)) },
        trophyEff(x) { return x.div(10).plus(1).log10().plus(1) },
        sacDesc(b) { return "Divides Enemy DMG by "+format(getTrophyEff(6, b))+", but multiplies Enemy SPD by "+format(getTrophyEff(6, b).pow(0.75)) },
        sacEff(x) { return x.div('1e15').plus(1).log10().plus(1).sqrt() },
        sacReq: 1.6e7,
        stackType: "mult"
    },
    7: {
        id: 7,
        name: "Electron",
        hp: 80,
        xp: 100,
        dmg: 25,
        spd: 2,
        img: "images/electron.png",
        special: ["stun"],
        trophyDesc(b) { return "Heals "+format(getTrophyEff(7, b))+" HP per second" },
        trophyEff(x) { return x.plus(1).log2().div(2).times(x.div(10).plus(1).cbrt()) },
        sacEff(x) { return x.div(1e7).plus(1).log2().div(3).times(x.div(1e9).plus(1).root(4)) },
        sacReq: 3.2e7,
        stackType: "add"
    },
    8: {
        id: 8,
        name: "Muon",
        hp: 500,
        xp: 600,
        dmg: 125,
        spd: 0.4,
        img: "images/muon.png",
        special: [],
        trophyDesc(b) { return "Divides enemy healing by "+format(getTrophyEff(8, b)) },
        trophyEff(x) { return x.plus(1).log2().plus(1).log(4).plus(1) },
        sacEff(x) { return x.div(1e5).plus(1).log2().plus(1).log10().plus(1).sqrt() },
        sacReq: 6.4e7,
        stackType: "mult"
    },
    9: {
        id: 9,
        name: "Tau",
        hp: 440,
        xp: 275,
        dmg: 60,
        spd: 3,
        img: "images/tau.png",
        special: ["agile"],
        trophyDesc(b) { return format(getTrophyEff(9, b).times(100))+"% Critical Hit Chance (5x DMG)" },
        trophyEff(x) { return Decimal.sub(0.2, Decimal.div(0.2, x.div(5).plus(1).log10().plus(1))) },
        sacEff(x) { return Decimal.sub(0.2, Decimal.div(0.2, x.div(1e8).plus(1).log10().plus(1))) },
        sacReq: 1.28e8,
        stackType: "add"
    },
    10: {
        id: 10,
        name: "Electron Neutrino",
        hp: 2990,
        xp: 3200,
        dmg: 400,
        spd: 2,
        img: "images/electron_neutrino.png",
        special: ["stun", "mutator"],
        trophyDesc(b) { return "+"+format(getTrophyEff(10, b))+" Base DMG" },
        trophyEff(x) { return x.div(25).plus(1).log10().sqrt() },
        sacEff(x) { return x.div(2.5e7).plus(1).log10().cbrt() },
        sacReq: 2.56e8,
        stackType: "add"
    },
    11: {
        id: 11,
        name: "Muon Neutrino",
        hp: 27500,
        xp: 24000,
        dmg: 1000,
        spd: 1.5,
        img: "images/muon_neutrino.png",
        special: ["shield"],
        trophyDesc(b) { return "Enemy Stun, Heal, & Agile abilities have a " + format(getTrophyEff(11, b).times(100)) + "% chance to fail" },
        trophyEff(x) { return Decimal.sub(1, Decimal.div(1, x.div(2).plus(1).log10().plus(1))) },
        sacEff(x) { return Decimal.sub(1, Decimal.div(1, x.div(5e8).plus(1).log10().plus(1).sqrt())) },
        sacReq: 5.12e8,
        stackType: "multAfter1"
    },
    12: {
        id: 12,
        name: "Tau Neutrino",
        hp: 47200,
        xp: 42000,
        dmg: 4000,
        spd: 1.5,
        img: "images/tau_neutrino.png",
        special: ["agile", "counter"],
        trophyDesc(b) { return "+" + format(getTrophyEff(12, b).sub(1).times(100)) + "% DMG when below 40% HP" },
        trophyEff(x) { return x.div(10).plus(1).log10().plus(1) },
        sacEff(x) { return x.div(1e9).plus(1).log10().plus(1).sqrt() },
        sacReq: 1e9,
        stackType: "mult"
    },
    13: {
        id: 13,
        name: "Gluon",
        hp: 122000,
        xp: 150000,
        dmg: 3000,
        spd: 2,
        img: "images/gluon.png",
        special: ["heal", "mutator", "counter"],
        trophyDesc(b) { return "Divide Enemy HP by " + format(getTrophyEff(13, b)) + ", but double Enemy SPD." },
        trophyEff(x) { return x.times(1.7).plus(1).log10().plus(1) },
        sacEff(x) { return x.times(2e9).plus(1).log10().plus(1).sqrt() },
        sacReq: 2e9,
        stackType: "mult"
    },
    14: {
        id: 14,
        name: "Photon",
        hp: 22000,
        xp: 33000,
        dmg: 2000,
        spd: 8,
        img: "images/photon.png",
        special: ["weaken", "stun"],
        trophyDesc(b) { return "+" + format(getTrophyEff(14, b).sub(1).times(100)) + "% SPD, but divide DMG by " + format(getTrophyEff(14, b).pow(2/3)) + "." },
        trophyEff(x) { return x.div(10).plus(1).log10().plus(1).pow(2) },
        sacEff(x) { return x.div(4e9).plus(1).log10().plus(1) },
        sacReq: 4e9,
        stackType: "mult"
    },
    15: {
        id: 15,
        name: "Higgs",
        hp: 999999,
        xp: "2e6",
        dmg: 500,
        spd: 1.5,
        img: "images/higgs.png",
        special: ["mutator", "strengthen"],
        trophyDesc(b) { return "+" + formatSmall(getTrophyEff(15, b).sub(1).times(100)) + "% XP & Trophy gain" },
        trophyEff(x) { return x.plus(1).log(4).plus(1) },
        sacEff(x) { return x.div(8e9).plus(1).log(7).plus(1).sqrt() },
        sacReq: 8e9,
        stackType: "mult"
    },
    16: {
        id: 16,
        name: "W Boson",
        hp: "1e14",
        xp: "3e14",
        dmg: "1.4e9",
        spd: 20,
        img: "images/w_boson.png",
        special: ["weaken", "extremist"],
        trophyDesc(b) { return "÷" + format(getTrophyEff(16, b)) + " Enemy DMG, but increase Enemy DMG by 10% when the enemy attacks." },
        trophyEff(x) { return x.div(2).plus(1).cbrt() },
        sacEff(x) { return x.div("2e10").plus(1).root(4) },
        sacReq: "1.6e10",
        stackType: "mult"
    },
    17: {
        id: 17,
        name: "Z Boson",
        hp: "4e14",
        xp: "1e15",
        dmg: "1.2e9",
        spd: 20,
        img: "images/z_boson.png",
        special: ["neutrality"],
        trophyDesc(b) { return "+" + format(getTrophyEff(17, b).sub(1).times(100)) + "% HP per Level (total: " + format(getTrophyEff(17, b).sub(1).times(level.value).plus(1).max(1)) + "x), but halve DMG." },
        trophyEff(x) { return x.times(1.4).plus(1).root(100) },
        sacEff(x) { return x.div("5e10").plus(1).root(1e3) },
        sacReq: "3.2e10",
        stackType: "mult"
    },
    18: {
        id: 18,
        name: "Up Antiquark",
        hp: "1.5e17",
        xp: "3e17",
        dmg: "5e9",
        spd: 75,
        img: "images/up_quark.png",
        special: ["agile", "strengthen"],
        mutates: 1,
        filter: "hue-rotate(180deg)",
        nameColor: "lightblue",
        trophyMult: "6e16"
    },
    19: {
        id: 19,
        name: "Strange Antiquark",
        hp: "7.5e17",
        xp: "1.5e18",
        dmg: "2e10",
        spd: 120,
        img: "images/strange_quark.png",
        special: ["weaken", "regenerator"],
        mutates: 4,
        filter: "hue-rotate(180deg)",
        nameColor: "lightblue",
        trophyMult: "6e16"
    }
};

export function fromEnemyData<K extends keyof EveryEnemyData>(id: number, prop: K): EveryEnemyData[K] | undefined {
    const data = ENEMY_DATA[id] as EveryEnemyData;
    return prop in data ? data[prop] : undefined;
}