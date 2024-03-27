<template>
  <Suspense>
    <RouterView />
    <template #fallback>Loading...</template>
  </Suspense>
</template>

<style>
#app {
  height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}
</style>
