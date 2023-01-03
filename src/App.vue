<template>
  <header>
    <navbar></navbar>
  </header>
  <main class="d-flex flex-row justify-content-between flex-wrap">
    <RouterView></RouterView>
  </main>
  <footer></footer>
</template>

<script>
import useStore from "./stores/counter.js";
import navbar from "./components/navbar.vue";

export default {
  name: "App",
  components: {
    navbar,
  },
  props: {},
  data() {},
  computed: {},
  watch: {},
  methods: {},
};
</script>

<style scoped>
main {
  display: flex;
  flex-direction: row;
  min-height: 90vh;
}
</style>
