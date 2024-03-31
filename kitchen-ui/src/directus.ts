import { createDirectus, rest, staticToken, realtime, type DirectusUser } from '@directus/sdk';

export const directus = createDirectus<Schema>(import.meta.env.VITE_DIRECTUS_HOST)
    .with(staticToken(import.meta.env.VITE_DIRECTUS_TOKEN))
    .with(rest())
    .with(realtime());

export interface Schema {
    categories: Category[];
    ingredients: Ingredient[];
    products: Product[];
    order_items: OrderItem[];
    orders: Order[];
    directus_users: DirectusUser<any>;
}

export interface Category {
    id: string;
    sort: number;
    name: string;
    products: string[] | Product[];
}

export interface Ingredient {
    id: string;
    name: string;
    stock: number;
}

export interface Product {
    id: string;
    status: string;
    name: string;
    price: string | number;
    category: string | Category;
    ingredient: string | Ingredient | null;
    ingredient_quantity: number | null;
    sort: number | null;
    is_selfservice: boolean;
}

export interface OrderItem {
    id: string;
    status: 'pending' | 'ready-for-serving' | 'served' | 'paid';
    user_created: string | DirectusUser<Schema>;
    date_created: 'datetime';
    product: string | Product;
    price: string | number;
    order: string | Order;
}

export interface Order {
    id: string;
    date_created: 'datetime';
    user_created: string | DirectusUser<Schema>;
    table: string;
    items: string[] | OrderItem[];
}
