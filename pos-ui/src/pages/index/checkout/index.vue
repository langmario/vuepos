<script lang="ts" setup>
import Button from 'primevue/button';
</script>

<template>
    <div class="px-4 py-2 h-full flex flex-col justify-between">
        <h1 class="text-2xl mb-8 font-bold">Tisch auswählen</h1>
        <div class="grid grid-cols-5 gap-x-1 gap-y-10">
            <RouterLink :to="{ name: '//checkout/[table]', params: { table: 1 } }"
                ><Button class="flex justify-center text-2xl w-full">1</Button></RouterLink
            >
            <RouterLink :to="{ name: '//checkout/[table]', params: { table: 2 } }"
                ><Button class="flex justify-center text-2xl w-full">2</Button></RouterLink
            >
            <div></div>
            <RouterLink :to="{ name: '//checkout/[table]', params: { table: 3 } }"
                ><Button class="flex justify-center text-2xl w-full">3</Button></RouterLink
            >
            <RouterLink :to="{ name: '//checkout/[table]', params: { table: 4 } }"
                ><Button class="flex justify-center text-2xl w-full">4</Button></RouterLink
            >
            <RouterLink :to="{ name: '//checkout/[table]', params: { table: 5 } }"
                ><Button class="flex justify-center text-2xl w-full">5</Button></RouterLink
            >
            <RouterLink :to="{ name: '//checkout/[table]', params: { table: 6 } }"
                ><Button class="flex justify-center text-2xl w-full">6</Button></RouterLink
            >
            <div></div>
            <RouterLink :to="{ name: '//checkout/[table]', params: { table: 7 } }"
                ><Button class="flex justify-center text-2xl w-full">7</Button></RouterLink
            >
            <RouterLink :to="{ name: '//checkout/[table]', params: { table: 8 } }"
                ><Button class="flex justify-center text-2xl w-full">8</Button></RouterLink
            >
            <RouterLink :to="{ name: '//checkout/[table]', params: { table: 9 } }"
                ><Button class="flex justify-center text-2xl w-full">9</Button></RouterLink
            >
            <RouterLink :to="{ name: '//checkout/[table]', params: { table: 10 } }"
                ><Button class="flex justify-center text-2xl w-full">10</Button></RouterLink
            >
            <div></div>
            <RouterLink :to="{ name: '//checkout/[table]', params: { table: 11 } }"
                ><Button class="flex justify-center text-2xl w-full">11</Button></RouterLink
            >
            <RouterLink :to="{ name: '//checkout/[table]', params: { table: 12 } }"
                ><Button class="flex justify-center text-2xl w-full">12</Button></RouterLink
            >
            <RouterLink :to="{ name: '//checkout/[table]', params: { table: 13 } }"
                ><Button class="flex justify-center text-2xl w-full">13</Button></RouterLink
            >
            <RouterLink :to="{ name: '//checkout/[table]', params: { table: 14 } }"
                ><Button class="flex justify-center text-2xl w-full">14</Button></RouterLink
            >
            <div class="col-span-5 bg-zinc-100 h-12 grid place-content-center">Küche</div>
        </div>
    </div>
</template>
