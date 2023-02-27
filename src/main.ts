import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { loadGame } from './game/saveload'

loadGame();

createApp(App).mount('#app')