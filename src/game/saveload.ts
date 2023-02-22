import { gameLoop, offGameLoop } from "./loop";
import { getStartPlayer, player } from "./playerControl";

const LOCALSTORAGE_ID = "particleTower";

export function loadGame() {
	let get = localStorage.getItem(LOCALSTORAGE_ID);
	if (get) Object.assign(player, JSON.parse(atob(get)));
	
	setInterval(function() { gameLoop(0.05) }, 50);
	setInterval(function() { offGameLoop(player.offProd ? Math.max((new Date().getTime() - (player.currTime ?? new Date().getTime()))/1000, 0) : 0.05) }, 50);
	setInterval(function() { if (player.autosave) save(); }, 2500);
}

export function save() {
	localStorage.setItem(LOCALSTORAGE_ID, btoa(JSON.stringify(player)));
}

export function importSave() {
	let data = prompt("Paste save data: ")
	if (data===undefined||data===null||data=="") return;
	try {
		Object.assign(player, JSON.parse(atob(data)));
		save()
		window.location.reload();
	} catch(e) {
		console.log("Import failed!");
		console.error(e);
		return;
	}
}

export function exportSave() {
	let str = btoa(JSON.stringify(player))
	
	const el = document.createElement("textarea");
	el.value = str;
	document.body.appendChild(el);
	el.select();
    el.setSelectionRange(0, 99999);
	document.execCommand("copy");
	document.body.removeChild(el);
}


export function hardReset() {
	if (!confirm("Are you sure you want to reset everything???")) return;
	Object.assign(player, getStartPlayer());
	save();
	window.location.reload();
}