<template>
  <DataTable ref="datatable" v-model:editingRows="editedEvents" v-model:selection="selectedEvents"
             :metaKeySelection="true" :value="events" class="nav"
             dataKey="id" editMode="row"
             selectionMode="multiple" stripedRows
             tableStyle="min-width: 50rem" @rowEditCancel="onRowEditCancel"
             @rowEditSave="onRowEditSave">
    <Column headerStyle="width: 3rem" selectionMode="multiple"></Column>
    <Column field="id" hidden />
    <Column field="name" header="Name">
      <template #editor="{ data, field }">
        <InputText v-model="data[field]"
                   :class="eventValidationErrors.find((e) => e[0] === 'name') ? '!border-red-500' : undefined"
                   :disabled="data.type === 'ads' && !canCreateAdsEvents"
                   placeholder="Name" />
      </template>
    </Column>
    <Column field="description" header="Description">
      <template #editor="{ data, field }">
        <InputText v-model="data[field]"
                   :class="eventValidationErrors.find((e) => e[0] === 'description') ? '!border-red-500' : undefined"
                   :disabled="data.type === 'ads' && !canCreateAdsEvents"
                   placeholder="Description" />
      </template>
    </Column>
    <Column field="type" header="Type">
      <template #editor="{ data, field }">
        <Select v-model="data[field]"
                :class="eventValidationErrors.find((e) => e[0] === 'name') ? '!border-red-500' : undefined"
                :disabled="data.type === 'ads' && !canCreateAdsEvents"
                :options="allowedEventTypes"
                placeholder="Type" />
      </template>
    </Column>
    <Column field="priority" header="Priority">
      <template #editor="{ data, field }">
        <Select v-model="data[field]" v-tooltip="'0 (low) to 10 (high)'"
                :class="eventValidationErrors.find((e) => e[0] === 'name') ? '!border-red-500' : undefined"
                :disabled="data.type === 'ads' && !canCreateAdsEvents"
                :options="eventPriorities"
                placeholder="Priority" />
      </template>
    </Column>
    <Column header="Actions" :rowEditor="true" bodyStyle="text-align:center" style="width: 5%; min-width: 8rem" />
  </DataTable>
</template>

<script lang="ts" setup>
import DataTable, {DataTableRowEditCancelEvent, DataTableRowEditSaveEvent} from 'primevue/datatable';
import Column from 'primevue/column';
import {useEventsStore} from '../store/eventsStore.ts';
import {computed, ref} from 'vue';
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import {ValidationError} from 'yup';
import {allowedEventTypes, Event7, Event7Keys, eventPriorities, getEvent7RowSchema} from "../store/utils/events7.ts";

const store = useEventsStore();
const datatable = ref();
const events = computed(() => store.events);
const eventValidationErrors = computed(() => store.eventValidationErrors);
const canCreateAdsEvents = computed(() => store.canCreateAdsEvents);
const editedEvents = computed({
  get: () => store.editedEvents,
  set: (value: []) => {
    store.setEditedEvents(value);
  }
});
const selectedEvents = computed({
  get: () => store.selectedEvents,
  set: (value: []) => {
    store.setSelectedEvents(value);
  }
});

async function onRowEditSave(e: DataTableRowEditSaveEvent) {
  const newData: Event7 = e.newData as Event7
  store.clearErrors()
  try {
    await (getEvent7RowSchema().validate(newData, {abortEarly: false}));
    await store.createOrUpdateEvent(newData)
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      store.setEventValidationErrors(
          error.inner
              .filter((validationError: ValidationError) => validationError.path && ['name', 'description', 'type', 'priority'].includes(validationError.path))
              .map((validationError: ValidationError) => [validationError.path as Event7Keys, validationError.message]));
      setEventEditable(newData)
    } else {
      console.error("Couldn't save datatable row", error)
      store.setEventCreationError("Couldn't save datatable row")
      setEventEditable(newData)
    }
  }
}

function setEventEditable(datatableRow: Event7) {
  store.setEditedEvents([...editedEvents.value, datatableRow]);
}

function onRowEditCancel(e: DataTableRowEditCancelEvent) {
  store.clearErrors()
  if (e.data.id === null) {
    store.removeUnsavedEvent()
  }
}
</script>
