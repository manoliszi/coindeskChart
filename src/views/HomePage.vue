<template>
  <v-app>
    <v-snackbar
      v-model="snackbar"
      :color="'error'"
      :timeout="3000"
      density="compact"
    >
      <p style="margin-bottom: 0 !important;">
        There was an error while trying to fetch the bitcoin data. Please try again later
      </p>
    </v-snackbar>
    <user-profile />
    <v-card style="overflow: visible; z-index: 1">
      <v-card-title>Coindesk Data</v-card-title>
      <v-card-text>
        <v-container class="d-flex pb-0">
          <v-col cols="6">
            <date-picker
              id="dateFrom"
              v-model="dateFrom"
              placeholder="from"
              :label="'Date From'"
            />
          </v-col>
          <v-col cols="6">
            <date-picker
              id="dateTo"
              v-model="dateTo"
              placeholder="to"
              :label="'Date To'"
            />
          </v-col>
        </v-container>
        <line-chart
          :dates="chartData.dates"
          :prices="chartData.prices"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <app-button
          id="applyDates"
          :label="'Apply Dates'"
          variant="elevated"
          color="primary"
          @click="getCoinHistory"
        />
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<script setup>
import { useMainStore } from '../stores/index'
import {ref, computed} from 'vue';
import UserProfile from '@/components/UserProfile.vue';
import DatePicker from '@/components/DatePicker.vue';
import AppButton from "@/components/AppButton.vue";
import LineChart from "@/components/LineChart.vue";

const store = useMainStore()
const dateFrom = ref(Date.now())
const dateTo = ref(Date.now())
const snackbar = ref(false);

const chartData = computed(() => store.getChartData);

function formatToYYYYMMDD(input) {
    const date = new Date(input);
    return date.toISOString().split('T')[0]; // Extract YYYY-MM-DD
}

function calculateDateDifference(date1, date2) {
  const startDate = new Date(date1);
  const endDate = new Date(date2);

  if (isNaN(startDate) || isNaN(endDate)) {
    throw new Error("One or both of the dates are invalid.");
  }

  const timeDifference = endDate - startDate;
  const daysDifference = timeDifference / (1000 * 3600 * 24);
  return Math.abs(daysDifference) + 1; // Return the absolute difference in days
}

async function getCoinHistory() {
  let from = formatToYYYYMMDD(dateFrom.value);
  let to = formatToYYYYMMDD(dateTo.value);
  let limit = calculateDateDifference(from, to)
  let resp = await store.getBitcoinHistory(limit)
  if (!resp.ok) {
    snackbar.value = true
  }
}
</script>
