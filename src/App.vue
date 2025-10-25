<script setup>
import Timer from "@/components/Timer.vue";
import {computed, ref} from "vue";
import {dayTimestamp} from "@/helper.js";

const startTime = ref('07:15');
const endTime = ref('08:15');

const tasks = ref([
  { name: 'Get dressed', 'image': './get-dressed.png' },
  { name: 'Breakfast', 'image': './cereals.png' },
  { name: 'Lunchbox', 'image': './lunchbox.png' },
  { name: 'Put shoes on', 'image': './shoe.png' },
])

const timers = computed(() => {
  const start = dayTimestamp(startTime.value.split(':')[0], startTime.value.split(':')[1])
  const end = dayTimestamp(endTime.value.split(':')[0], endTime.value.split(':')[1])

  let durationPerTaskInSeconds = (end - start) / tasks.value.length;

  let timers = [];

  for (const [i, task] of tasks.value.entries()) {
    timers.push({ ...task,
      startTime: start + (durationPerTaskInSeconds * i),
      durationInSeconds: durationPerTaskInSeconds,
    });
  }

  return timers;
});

</script>

<template>
  <main>
    <div id="timers">
      <timer v-for="timer in timers" :start="timer.startTime" :durationInSeconds="timer.durationInSeconds">
        <img :src="timer.image" :alt="timer.name">
      </timer>
    </div>
    <div id="settings">
      <div class="field">
        <label>Start Time</label>
        <input type="time" v-model="startTime">
      </div>
      <div class="field">
        <label>End Time</label>
        <input type="time" v-model="endTime">
      </div>
    </div>
  </main>
</template>

<style scoped>
  main #timers {
    margin: 0 auto;
    padding: 0.5rem;
    font-weight: normal;

    max-width: 100vh;
    width: 100vw;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
  }

  #settings {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
  }

  #settings .field {
    text-align: right;
  }
  #settings label {
    padding-right: 15px;
  }
  #settings input {
    width: 100px;
  }
</style>
