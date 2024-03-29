import type Tag from 'primevue/tag';
import type { OrderItem, Product } from './api/directus';

export function getStatusLabel(status: OrderItem['status']) {
    switch (status) {
        case 'paid': return 'Bezahlt';
        case 'pending': return 'Wartet';
        case 'ready-for-serving': return 'Bereit';
        case 'served': return 'Serviert';
    }
}

export function getStatusSeverity(status: OrderItem['status']): Tag['$props']['severity'] {
    switch (status) {
        case 'pending': return 'secondary'
        case 'ready-for-serving': return 'warning'
        case 'served': return 'info';
        case 'paid': return 'success';
    }
}

export function orderItemCompareFn(a: OrderItem, b: OrderItem): number {
    if (a.status === b.status) {
        return (a.product as Product).name.localeCompare((b.product as Product).name)
    } else if (a.status === 'pending') {
        return -1;
    } else if (b.status === 'pending') {
        return 1
    } else if (a.status === 'ready-for-serving') {
        return -1;
    } else if (b.status === 'ready-for-serving') {
        return 1;
    } else if (a.status === 'served') {
        return -1;
    } else if (b.status === 'served') {
        return 1;
    } else if (a.status === 'paid') {
        return -1;
    } else if (b.status === 'paid') {
        return 1;
    } else {
        return 0;
    }
}