import './assets/main.css';
import 'primevue/resources/themes/aura-light-blue/theme.css';

import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import { createPinia } from 'pinia';

const app = createApp(App);

app.use(router);
app.use(PrimeVue);
app.use(createPinia());
app.use(ToastService);

app.mount('#app');
