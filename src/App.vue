<script setup>
import Timer from "@/components/Timer.vue";
</script>

<template>
  <main>
    <timer start="07:15" end="07:30">
      <img src="/get-dressed.png" alt="Get dressed">
    </timer>
    <timer start="07:30" end="07:45">
      <img src="/cereals.png" alt="Breakfast">
    </timer>
    <timer start="07:45" end="08:00">
      <img src="/lunchbox.png" alt="Lunchbox">
    </timer>
    <timer start="08:00" end="08:15">
      <img src="/shoe.png" alt="Put shoes on">
    </timer>
  </main>
</template>

<style scoped>
  main {
    width: 100vw;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
  }
</style>
