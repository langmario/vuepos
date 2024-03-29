<script lang="ts" setup>
import { directus, type OrderItem, type Product } from '@/api/directus';
import { readItems, createItem } from '@directus/sdk';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';
import { computed, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const cart = ref<{ product: Product; quantity: number }[]>([]);
const cartTotal = computed(() =>
    cart.value.map((li) => Number(li.product.price) * li.quantity).reduce((sum, val) => sum + val, 0)
);

const categories = await directus.request(
    readItems('categories', {
        fields: ['*', { products: ['*'] }],
        sort: ['sort'],
    })
);

function addToCart(product: Product) {
    if (cart.value.some((li) => li.product.id === product.id)) {
        cart.value.find((li) => li.product.id === product.id)!.quantity++;
    } else {
        cart.value.push({ product, quantity: 1 });
    }
}

function removeFromCart(product: Product) {
    const found = cart.value.find((li) => li.product.id === product.id);
    if (found === undefined) return;

    if (found.quantity > 1) {
        found.quantity--;
    } else {
        cart.value.splice(cart.value.indexOf(found), 1);
    }
}

function onReset() {
    cart.value = [];
}

async function onOrder() {
    try {
        await directus.request(
            createItem('orders', {
                table: '3',
                items: cart.value
                    .reduce<Product[]>(
                        (map, cur) => [...map, ...Array.from({ length: cur.quantity }, () => cur.product)],
                        []
                    )
                    .map(
                        (product) =>
                            ({
                                product: product.id,
                                price: product.price,
                            } as OrderItem)
                    ),
            })
        );

        onReset();
    } catch (error) {
        console.error('Error while sending order', error);
    }
}
</script>

<template>
    <div class="grid grid-rows-[2fr_auto_3fr_auto] h-full divide-y overflow-hidden">
        <DataTable class="overflow-auto" :value="cart" striped-rows size="small">
            <Column field="quantity" header="#" class="text-right w-0">
                <template #body="{ data, field }"> {{ data[field] }}x </template>
            </Column>
            <Column field="product.name" header="Produkt"></Column>
            <Column body-class="w-0">
                <template #body="slotProps">
                    <Button
                        class="-m-1"
                        type="button"
                        rounded
                        severity="danger"
                        size="small"
                        @click="removeFromCart(slotProps.data.product)"
                        >&times;</Button
                    >
                </template>
            </Column>
        </DataTable>
        <div class="bg-zinc-200 p-2 font-bold text-lg text-right flex justify-between">
            <span>TOTAL:</span>
            <span>{{ cartTotal }} €</span>
        </div>
        <Accordion :active-index="0" class="overflow-auto">
            <AccordionTab v-for="category of categories" :key="category.id" :header="category.name">
                <div class="grid grid-cols-2 gap-2 auto-rows-fr">
                    <Button
                        v-for="product of (category.products as Product[]).sort((a, b) => a.name.localeCompare(b.name))"
                        class="flex flex-col items-center justify-center min-h-20"
                        @click="addToCart(product)"
                    >
                        <h2>{{ product.name }}</h2>
                    </Button>
                </div>
            </AccordionTab>
        </Accordion>
        <div class="grid grid-cols-2 gap-4 p-2">
            <Button
                class="font-bold text-lg flex justify-center"
                severity="danger"
                :disabled="cart.length === 0"
                @click="cart = []"
            >
                RESET
            </Button>
            <Button
                class="font-bold text-lg flex justify-center"
                severity="success"
                :disabled="cart.length === 0"
                @click="onOrder"
            >
                ORDER
            </Button>
        </div>
    </div>
</template>
