<script lang="ts" setup>
import { directus, type OrderItem } from '@/api/directus';
import { orderItemCompareFn } from '@/util';
import { onMounted } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router/auto';

import IconAdd from '~icons/carbon/add-alt';
import IconList from '~icons/carbon/list-boxes';
import IconPay from '~icons/carbon/money';

const router = useRouter();

onMounted(async () => {
    await directus.connect();
    const { subscription } = await directus.subscribe('order_items', {
        event: 'update',
        query: { filter: { user_created: { _eq: '$CURRENT_USER' }, status: { _eq: 'ready-for-serving' } } },
    });

    for await (const item of subscription) {
        if (item.event === 'update') {
            navigator.vibrate(1000);
        }
    }
});
</script>

<template>
    <div class="h-full grid grid-rows-[1fr_auto]">
        <main class="overflow-hidden">
            <Suspense>
                <RouterView />
                <template #fallback>Loading...</template>
            </Suspense>
        </main>
        <nav class="border grid grid-flow-col auto-cols-fr bg-slate-700 text-white">
            <RouterLink class="flex justify-center items-center p-3" to="/my-orders">
                <IconList font-size="1.4em" />
            </RouterLink>
            <RouterLink class="flex justify-center items-center p-3" to="/create-order">
                <IconAdd font-size="1.4em" />
            </RouterLink>
            <RouterLink class="flex justify-center items-center p-3" to="/checkout">
                <IconPay font-size="1.4em" />
            </RouterLink>
        </nav>
    </div>
</template>
