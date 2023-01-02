<template>
  <header>
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Kanban</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        ></button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="store.isLoggedIn">
            <li class="nav-item">
              <div class="nav-link">Summary</div>
            </li>
            <li class="nav-item">
              <div class="nav-link" @click="logout">
                Logout {{ store.username }}
              </div>
            </li>
            <li class="nav-item">
              <div class="nav-link">Add A List</div>
            </li>
            <!--More navbar items can be added here.-->
          </ul>
        </div>
      </div>
    </nav>
  </header>
  <main class="d-flex flex-row justify-content-between flex-wrap">
    <RouterView></RouterView>
  </main>
  <footer></footer>
</template>

<script>
import useStore from "./stores/counter.js";
// import $router from "./router/index.js";

export default {
  setup() {
    const store = useStore();
    console.log("store created at app");
    return { store };
  },
  name: "App",
  // components: {
  //   LoginView,
  //   HomeView,
  // }
  props: {},
  data() {
    return {
      isLoggedIn: this.store.isLoggedIn,
    };
  },
  computed: {},
  watch: {
    // isLoggedIn(yes) {
    //   if (yes) {
    //     $router.push("/");
    //   } else {
    //     $router.push("/login");
    //   }
    // },
  },
  methods: {
    logout() {
      this.store.logout();
      this.$router.push("/login");
    },
  },
  components: {},
};
</script>

<style scoped>
.navbar {
  background-color: #ff99ff;
  /*box-shadow:  0 8px 16px 0;*/
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
  border-radius: 3%;
}
main {
  display: flex;
  flex-direction: row;
  min-height: 90vh;
}
</style>
