import './assets/main.css';
import 'primevue/resources/themes/aura-light-blue/theme.css';
import PrimeVue from 'primevue/config';
import { createRouter, createWebHistory } from 'vue-router/auto';

import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.use(PrimeVue);
app.use(
    createRouter({
        history: createWebHistory(),
    })
);
app.mount('#app');
