<template>
  <Card class="my-5 nav p-5 rounded-xl">
    <template #content v-if="showEventsList">
      <EventsListHeader />
      <EventsListDatatable />
      <EventsListErrors />
    </template>
    <template #content v-else>
      <strong>Events list not available</strong>
    </template>
  </Card>
</template>

<script lang="ts" setup>
import Card from 'primevue/card';
import {useEventsStore} from '../store/eventsStore.ts';
import {onMounted, ref} from 'vue';
import EventsListErrors from "./EventsListErrors.vue";
import EventsListDatatable from "./EventsListDatatable.vue";
import EventsListHeader from "./EventsListHeader.vue";

const showEventsList = ref(false);

onMounted(async () => {
  try {
    await (useEventsStore()).fetchEvents();
    showEventsList.value = true;
  } catch (error) {
    console.warn("Didn't populate events list", error);
  }
});
</script>
