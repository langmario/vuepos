<script lang="ts" setup>
import { directus, type OrderItem, type Product } from '@/api/directus';
import { readItems } from '@directus/sdk';
import { onMounted, ref } from 'vue';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import { format } from 'date-fns';
import { getStatusLabel, getStatusSeverity, orderItemCompareFn } from '@/util';
import StatusTag from '@/components/StatusTag.vue';
import { useSessionStorage } from '@vueuse/core';

async function getOrders() {
    return await directus.request(
        readItems('orders', {
            fields: ['*', { items: ['*', { product: ['*'] }] }],
            filter: { user_created: { _eq: '$CURRENT_USER' }, items: { status: { _neq: 'paid' } } },
            sort: ['date_created'],
        })
    );
}

type Orders = Awaited<ReturnType<typeof getOrders>>;

const orders = ref<Orders>();
const layout = useSessionStorage<'list' | 'grid'>('order-items-layout', 'list');

onMounted(async () => {
    orders.value = await getOrders();
});
</script>

<template>
    <div class="p-2 pb-8 overflow-auto h-full" v-if="orders">
        <DataView :value="orders" data-key="id">
            <template #header>
                <div class="flex justify-end">
                    <DataViewLayoutOptions v-model="layout" />
                </div>
            </template>
            <template #list="{ items }">
                <div class="grid divide-y mt-2">
                    <RouterLink
                        v-for="order in (items as Orders)"
                        :key="order.id"
                        :to="{ name: '//my-orders/[id]', params: { id: order.id } }"
                        class="py-4 flex items-start gap-4"
                    >
                        <div class="flex flex-col items-center text-center gap-1">
                            <div class="text-sm leading-none">Tisch</div>
                            <div class="text-2xl font-bold leading-none">{{ order.table }}</div>
                            <div class="font-bold leading-none">{{ format(order.date_created, 'HH:mm') }}</div>
                        </div>
                        <DataView
                            :value="(order.items as OrderItem[]).sort(orderItemCompareFn)"
                            :layout="layout"
                            data-key="id"
                            class="w-full"
                        >
                            <template #list="{ items }">
                                <DataTable :value="items" size="small" class="-mt-4">
                                    <Column field="product.name"></Column>
                                    <Column field="status" body-class="w-0">
                                        <template #body="{ data }">
                                            <StatusTag :status="data.status" class="-my-1 -mr-2" />
                                        </template>
                                    </Column>
                                </DataTable>
                            </template>
                            <template #grid="{ items }">
                                <div class="grid grid-cols-2 gap-2">
                                    <Tag
                                        v-for="item in (items as OrderItem[])"
                                        :key="item.id"
                                        class="text-center"
                                        :severity="getStatusSeverity(item.status)"
                                    >
                                        {{ (item.product as Product).name }}
                                    </Tag>
                                </div>
                            </template>
                        </DataView>
                    </RouterLink>
                </div>
            </template>
        </DataView>
    </div>
</template>
