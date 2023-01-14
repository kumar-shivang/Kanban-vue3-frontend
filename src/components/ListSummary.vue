<template>
  <div class="card">
    <h3 class="card-title text-center">{{ listName }}</h3>
    <div class="card-body">
      <div class="card-text">
        Total Cards: {{ totalCards }}
        <br />
        Incomplete Cards: {{ incompleteCards }}
        <br />
        Completed Cards: {{ completedCards }}
      </div>
      <apexchart
        :series="series"
        type="bar"
        :options="chartOptions"
        class="card-img"
      ></apexchart>
    </div>
  </div>
</template>

<script>
import useStore from "@/stores/counter";
export default {
  setup() {
    const store = useStore();
    return { store };
  },
  name: "ListSummary.vue",
  props: {
    listId: {
      type: Number,
      required: true,
    },
    listName: {
      type: String,
      required: true,
    },
  },
  computed: {
    totalCards() {
      return this.store.listSummary(this.listId).total;
    },
    completedCards() {
      return this.store.listSummary(this.listId).completed;
    },
    incompleteCards() {
      return this.store.listSummary(this.listId).incomplete;
    },
    summary() {
      return this.store.listSummary(this.listId);
    },

    series() {
      return [
        {
          data: this.summary.createdCards,
          name: "Created Cards",
        },
        {
          data: this.summary.completedCards,
          name: "Completed Cards",
        },
        {
          data: this.summary.missedCards,
          name: "Missed Cards",
        },
      ];
    },
    chartOptions() {
      return {
        chart: {
          type: "bar",
          height: 430,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            dataLabels: {
              position: "top",
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetX: -6,
          style: {
            fontSize: "12px",
            colors: ["#fff"],
          },
        },
        stroke: {
          show: true,
          width: 1,
          colors: ["#fff"],
        },
        tooltip: {
          shared: true,
          intersect: false,
        },
        xaxis: {
          categories: this.summary.xAxis,
        },
        colors: ["#6600ff", "#66ff66", "#ff1a1a"],
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          opacity: 0.5,
        },
      };
    },
  },
};
</script>

<style scoped></style>
