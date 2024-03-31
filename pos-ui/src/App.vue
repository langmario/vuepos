<script lang="ts" setup>
import Toast from 'primevue/toast';
</script>

<template>
    <Toast position="top-center" class="w-full px-1 max-w-96" />
    <Suspense>
        <RouterView />
        <template #fallback>Loading...</template>
    </Suspense>
</template>

<style>
#app {
    height: 100dvh;
}
</style>
