<template>
  <div id="app">
    <div class="h-[100vh] flex gap-5 m-5">
      <DashboardNav />
      <main class="flex-1">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DashboardNav from "./components/DashboardNav.vue";
</script>

<style>
body {
  /* Outfit7's main font-family */
  font-family: O7TF Display, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;
}
</style>
