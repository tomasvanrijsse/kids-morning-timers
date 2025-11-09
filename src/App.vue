<script setup>
import Timer from "@/components/Timer.vue";
import {computed, ref} from "vue";
import {dayTimestamp} from "@/helper.js";

const startTime = ref('07:15');
const endTime = ref('08:15');

const itsWednesday = new Date().getDay() === 4;

const tasks = ref([
  { name: 'Get dressed', 'image': './get-dressed.png', hidden: false },
  { name: 'Breakfast', 'image': './cereals.png', hidden: false },
  { name: 'Lunchbox', 'image': './lunchbox.png', hidden: itsWednesday },
  { name: 'Fruits', 'image': './fruits.png', hidden: !itsWednesday },
  { name: 'Put shoes on', 'image': './shoe.png', hidden: false },
])

const timers = computed(() => {
  const start = dayTimestamp(startTime.value.split(':')[0], startTime.value.split(':')[1])
  const end = dayTimestamp(endTime.value.split(':')[0], endTime.value.split(':')[1])

  let visibleTasks = tasks.value.filter((task) => { return task.hidden === false })

  let durationPerTaskInSeconds = (end - start) / visibleTasks.length;

  let timers = [];

  for (const [i, task] of visibleTasks.entries()) {
    timers.push({ ...task,
      startTime: start + (durationPerTaskInSeconds * i),
      durationInSeconds: durationPerTaskInSeconds,
    });
  }

  return timers;
});

const hideTimer = (timer) => {
  for (const [i, task] of tasks.value.entries()) {
    if(task.name !== timer.name) { continue }

    task.hidden = true;
  }
}

try {
  navigator.wakeLock.request("screen");
} catch (err) {
  // The Wake Lock request has failed - usually system-related, such as battery.
}

</script>

<template>
  <main>
    <div id="weather">
      <a class="weatherwidget-io" href="https://forecast7.com/nl/51d834d83/hardinxveld-giessendam/" data-mode="Current" data-theme="dark" >Hardinxveld-Giessendam, Netherlands</a>
    </div>
    <div id="timers">
      <timer v-for="timer in timers"
             :start="timer.startTime"
             :durationInSeconds="timer.durationInSeconds"
             @delete="hideTimer(timer)"
      >
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
      <ul id="hidden-tasks">
        <li v-for="task in tasks" v-show="task.hidden" @click="task.hidden = false">
         ← {{ task.name }}
        </li>
      </ul>
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

  #weather {
    position: absolute;
    width: 120px;
  }

  #settings {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    color: #777;
  }

  #settings .field {
    text-align: right;
  }
  #settings label {
    padding-right: 15px;
  }
  #settings input {
    width: 100px;
    color: #999;
    background-color: #333;
    border: 1px solid #777;
    border-radius: 5px;
    padding: 5px;
    font-size: 16px;
    font-family: Arial, sans-serif;
    text-align: center;
    cursor: pointer;
  }

  #hidden-tasks {
    list-style-type: none;
    padding: 0;
    margin: 0.5em;
  }

  #hidden-tasks li {
    text-align: right;
  }
</style>
