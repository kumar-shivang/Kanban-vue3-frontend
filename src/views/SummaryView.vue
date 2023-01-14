<template>
  <div class="d-flex flex-row flex-wrap" style="width: 100%">
    <div id="userSummary" style="width: 60%">
      <div class="card" style="height: 100%">
        <h2 class="card-title mx-auto">User Summary</h2>
        <div class="card-body">
          <div class="card-text">
            Total Cards: {{ totalCards }}
            <br />
            Active Cards: {{ currentlyActive }}
            <br />
            Completed Cards: {{ completedCards }}
            <br />
            Missed Cards: {{ deadlineMissed }}
          </div>
          <apexchart
            type="pie"
            :series="series"
            :options="chartOptions"
            style="width: 66%; height: 50%"
            class="card-img  mx-auto"
          ></apexchart>
        </div>
      </div>
    </div>
    <div id="listSummary" class="list-group">
      <div class="list-group-item-heading">List Summary</div>
      <div
        v-for="list in store.userData.userLists"
        :key="list.listID"
        class="chart"
      >
        <ListSummary
          :list-id="list.listID"
          :list-name="list.title"
          class="list-group-item"
        />
      </div>
    </div>
  </div>
</template>

<script>
import useStore from "@/stores/counter.js";
import ListSummary from "@/components/ListSummary.vue";
export default {
  setup() {
    const store = useStore();
    return { store };
  },
  name: "SummaryView.vue",
  components: { ListSummary },
  computed: {
    userLists() {
      return this.store.userLists;
    },
    totalCards() {
      return this.store.userSummary().totalCards;
    },
    totalLists() {
      return this.store.userSummary().totalLists;
    },
    completedCards() {
      return this.store.userSummary().completedCards;
    },
    deadlineMissed() {
      return this.store.userSummary().deadlineMissed;
    },
    currentlyActive() {
      return this.store.userSummary().currentlyActive;
    },
    series() {
      return [this.completedCards, this.deadlineMissed, this.currentlyActive];
    },
    chartOptions() {
      return {
        labels: [
          "Completed Cards",
          "Deadline Missed",
          "Currently Active Cards",
        ],
      };
    },
  },
  mounted() {
    this.store.getUser();
  },
};
</script>

<style scoped>
.list-group {
  width: 40%;
  overflow: scroll;
  max-height: 90vh;
}
.list-group-item-heading {
  color: black;
  background-color: white;
  width: 100%;
  position: sticky;
  top: 0;
  font-size: 2rem;
  z-index: 1;
  align-self: center;
  text-align: center;
  max-height: 15%;
}
.chart {
  width: 100%;
  height: 100%;
  border: #ff99ff solid 1px;
}
</style>
