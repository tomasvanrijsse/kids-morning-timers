<script>
import dayjs from "dayjs";
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

export default {
  props: ['start','end'],
  setup(props) {
    let tickInterval = null;
    let percentage = ref(100);

    const startTime = dayjs()
        .hour(props.start.split(':')[0])
        .minute(props.start.split(':')[1])
        .second(0);

    const endTime = dayjs()
        .hour(props.end.split(':')[0])
        .minute(props.end.split(':')[1])
        .second(0);

    onMounted(() => {
      nextTick(() => {
        tickInterval = setInterval(() => {
          const currentTime = dayjs()

          if(currentTime.isBefore(startTime)){
            return
          }

          if(currentTime.isAfter(endTime)){
            percentage.value = 0;
            clearInterval(tickInterval);
            return
          }

          percentage.value = (endTime.diff(currentTime) / (endTime.diff(startTime))) * 100;
        }, 100);
      });
    });

    onBeforeUnmount(() => {
      clearInterval(tickInterval);
    });

    return {
      percentage
    }
  },
};
</script>

<template>
  <div class="circle-diagram">
    <div class="center">
      <slot></slot>
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
</style>