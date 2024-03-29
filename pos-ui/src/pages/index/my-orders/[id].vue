<script lang="ts" setup>
import { type OrderItem, directus } from '@/api/directus';
import { readItem, type DirectusUser, updateItem } from '@directus/sdk';
import { useRoute } from 'vue-router/auto';
import { format } from 'date-fns';
import Button from 'primevue/button';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import StatusTag from '@/components/StatusTag.vue';
import { orderItemCompareFn } from '@/util';
import { onMounted, ref } from 'vue';

const route = useRoute('//my-orders/[id]');

const order = ref(await directus.request(readItem('orders', route.params.id, {
    fields: ['*', { items: ['*', { product: ['*'] }], user_created: ['*'] }]
})))

const updatingOrderItemIds = ref<string[]>([]);

async function setOrderItemStatus(item_id: string, status: OrderItem['status']) {
    updatingOrderItemIds.value.push(item_id);
    try {
        await directus.request(updateItem('order_items', item_id, {
            status: status
        }));

        (order.value.items?.find(i => (i as OrderItem).id === item_id) as OrderItem).status = status;
    } catch (error) {

    } finally {
        updatingOrderItemIds.value.splice(updatingOrderItemIds.value.indexOf(item_id), 1);
    }
}
</script>

<template>
    <div class="p-4 h-full overflow-auto">
        <div class="flex justify-between mb-1 font-bold">
            <h1 class="text-2xl">Tisch {{ order.table }}</h1>
            <div class="text-xl">{{ format(order.date_created, 'HH:mm:ss') }} Uhr</div>
        </div>
        <h2 class="text-lg mb-4">{{ (order.user_created as
                DirectusUser<any>).first_name }} {{ (order.user_created as DirectusUser<any>).last_name }}</h2>

        <DataTable :value="(order.items as OrderItem[]).sort(orderItemCompareFn)" size="small">
            <Column header="Status" field="status" body-class="w-0">
                <template #body="{ data }">
                    <StatusTag :status="data.status" />
                </template>
            </Column>
            <Column header="Produkt" field="product.name"></Column>
            <Column header="Aktion" body-class="w-0">
                <template #body="{ data: item }">
                    <Button v-if="(item as OrderItem).status === 'ready-for-serving'" label="Abgeholt" size="small"
                        :disabled="updatingOrderItemIds.includes((item as OrderItem).id)"
                        @click="setOrderItemStatus((item as OrderItem).id, 'served')" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>