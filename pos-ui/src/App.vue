<template>
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
