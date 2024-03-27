<script lang="ts" setup>
import AppHeader from '@/components/AppHeader.vue';
import { RouterLink, RouterView, useRouter } from 'vue-router/auto';
import { directus } from '@/api/directus';

const token = await directus.getToken()
if (token === null) {
    await useRouter().replace('/login')
}
</script>

<template>
    <AppHeader />
    <main class="container mx-auto px-4 overflow-hidden">
        <Suspense>
            <RouterView />
            <template #fallback>Loading...</template>
        </Suspense>
    </main>
    <nav class="border grid grid-flow-col auto-cols-fr text-center">
        <RouterLink class="py-4" to="/my-orders">MyOrders</RouterLink>
        <RouterLink class="py-4" to="/create-order">Create Order</RouterLink>
        <RouterLink class="py-4" to="/tables">Tables</RouterLink>
    </nav>
</template>
