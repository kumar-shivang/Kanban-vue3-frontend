<template>
  <form @submit="fetchToken">
    <div class="form-group, mb-4">
      <input
        type="text"
        name="username"
        placeholder="Username"
        class="form-control"
        v-model="username"
      />
    </div>
    <div class="form-group, mb-4">
      <input
        type="password"
        name="password"
        placeholder="password"
        class="form-control"
        v-model="password"
      />
    </div>
    <div class="d-grid gap-2 col-2 mx-auto">
      <button class="btn btn-primary" type="submit">Login</button>
    </div>
  </form>
</template>

<script>
import useStore from "../stores/counter.js";
// import $router from "../router/index.js";
export default {
  setup() {
    const store = useStore();
    return { store };
  },
  name: "LoginView",
  components: {},
  props: {},
  data() {
    return {
      username: "",
      password: "",
      isLoggedIn: this.store.isLoggedIn,
    };
  },
  methods: {
    async fetchToken(event) {
      event.preventDefault();
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        this.store.setToken(data.access_token);
        document.cookie = "access_token=" + data.access_token;
        console.log(data.access_token);
        this.$router.push("/");
      } else {
        console.log(response);
      }
    },
  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  width: 100%;
}
</style>
