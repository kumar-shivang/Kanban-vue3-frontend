<template>
  <div class="card">
    <div class="card-body">
      <form class="form" @submit="createCard">
        <label for="cardName">Card Name</label>
        <input
          type="text"
          class="form-control"
          v-model="cardName"
          id="cardName"
        />
        <label for="cardContent">Card Content</label>
        <textarea
          id="cardContent"
          class="form-control"
          v-model="cardContent"
        ></textarea>

        <label for="cardDeadline">Due Date</label>
        <input
          id="cardDeadline"
          type="date"
          class="form-control"
          v-model="cardDeadline"
          :min="today"
        />

        <label for="time">Time</label>
        <div id="time" class="input-group-sm d-flex flex-row">
          <div class="hour-input">
            <label for="hour">hour</label>
            <select
              id="hour"
              class="form-select form-select-sm"
              aria-label="Default select example"
              v-model="hour"
            >
              <option v-for="hour in 24" :key="hour">{{ hour - 1 }}</option>
            </select>
          </div>
          <div class="minute-input">
            <label for="minute">minute</label>
            <select
              id="minute"
              class="form-select form-select-sm"
              aria-label="Default select example"
              v-model="minute"
            >
              <option v-for="five_minute in 12" :key="five_minute">
                {{ 5 * (five_minute - 1) }}
              </option>
            </select>
          </div>
        </div>

        <input
          type="submit"
          class="btn btn-primary btn-sm m-1"
          value="Create"
        />
        <button class="btn btn-danger btn-sm m-1" @click="cancel">
          Cancel
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import useStore from "@/stores/counter";
export default {
  name: "cardCreationFrom.vue",
  setup() {
    const store = useStore();
    return { store };
  },
  data() {
    return {
      cardName: "",
      cardContent: "",
      cardDeadline: "",
      hour: 0,
      minute: 0,
      today: dayjs().format("YYYY-MM-DD"),
    };
  },
  props: {
    listID: {
      type: Number,
      required: true,
    },
  },
  emits: ["cancel"],
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    async createCard(submit) {
      submit.preventDefault();
      await fetch(`http://localhost:5000/card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.store.token,
        },
        body: JSON.stringify({
          title: this.cardName,
          content: this.cardContent,
          listID: this.listID,
          deadline: dayjs(this.cardDeadline)
            .add(this.hour, "hour")
            .add(this.minute, "minute")
            .unix(),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.store.addCard(this.listID, data.card);
        });
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
select {
  width: 50%;
  margin-left: 10%;
}
.hour-input,
.minute-input {
  display: inline-flex;
  flex-direction: row;
  width: 70%;
  justify-content: center;
  align-content: center;
}
.card {
  width: 90%;
  margin: 4%;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  border-radius: 3%;
  background-color: #fce8e8;
  min-height: 30%;
}
</style>
