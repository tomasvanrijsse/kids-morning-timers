<script setup>
import Timer from "@/components/Timer.vue";
</script>

<template>
  <main>
    <timer start="07:20" end="07:35">
      <img src="/get-dressed.png" alt="Get dressed">
    </timer>
    <timer start="07:35" end="07:50">
      <img src="/cereals.png" alt="Breakfast">
    </timer>
    <timer start="07:50" end="08:05">
      <img src="/lunchbox.png" alt="Lunchbox">
    </timer>
    <timer start="08:05" end="08:20">
      <img src="/shoe.png" alt="Put shoes on">
    </timer>
  </main>
</template>

<style scoped>
  main {
    width: 100vw;
  }
</style>
