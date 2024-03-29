<script lang="ts" setup>
import Tag from "primevue/tag";
import { computed } from "vue";

const props = defineProps<{
  status: "pending" | "ready-for-serving" | "served" | "paid";
}>();

const label = computed(() => {
  switch (props.status) {
    case "paid":
      return "Bezahlt";
    case "pending":
      return "Wartet";
    case "ready-for-serving":
      return "Bereit";
    case "served":
      return "Serviert";
  }
});

const severity = computed(() => {
  switch (props.status) {
    case "pending":
      return "secondary";
    case "ready-for-serving":
      return "warning";
    case "served":
      return "info";
    case "paid":
      return "success";
  }
});
</script>

<template>
  <Tag :severity="severity">{{ label }}</Tag>
</template>
