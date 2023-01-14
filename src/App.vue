<template>
  <header>
    <navbar></navbar>
  </header>
  <main class="d-flex flex-row justify-content-start flex-wrap">
    <RouterView></RouterView>
  </main>
  <footer></footer>
</template>

<script>
import navbar from "./components/navbar.vue";

export default {
  name: "App",
  components: {
    navbar,
  },
};
</script>

<style scoped>
main {
  display: flex;
  flex-direction: row;
  min-height: 90vh;
}
</style>
