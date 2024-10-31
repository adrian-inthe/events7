<template>
  <Message v-for="(error, id) in eventValidationErrors" :key="id" class="inline-block m-3" severity="error">
    <template #icon>
      <i class="pi pi-times-circle" />
    </template>
    <span class="capitalize">{{ error[0] }}</span>: {{ error[1] }}
  </Message>
  <Message v-if="eventCreationError" class="inline-block m-3" severity="error">
    <template #icon>
      <i class="pi pi-times-circle" />
    </template>
    {{ eventCreationError }}
  </Message>
</template>

<script lang="ts" setup>
import Message from "primevue/message"
import {useEventsStore} from "../store/eventsStore.ts";
import {computed} from "vue";

const eventValidationErrors = computed(() => useEventsStore().eventValidationErrors);
const eventCreationError = computed(() => useEventsStore().eventCreationError);
</script>
