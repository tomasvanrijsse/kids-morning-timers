<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import {dayTimestamp} from "@/helper.js";
import { useTimerSounds } from '@/composables/useTimerSounds.js';

const showDeleteButton = ref(false);

const props = defineProps(['start','durationInSeconds']);

let tickInterval = null;
let percentage = ref(100);

const { checkWarnings, reset: resetSounds } = useTimerSounds();

watch([() => props.start, () => props.durationInSeconds], () => {
  resetSounds();
});

onMounted(() => {
  nextTick(() => {
    tickInterval = setInterval(() => {
      const currentTime = dayTimestamp(
          new Date().getHours(),
          new Date().getMinutes(),
          new Date().getSeconds(),
      )

      if(currentTime < props.start){
        percentage.value = 100;
        resetSounds();
        return
      }

      if(currentTime > props.start + props.durationInSeconds){
        percentage.value = 0;
        resetSounds();
        return
      }

      const end = props.start + props.durationInSeconds
      const remainingSeconds = end - currentTime;
      percentage.value = remainingSeconds / props.durationInSeconds * 100;

      checkWarnings(remainingSeconds);
    }, 1000);
  });
});

onBeforeUnmount(() => {
  clearInterval(tickInterval);
});
</script>

<template>
  <div class="circle-diagram" v-on:click="showDeleteButton = !showDeleteButton">
    <div class="center">
      <slot></slot>
    </div>
    <div class="delete" v-show="showDeleteButton" @click="$emit('delete')">
      <img src="/delete.png" alt="delete" />
    </div>
  </div>
</template>

<style>
.circle-diagram{
  --percent: v-bind(percentage);
  --degree: calc(360deg / 100 * var(--percent));
  --accent-color: hsl(var(--percent), 100%, 50%);
  width: 100%;
  aspect-ratio: 1;
  position: relative;
  border-radius: 50%;
  filter: drop-shadow(0 0.5rem .5rem rgb(0 0 0 / .5));
  display: grid;
  place-items: center;
  color: var(--accent-color);
  cursor: pointer;
}
.circle-diagram::before, .circle-diagram::after{
  content: "";
  position: absolute;
  border-radius: 50%;
  z-index: -1;
}
.circle-diagram::before{
  inset: 1em;
  background-color: var(--accent-color);
  background-image:
      radial-gradient(
          circle at calc(50% - 0.25rem) calc(50% + 0.25rem),
          rgb(0 0 0 / .25) 50%,
          transparent calc(50% + 0.5rem)
      ),
      conic-gradient(
          rgb(255 255 255 / .25) 0deg,
          rgb(0 0 0 / .25) var(--degree)
      ),
      conic-gradient(
          at calc(50% - 0.4rem) calc(50% + 0.4rem),
          transparent var(--degree),
          rgb(0 0 0 / .25) calc(var(--degree) + 5deg)
      );
}
.circle-diagram::after{
  inset: 0.9em;
  background-color: rgb(50 50 50);
  background-image: linear-gradient(transparent, rgb(0 0 0 / .5));
  --mask1: radial-gradient(black 50%, transparent calc(50% + 1px));
  --mask2: conic-gradient(transparent var(--degree), black calc(var(--degree) + .5deg));
  -webkit-mask-image: var(--mask1), var(--mask2);
  mask-image: var(--mask1), var(--mask2);
}

.circle-diagram img {
  width: 60%;
}

.circle-diagram .center {
  content: "";
  position: absolute;
  border-radius: 50%;
  background-color: white;
  inset: 18%;
  display: grid;
  place-items: center;
}

.delete {
  display: grid;
  width: 50px;
  height: 50px;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 50%;
  background-color: white;
  place-items: center;
}
</style>
