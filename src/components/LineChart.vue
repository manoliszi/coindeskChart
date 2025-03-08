<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title class="text-h5">
        Bitcoin Price History
      </v-card-title>

      <v-divider class="my-3" />

      <apexchart
        type="line"
        height="350"
        :options="chartOptions"
        :series="series"
      />
    </v-card>
  </v-container>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  prices: {type: Array, required: true, default: null},
  dates: {type: Array, required: true, default: null},
})

const chartOptions = computed(() => ({
  chart: {
    type: "line",
    zoom: { enabled: true },
  },
  xaxis: {
    categories: props.dates,
    title: { text: "Date" },
  },
  yaxis: {
    title: { text: "Price (USD)" },
    labels: { formatter: (value) => `$${value.toFixed(2)}` },
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  markers: {
    size: 4,
  },
  tooltip: {
    x: { format: "yyyy-MM-dd" },
  },
}));

const series = computed(() => [
  {
    name: "Bitcoin Price (USD)",
    data: props.prices,
  },
]);
</script>

<style scoped>

</style>
