<template>
  <form class="form" @submit="updateCard">
    <label for="cardName">New Card Name</label>
    <input
      type="text"
      class="form-control"
      v-model="newCardName"
      id="cardName"
    />
    <label for="cardContent">New Card Content</label>
    <textarea
      id="cardContent"
      class="form-control"
      v-model="newCardContent"
    ></textarea>

    <label for="cardDeadline">New Due Date</label>
    <input
      id="cardDeadline"
      type="date"
      class="form-control"
      v-model="newCardDeadline"
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

    <input type="submit" class="btn btn-primary" value="Update" />
    <button class="btn btn-danger btn-sm m-1" @click="$emit(closeEdit)">
      Cancel
    </button>
    <span class="text-danger">{{ errorMsg }}</span>
  </form>
</template>

<script>
import dayjs from "dayjs";
import useStore from "@/stores/counter.js";

export default {
  name: "CardEditForm.vue",
  setup() {
    const store = useStore();
    return { store };
  },
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newCardName: this.card.cardName,
      newCardContent: this.card.content,
      newCardDeadline: this.card.deadline.format("YYYY-MM-DD"),
      hour: 0,
      minute: 0,
      errorMsg: "",
    };
  },
  emits: ["closeEdit"],
  methods: {
    async updateCard(event) {
      event.preventDefault();
      const response = await fetch("http://localhost:5000/card", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.store.access_token,
        },
        body: JSON.stringify({
          cardID: this.card.cardID,
          new_title: this.newCardName,
          new_content: this.newCardContent,
          new_deadline: dayjs(this.newCardDeadline)
            .add(this.hour, "hour")
            .add(this.minute, "minute")
            .unix(),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        this.store.updateCard(this.card.cardID, this.card.listID, data.card);
      } else {
        this.errorMsg = await response.json().error;
      }
      this.$emit("closeEdit");
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
</style>
