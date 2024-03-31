<script setup lang="ts">
import Button from 'primevue/button';
import { directus, type Product, type Order, type OrderItem } from '@/directus';
import { readItems, type DirectusUser, updateItem } from '@directus/sdk';
import Card from 'primevue/card';
import Panel from 'primevue/panel';
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
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
    return orderItems.reduce<Array<{ product: Product; items: OrderItem[] }>>((arr, cur) => {
        if (arr.some((el) => el.product.id === (cur.product as Product).id)) {
            arr.find((el) => el.product.id === (cur.product as Product).id)?.items.push(cur as OrderItem);
        } else {
            arr.push({ product: cur.product as Product, items: [cur as OrderItem] });
        }
        return arr;
    }, []);
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
    <DataView :value="orderItems" :layout="layout" data-key="id" class="h-full overflow-hidden">
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
            <div class="divide-y overflow-auto">
                <table class="w-full">
                    <tr v-for="item of (items as OrderItems)" :key="item.id">
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
                            <Button
                                class="w-full flex justify-center"
                                v-if="item.status === 'pending'"
                                severity="success"
                                :loading="updatingIds.includes(item.id)"
                                @click="setItemStatus(item.id, 'ready-for-serving')"
                            >
                                Bereit
                            </Button>
                            <Button
                                class="w-full flex justify-center"
                                v-if="item.status === 'ready-for-serving'"
                                severity="warning"
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
            <div class="p-4">
                <Panel v-for="{ product, items } in groupItems(orderItems)" :key="product.id" :header="product.name">
                    <ul>
                        <li v-for="item in items">{{ (item.user_created as DirectusUser<{}>).first_name }}</li>
                    </ul>
                </Panel>
            </div>
        </template>
    </DataView>
</template>

<style>
#app {
    height: 100%;
    overflow: hidden;
}
</style>
