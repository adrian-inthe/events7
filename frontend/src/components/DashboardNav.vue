<template>
  <Card>
    <template #content>
      <div class="flex flex-col items-center w-12">
        <img src="https://outfit7.com/favicon.png">
        <div class="py-4 cursor-pointer"><i class="pi pi-home"></i></div>
        <div class="py-4 cursor-pointer"><i class="pi pi-user"></i></div>
        <div class="py-4 cursor-pointer"><i class="pi pi-cog"></i></div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
import Card from "primevue/card"
</script>
