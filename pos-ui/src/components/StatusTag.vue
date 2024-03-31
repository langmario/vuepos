<script lang="ts" setup>
import Tag from 'primevue/tag';
import { computed } from 'vue';

const props = defineProps<{
    status: 'pending' | 'ready-for-serving' | 'served' | 'paid';
}>();

const label = computed(() => {
    switch (props.status) {
        case 'paid':
            return 'Bezahlt';
        case 'pending':
            return 'In Zubereitung';
        case 'ready-for-serving':
            return 'Abholbereit';
        case 'served':
            return 'Serviert';
    }
});

const severity = computed(() => {
    switch (props.status) {
        case 'pending':
            return 'secondary';
        case 'ready-for-serving':
            return 'danger';
        case 'served':
            return 'info';
        case 'paid':
            return 'success';
    }
});
</script>

<template>
    <Tag :severity="severity" class="text-center">{{ label }}</Tag>
</template>
