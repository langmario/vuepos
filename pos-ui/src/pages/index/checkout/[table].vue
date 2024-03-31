<script lang="ts" setup>
import { directus, type OrderItem, type Product } from '@/api/directus';
import { readItems, updateItems } from '@directus/sdk';
import { computed, onMounted, ref, shallowRef } from 'vue';
import { useRoute } from 'vue-router/auto';
import { format } from 'date-fns';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import StatusTag from '@/components/StatusTag.vue';

const route = useRoute('//checkout/[table]');

async function getOrderItems(table: string) {
    return await directus.request(
        readItems('order_items', {
            fields: ['*', { order: ['id'], product: ['name'], user_created: ['first_name', 'last_name'] }],
            filter: {
                status: {
                    _eq: 'served',
                },
                order: {
                    table: {
                        _eq: table,
                    },
                },
            },
            sort: ['date_created'],
        })
    );
}

async function getOrders(table: string) {
    return await directus.request(
        readItems('orders', {
            fields: ['*', { items: ['*', { product: ['*'] }], user_created: ['first_name', 'last_name'] }],
            filter: {
                table: {
                    _eq: table,
                },
                items: {
                    status: {
                        _eq: 'served',
                    },
                },
            },
            sort: ['date_created'],
        })
    );
}

function mapOrdersToItems(orders: Orders) {
    return orders
        .map((order) => [
            ...(order.items as OrderItem[]).map((item) => ({
                ...item,
                order: { ...order, items: undefined },
            })),
        ])
        .reduce((arr, cur) => [...arr, ...cur], [])
        .filter((i) => ['served', 'paid'].includes(i.status))
        .sort((a, b) => {
            return (
                a.order.date_created.localeCompare(b.order.date_created) ||
                (a.product as Product).name.localeCompare((b.product as Product).name)
            );
        });
}

type OrderItems = ReturnType<typeof mapOrdersToItems>;
type Orders = Awaited<ReturnType<typeof getOrders>>;

const orderItems = ref<OrderItems>();
const expandedOrderIds = ref();

const selectedOrderItems = ref<OrderItems>();

const selectionSum = computed(() => selectedOrderItems.value?.reduce((sum, item) => sum + Number(item.price), 0));

async function onPaySelected() {
    await directus.request(
        updateItems('order_items', selectedOrderItems.value?.map((oi) => oi.id) ?? [], { status: 'paid' })
    );
    for (const item of selectedOrderItems.value ?? []) {
        orderItems.value![orderItems.value!.indexOf(item)].status = 'paid';
    }

    selectedOrderItems.value = [];
}

onMounted(async () => {
    const orders = await getOrders(route.params.table);
    const items = mapOrdersToItems(orders);
    orderItems.value = items;
});
</script>

<template>
    <div class="overflow-auto h-full flex flex-col">
        <h1 class="text-2xl font-bold px-4 pt-2">Tisch {{ route.params.table }}</h1>
        <DataTable
            :value="orderItems"
            v-model:expanded-row-groups="expandedOrderIds"
            v-model:selection="selectedOrderItems"
            class="grow overflow-auto pb-8"
            expandable-row-groups
            group-rows-by="order.id"
            selectionMode="multiple"
            row-group-mode="subheader"
            size="small"
            :row-class="(data) => ({ 'line-through': data.status === 'paid', 'opacity-50': data.status === 'paid' })"
        >
            <template #empty>
                <div class="text-center opacity-50 text-sm">
                    <p>Keine abrechenbare Bestellungen für Tisch {{ route.params.table }}</p>
                    <p>Sind die Produkte 'serviert'?</p>
                </div>
            </template>
            <template #groupheader="{ data }">
                <span class="font-bold"
                    >{{ format(data.order.date_created, 'HH:mm') }} -
                    {{ data.order.user_created.first_name }}
                    {{ data.order.user_created.last_name }}
                </span>
            </template>
            <Column field="order.id"></Column>
            <Column field="product.name" header="Produkt"></Column>
            <Column field="price" header="€" class="w-0">
                <template #body="{ data }">
                    <span>{{ data.price }}&nbsp;€</span>
                </template>
            </Column>
            <Column field="status" header="Status" class="w-0">
                <template #body="{ data }">
                    <StatusTag :status="data.status" />
                </template>
            </Column>
        </DataTable>
        <div class="flex items-center bg-zinc-100 p-2 gap-4">
            <Button :disabled="!selectedOrderItems?.length" @click="onPaySelected">Bezahlen</Button>
            <div class="flex justify-between items-center grow font-bold">
                <div>TOTAL</div>
                <div class="text-2xl">{{ selectionSum?.toFixed(2) ?? '-' }} €</div>
            </div>
        </div>
    </div>
</template>
