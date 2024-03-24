<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue';
import { RouterLink } from 'vue-router/auto';
</script>

<template>
  <AppHeader />
  <main class="container mx-auto px-4">
    <RouterView />
  </main>
  <nav class="border grid grid-flow-col auto-cols-fr text-center">
    <router-link class="py-4" to="/my-orders">MyOrders</router-link>
    <router-link class="py-4" to="/create-order">Create Order</router-link>
    <router-link class="py-4" to="/tables">Tables</router-link>
  </nav>
</template>

<style>
#app {
  height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}
</style>
