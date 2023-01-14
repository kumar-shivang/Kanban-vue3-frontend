<template>
  <form @submit="fetchToken" class="form-control">
    <h2 class="mb-4">Login</h2>
    <label for="floatingInput" class="mb-1">Email address</label>
    <input
      type="text"
      name="username"
      placeholder="Username"
      class="form-control mb-3"
      v-model="username"
      id="floatingInput"
    />
    <label for="floatingPassword" class="mb-1">Password</label>
    <input
      type="password"
      name="password"
      placeholder="password"
      class="form-control mb-3"
      v-model="password"
      id="floatingPassword"
    />
    <div class="text-danger mb-4" v-if="errorMsg">
      {{ errorMsg }}
    </div>
    <button class="btn btn-primary btn-outline-light m-2" type="submit">Login</button>
    <button class="btn btn-light btn-outline-primary m-2" @click="$router.push('register')">
      Register
    </button>
  </form>
</template>

<script>
import useStore from "../stores/counter.js";
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
      errorMsg: "",
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
      if (response.ok) {
        if (response.status === 200) {
          const data = await response.json();
          this.store.setToken(data.access_token);
          document.cookie = "access_token=" + data.access_token;
          this.$router.push("/");
        }
      } else {
        const data = await response.json();
        this.errorMsg = data.error;
        console.log(this.errorMsg);
      }
    },
  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  padding: 3rem;
  width: 50%;
  margin: auto;
  height: 50%;
}
</style>
