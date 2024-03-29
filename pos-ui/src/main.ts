import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';

import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-blue/theme.css';
import { createPinia } from 'pinia';

const app = createApp(App);

app.use(router);
app.use(PrimeVue);
app.use(createPinia());

app.mount('#app');
