<template>
  <div class="text-danger" v-if="errorMsg">
    Something went wrong, please login again.
  </div>
  <List
    v-for="list in store.userData.userLists"
    :key="list.listID"
    :list_name="list.title"
    :listID="list.listID"
  >
    <Card v-for="card in list.cards" :key="card.cardID" :card="card"></Card>
  </List>
  <h3 v-if="!store.userLists.length">
    Try adding some lists and cards to your board.
  </h3>
</template>

<script>
import useStore from "../stores/counter";
import List from "../components/List.vue";
import Card from "../components/Card.vue";
export default {
  setup() {
    const store = useStore();
    console.log("store setup");
    return { store };
  },
  data() {
    return {
      create_list: this.store.add_list,
      errorMsg: "",
    };
  },
  name: "HomeView",
  components: {
    List,
    Card,
  },
  props: {},
  beforeMount() {
    if (!this.store.isLoggedIn) {
      this.$router.push("/login");
    }
  },
  mounted() {
    this.store.getUser();
  },
};
</script>

<style scoped></style>
