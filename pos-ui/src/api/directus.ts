import {
  createDirectus,
  rest,
  authentication,
  type AuthenticationStorage,
  type AuthenticationData,
  type DirectusUser,
} from '@directus/sdk';

class AuthStorage implements AuthenticationStorage {
  get() {
    return JSON.parse(sessionStorage.getItem('auth')!) as AuthenticationData;
  }
  set(data: AuthenticationData | null) {
    sessionStorage.setItem('auth', JSON.stringify(data));
  }
}

const authStorage = new AuthStorage();

export const directus = createDirectus<Schema>('http://localhost:8055')
  .with(authentication('json', { storage: authStorage }))
  .with(rest());

export interface Schema {
  categories: Category[];
  ingredients: Ingredient[];
  products: Product[];
  order_items: OrderItem[];
  orders: Order[];
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
  price: string;
  category: string | Category;
  ingredient: string | Ingredient | null;
  ingredient_quantity: number | null;
}

export interface OrderItem {
  id: string;
  status: string;
  user_created: string | DirectusUser<{}>;
  date_created: 'datetime';
  product: string | Product;
  price: string;
  order: string | Order;
}

export interface Order {
  id: string;
  date_created: 'datetime';
  user_created: string | DirectusUser<{}>;
  table: string;
  items: string[] | OrderItem[]
}
