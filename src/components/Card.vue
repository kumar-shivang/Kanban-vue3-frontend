<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">{{ cardTitle }}</h5>
      <div class="card-text">{{ cardText }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardView",
  props: {
    cardTitle: {
      type: String,
      required: true,
    },
    cardText: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.card {
  width: 90%;
  margin: 4%;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  border-radius: 3%;
  background-color: #fce8e8;
}
</style>
