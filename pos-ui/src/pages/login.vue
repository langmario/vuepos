<script lang="ts" setup>
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { directus } from '@/api/directus';
import { ref } from 'vue';
import { useRouter } from 'vue-router/auto';

const router = useRouter();

const username = ref('');
const password = ref('');

const isLoading = ref(false);
const loginError = ref<Error>();

async function onLogin(username: string, password: string) {
    isLoading.value = true;
    try {
        await directus.login(username, password);
        console.log('token', await directus.getToken());
        await router.replace('/create-order');
    } catch (error) {
        console.error('Error while logging in', error);
        if (error instanceof Error) {
            loginError.value = error;
        }
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <form
        class="mx-auto w-full p-4 my-8 max-w-[30rem] border text-center space-y-4 bg-zinc-100 border-zinc-200 rounded-lg"
        @submit.prevent="onLogin(username, password)"
    >
        <InputText v-model="username" class="w-full" type="email" placeholder="Benutzer" />
        <InputText v-model="password" class="w-full" placeholder="Passwort" type="password" />
        <Button class="mx-auto" :loading="isLoading" type="submit">Login</Button>
        <p v-if="loginError">{{ loginError.message }}</p>
    </form>
</template>
