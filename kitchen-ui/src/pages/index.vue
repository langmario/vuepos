<script setup lang="ts">
import Button from 'primevue/button';
import { directus, type Product, type Order, type OrderItem } from '@/directus';
import { readItems, type DirectusUser, updateItem } from '@directus/sdk';
import Panel from 'primevue/panel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import Tag from 'primevue/tag';
import { onMounted, ref } from 'vue';
import { format, formatDistance } from 'date-fns';
import { de } from 'date-fns/locale';
import { useRouteQuery } from '@vueuse/router';
import bingAudio from '@/assets/ding-126626.mp3?url';

const bing = new Audio(bingAudio);

async function getOrderItems() {
    return await directus.request(
        readItems('order_items', {
            fields: ['*', { order: ['*'], user_created: ['first_name', 'last_name'], product: ['*'] }],
            filter: { product: { is_selfservice: { _eq: false } }, status: { _nin: ['paid', 'served'] } },
            sort: ['date_created'],
        })
    );
}
type OrderItems = Awaited<ReturnType<typeof getOrderItems>>;

async function setItemStatus(item_id: string, status: OrderItem['status']) {
    try {
        updatingIds.value.push(item_id);
        await directus.request(updateItem('order_items', item_id, { status: status }));
        orderItems.value![orderItems.value!.findIndex((i) => i.id === item_id)].status = status;
    } catch (error) {
        console.error('Error while updating', error);
    } finally {
        updatingIds.value.splice(updatingIds.value.indexOf(item_id), 1);
    }
}

function groupItems(orderItems: OrderItems) {
    return orderItems
        .reduce<Array<{ product: Product; items: OrderItem[] }>>((arr, cur) => {
            if (arr.some((el) => el.product.id === (cur.product as Product).id)) {
                arr.find((el) => el.product.id === (cur.product as Product).id)?.items.push(cur as OrderItem);
            } else {
                arr.push({ product: cur.product as Product, items: [cur as OrderItem] });
            }
            return arr;
        }, [])
        .sort((a, b) => (a.product.sort ?? 0) - (b.product.sort ?? 0));
}

const orderItems = ref<OrderItems>();
const layout = useRouteQuery<'list' | 'grid'>('layout', 'list', { mode: 'replace' });
const updatingIds = ref<string[]>([]);
const lastTimeUpdate = ref<number>();

onMounted(async () => {
    orderItems.value = await getOrderItems();
    lastTimeUpdate.value = Date.now();
    setInterval(() => (lastTimeUpdate.value = Date.now()), 1000);

    const { subscription, unsubscribe } = await directus.subscribe('order_items', {
        event: 'create',
        query: {
            filter: {
                product: {
                    is_selfservice: {
                        _eq: false,
                    },
                },
            },
        },
    });

    for await (let update of subscription) {
        if (update.event === 'create') {
            console.log(update);
            bing.play();
            orderItems.value = await getOrderItems();
        }
    }
});
</script>

<template>
    <DataView :value="orderItems" :layout="layout" data-key="id">
        <template #header>
            <div class="flex items-center justify-between">
                <div :key="lastTimeUpdate" class="text-2xl">{{ format(new Date(), 'HH:mm') }}</div>
                <DataViewLayoutOptions v-model="layout" />
            </div>
        </template>
        <template #empty>
            <div class="p-4 text-center">Keine Bestellungen, alles erledigt 🙂</div>
        </template>
        <template #list="{ items }">
            <div class="divide-y h-full overflow-auto">
                <table class="w-full">
                    <tr
                        v-for="item of (items as OrderItems)"
                        :key="item.id"
                        :class="[item.status === 'served' && 'line-through opacity-40']"
                    >
                        <td class="p-2 font-bold text-4xl text-right border-b w-0">
                            {{ (item.order as Order).table }}
                        </td>
                        <td class="p-2 border-b">
                            <div class="flex flex-col">
                                <span class="font-bold">{{ (item.product as Product).name }}</span>
                                <span class="text-sm opacity-75" :key="lastTimeUpdate">
                                    {{ formatDistance(item.date_created, Date.now(), { locale: de, addSuffix: true }) }}
                                    -
                                    {{ format(item.date_created, 'HH:mm') }} Uhr
                                </span>
                            </div>
                        </td>
                        <td class="p-2 border-b">{{ (item.user_created as DirectusUser<{}>).first_name }}</td>
                        <td class="p-2 border-b w-0">
                            <Tag v-if="item.status === 'pending'" class="w-full" severity="danger">Wartet</Tag>
                            <Tag v-if="item.status === 'ready-for-serving'" class="w-full" severity="success"
                                >Abholbereit</Tag
                            >
                            <Tag v-if="item.status === 'served'" class="w-full" severity="warning">Abgeholt</Tag>
                        </td>
                        <td class="p-2 border-b w-0">
                            <Button
                                class="w-full flex justify-center"
                                v-if="item.status === 'pending'"
                                severity="danger"
                                :loading="updatingIds.includes(item.id)"
                                @click="setItemStatus(item.id, 'ready-for-serving')"
                            >
                                Bereit
                            </Button>
                            <Button
                                class="w-full flex justify-center"
                                v-if="item.status === 'ready-for-serving'"
                                severity="success"
                                :loading="updatingIds.includes(item.id)"
                                @click="setItemStatus(item.id, 'served')"
                            >
                                Abgeholt
                            </Button>
                        </td>
                    </tr>
                </table>
            </div>
        </template>
        <template #grid="{ items: orderItems }">
            <div class="p-4 grid grid-cols-[repeat(auto-fit,minmax(min(100%,25rem),1fr))] gap-4 overflow-auto h-full">
                <Panel v-for="{ product, items } in groupItems(orderItems)" :key="product.id" :header="product.name">
                    <DataTable
                        :value="items"
                        size="small"
                        :row-class="(data) => [data.status === 'served' && 'line-through opacity-40']"
                    >
                        <Column header="Von" field="date_created">
                            <template #body="{ data }">{{ format(data.date_created, 'HH:mm') }}</template>
                        </Column>
                        <Column field="user_created.first_name" />
                        <Column header="Tisch" field="order.table" class="w-0 text-center" />
                        <Column header="Status" field="status" class="w-0" header-class="text-center">
                            <template #body="{ data }">
                                <Tag v-if="data.status === 'pending'" class="w-full" severity="danger">Wartet</Tag>
                                <Tag v-if="data.status === 'ready-for-serving'" class="w-full" severity="success"
                                    >Abholbereit</Tag
                                >
                                <Tag v-if="data.status === 'served'" class="w-full" severity="warning">Abgeholt</Tag>
                            </template>
                        </Column>
                        <Column class="w-0">
                            <template #body="{ data }">
                                <Button
                                    class="w-full flex justify-center"
                                    v-if="data.status === 'pending'"
                                    severity="danger"
                                    :loading="updatingIds.includes(data.id)"
                                    @click="setItemStatus(data.id, 'ready-for-serving')"
                                >
                                    Bereit
                                </Button>
                                <Button
                                    class="w-full flex justify-center"
                                    v-if="data.status === 'ready-for-serving'"
                                    severity="success"
                                    :loading="updatingIds.includes(data.id)"
                                    @click="setItemStatus(data.id, 'served')"
                                >
                                    Abgeholt
                                </Button>
                            </template>
                        </Column>
                    </DataTable>
                </Panel>
            </div>
        </template>
    </DataView>
</template>

<style>
.p-dataview {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.p-dataview-content {
    flex-grow: 1;
    overflow: hidden;
}
</style>
