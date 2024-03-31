<script lang="ts" setup>
import { onMounted } from 'vue';
import { directus } from './directus';

onMounted(async () => {
    const websocketConnectResponse = await directus.connect();
    console.log('Realtime connection established', websocketConnectResponse);
});
</script>

<template>
    <RouterView />
</template>

<style>
#app {
    height: 100vh;
}
</style>
