<template>
  <List
    v-for="list in store.userData.userLists"
    :key="list.listID"
    :list_name="list.title"
    :listID="list.listID"
  >
    <Card
      v-for="card in list.cards"
      :key="card.cardID"
      :cardTitle="card.cardName"
      :cardText="card.content"
    ></Card>
  </List>
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
    async function getUser() {
      const response = await fetch("http://localhost:5000/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + document.cookie.split("=")[1],
        },
      });
      if (response.ok) {
        return await response.json();
      } else {
        console.log(response);
      }
    }
    getUser().then((data) => {
      this.store.setUser(data.user);
    });
  },
};
</script>

<style scoped></style>
