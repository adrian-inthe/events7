<template>
  <div class="flex gap-2 mb-5">
    <Button v-tooltip="canCreateAdsEvents === null ? 'Please wait while we check your permissions…' : ''" :disabled="canCreateAdsEvents === null" icon="pi pi-plus" label="New event" outlined
            severity="secondary"
            @click="addNewEvent" />
    <Button v-tooltip="!selectedEvents || !selectedEvents.length ? 'Please select events' : ''" :disabled="!selectedEvents || !selectedEvents.length" icon="pi pi-trash" label="Delete" outlined
            severity="secondary"
            @click="deleteEvents" />
  </div>
  <div class="mb-5">
    <Tag :severity="canCreateAdsEvents === null ? 'secondary' : canCreateAdsEvents ? 'success' : 'danger'">
      <div v-if="canCreateAdsEvents === null"
           class="spinner border-2 border-t-transparent border-blue-500 rounded-full w-3 h-3 animate-spin"></div>
      <i v-else-if="canCreateAdsEvents" class="pi pi-check"></i>
      <i v-else class="pi pi-times"></i>
      Ads Type {{ !canCreateAdsEvents ? "Not " : "" }}Selectable
    </Tag>
  </div>
</template>

<script lang="ts" setup>
import Button from "primevue/button"
import Tag from "primevue/tag"
import {computed, nextTick, onMounted, ref} from "vue";
import {Event7} from "../store/utils/events7.ts";
import {useEventsStore} from '../store/eventsStore.ts';

const store = useEventsStore();
const datatable = ref();
const canCreateAdsEvents = computed(() => store.canCreateAdsEvents);
const editedEvents = computed(() => store.editedEvents);
const selectedEvents = computed(() => store.selectedEvents);

function addNewEvent() {
  if (editedEvents.value.find((editedEvent) => editedEvent.id === null)) {
    return;
  }
  const emptyEvent = store.addEmptyEvent()
  setEventEditable(emptyEvent)
  nextTick(focusInNewEventFirstInput);
}

function setEventEditable(datatableRow: Event7) {
  store.setEditedEvents([...editedEvents.value, datatableRow]);
}

function focusInNewEventFirstInput() {
  if (!datatable.value) {
    return
  }
  const inputElement = datatable.value.$el.querySelector('input[type="text"][value=""]')
  if (inputElement) {
    inputElement.focus();
  }
}

async function deleteEvents() {
  await store.deleteEvents(selectedEvents.value)
}

onMounted(async () => {
  try {
    await store.fetchUserAdsPermission()
  } catch (error) {
    console.error("Couldn't check Ads permission, permission denied", error);
  }
});
</script>
