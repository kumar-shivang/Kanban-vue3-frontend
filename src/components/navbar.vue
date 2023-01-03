<template>
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
        <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="isLoggedIn">
          <li class="nav-item">
            <div class="nav-link">Summary</div>
          </li>
          <li class="nav-item">
            <div class="nav-link" @click="logout">
              Logout {{ store.username }}
            </div>
          </li>
          <li class="dropdown nav-item">
            <div
              class="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              data-bs-auto-close="true"
              aria-expanded="false"
            >
              Add New List
            </div>
            <ul class="dropdown-menu">
              <li>
                <form
                  class="form-control d-flex flex-column"
                  @submit="createNewList"
                >
                  <input
                    class="form-control form-control-sm mb-3"
                    type="text"
                    v-model="newListName"
                  />
                  <input
                    type="submit"
                    value="Create"
                    class="btn btn-primary btn-sm"
                  />
                </form>
              </li>
            </ul>
          </li>
          <!--More navbar items can be added here.-->
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import useStore from "../stores/counter.js";
export default {
  setup() {
    const store = useStore();
    return { store };
  },
  name: "nav_bar",
  data() {
    return {
      newListName: "",
    };
  },
  computed: {
    isLoggedIn() {
      return this.store.isLoggedIn;
    },
  },
  methods: {
    logout() {
      this.store.logout();
      this.$router.push("/login");
    },
    async createNewList(event) {
      event.preventDefault();
      const response = await fetch("http://localhost:5000/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.store.token}`,
        },
        body: JSON.stringify({
          title: this.newListName,
        }),
      });
      if (response.ok) {
        let data = await response.json();
        console.log(data);
        this.store.addList(data.list);
      }
      this.newListName = "";
    },
  },
};
</script>

<style scoped>
.navbar {
  background-color: #ff99ff;
  /*box-shadow:  0 8px 16px 0;*/
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
  border-radius: 3%;
}
.dropdown-menu,
form {
  background-color: #fad1d1;
}
form {
  border: none;
}
.dropdown-menu {
  border: none;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
}
</style>
