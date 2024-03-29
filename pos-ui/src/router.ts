import { createRouter, createWebHistory } from 'vue-router/auto';
import { directus } from './api/directus';

export const router = createRouter({
  history: createWebHistory(),
});

router.beforeEach(async (to) => {
  if (to.path === '/login') {
    return true;
  }

  return (await directus.getToken()) != null || '/login'
})
