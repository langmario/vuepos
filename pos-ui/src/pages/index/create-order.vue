<script lang="ts" setup>
import { directus, type Ingredient, type OrderItem, type Product } from '@/api/directus';
import { readItems, createItem } from '@directus/sdk';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';
import { computed, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const showTableDialog = ref(false);
const activeAccordionIdx = ref<number | null>(null);

const cart = ref<{ product: Product; quantity: number }[]>([]);
const cartTotal = computed(() =>
    cart.value.map((li) => Number(li.product.price) * li.quantity).reduce((sum, val) => sum + val, 0)
);

const categories = await directus.request(
    readItems('categories', {
        fields: ['*', { products: ['*', { ingredient: ['*'] }] }],
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

function getOptimisticStock(ingredient: Ingredient) {
    return cart.value.some((p) => (p.product.ingredient as Ingredient).id === ingredient.id)
        ? ingredient.stock -
              cart.value
                  .filter((lineItem) => (lineItem.product.ingredient as Ingredient).id === ingredient.id)
                  .map((lineItem) => (lineItem.product.ingredient_quantity ?? 1) * lineItem.quantity)
                  .reduce((aggr, curr) => aggr + curr, 0)
        : ingredient.stock;
}

function onReset() {
    cart.value = [];
    showTableDialog.value = false;
    activeAccordionIdx.value = null;
}

async function onOrder(table: string) {
    try {
        await directus.request(
            createItem('orders', {
                table: table,
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
        toast.add({ severity: 'success', summary: 'Bestellung aufgegeben', life: 2000 });
    } catch (error) {
        console.error('Error while sending order', error);
        for (const err of (error as any).errors) {
            toast.add({
                severity: 'error',
                summary: 'Fehler bei der Bestellung',
                detail: err.extensions.code,
                life: 5000,
            });
        }
    }
}
</script>

<template>
    <div class="grid grid-rows-[2fr_auto_3fr_auto] h-full divide-y overflow-hidden">
        <DataTable class="overflow-auto" :value="cart" striped-rows size="small">
            <template #empty>
                <div class="text-center opacity-50 text-sm">Keine Produkte ausgewählt</div>
            </template>
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
        <Accordion v-model:active-index="activeAccordionIdx" class="overflow-auto">
            <AccordionTab v-for="category of categories" :key="category.id" :header="category.name">
                <div class="grid grid-cols-2 gap-2 auto-rows-fr">
                    <Button
                        v-for="product of (category.products as Product[]).sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))"
                        class="flex flex-col items-center justify-center min-h-20"
                        :disabled="product.ingredient != null && getOptimisticStock(product.ingredient as Ingredient) < (product.ingredient_quantity ?? 1)"
                        @click="addToCart(product)"
                    >
                        <h2>{{ product.name }}</h2>
                        <div v-if="product.ingredient" class="text-xs opacity-50">
                            Noch {{ getOptimisticStock(product.ingredient as Ingredient) }}
                            {{ (product.ingredient as Ingredient).name }}
                        </div>
                    </Button>
                </div>
            </AccordionTab>
        </Accordion>
        <div class="grid grid-cols-2 gap-4 p-2">
            <Button
                class="font-bold text-lg flex justify-center"
                severity="danger"
                :disabled="cart.length === 0"
                @click="onReset"
            >
                RESET
            </Button>
            <Button
                class="font-bold text-lg flex justify-center"
                severity="success"
                :disabled="cart.length === 0"
                @click="showTableDialog = true"
            >
                ORDER
            </Button>
        </div>
    </div>
    <Dialog
        v-model:visible="showTableDialog"
        dismissableMask
        modal
        header="Tisch auswählen"
        class="w-11/12 max-w-[30rem]"
    >
        <div class="grid grid-cols-5 gap-x-1 gap-y-4">
            <Button class="flex justify-center" @click="onOrder('1')">1</Button>
            <Button class="flex justify-center" @click="onOrder('2')">2</Button>
            <div></div>
            <Button class="flex justify-center" @click="onOrder('3')">3</Button>
            <Button class="flex justify-center" @click="onOrder('4')">4</Button>
            <Button class="flex justify-center" @click="onOrder('5')">5</Button>
            <Button class="flex justify-center" @click="onOrder('6')">6</Button>
            <div></div>
            <Button class="flex justify-center" @click="onOrder('7')">7</Button>
            <Button class="flex justify-center" @click="onOrder('8')">8</Button>
            <Button class="flex justify-center" @click="onOrder('9')">9</Button>
            <Button class="flex justify-center" @click="onOrder('10')">10</Button>
            <div></div>
            <Button class="flex justify-center" @click="onOrder('11')">11</Button>
            <Button class="flex justify-center" @click="onOrder('12')">12</Button>
            <Button class="flex justify-center" @click="onOrder('13')">13</Button>
            <Button class="flex justify-center" @click="onOrder('14')">14</Button>
        </div>
        <div class="p-2 bg-zinc-200 rounded mt-4 text-center">Küche</div>
    </Dialog>
</template>
