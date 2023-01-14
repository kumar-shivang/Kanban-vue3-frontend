<template>
  <form>
    <h2 class="mb-4">Register</h2>
    <label for="username" class="mb-1">Username</label>
    <input
      type="text"
      id="username"
      class="form-control mb-3"
      v-model="username"
    />
    <div class="alert alert-danger m-1" v-if="username_errorMsg">
      {{ username_errorMsg }}
    </div>
    <label for="password" class="mb-1">Password</label>
    <input
      type="password"
      id="password"
      class="form-control mb-3"
      v-model="password"
    />
    <label for="password2" class="mb-1">Confirm Password</label>
    <input
      type="password"
      id="password2"
      class="form-control mb-3"
      v-model="password2"
    />
    <div class="alert alert-danger m-1" v-if="password_errorMsg">
      {{ password_errorMsg }}
    </div>
    <button type="submit" class="btn btn-primary m-2" @click="register">
      Register
    </button>

    <button class="btn btn-outline-danger m-1" @click="cancel">Cancel</button>
  </form>
</template>

<script>
import validate from "validate.js";
export default {
  name: "RegisterView.vue",
  data() {
    return {
      username: "",
      password: "",
      password2: "",
      username_errorMsg: "",
      password_errorMsg: "",
    };
  },
  methods: {
    validateUsername() {
      const constraints = {
        username: {
          presence: true,
          length: {
            minimum: 4,
            message: "must be at least 4 characters",
          },
          format: {
            pattern: "^[a-z][^A-Z]?[a-z0-9]+",
            message: "can only contain a-z and 0-9",
          },
        },
      };
      const result = validate({ username: this.username }, constraints);
      if (result) {
        console.log(result);
        this.username_errorMsg = result.username[0];
        return false;
      } else {
        console.log("something else");
        this.username_errorMsg = "";
        return true;
      }
    },
    validatePassword() {
      const constraints = {
        password: {
          presence: true,
          length: {
            minimum: 8,
            message: "Password must be at least 8 characters",
          },
          format: {
            pattern: "^[a-z][a-z0-9]+",
            message: "Password can only contain alpha-numeric characters",
          },
        },
        password2: {
          presence: true,
          equality: {
            attribute: "password",
            message: "both passwords must match",
          },
        },
      };
      const result = validate(
        { password: this.password, password2: this.password2 },
        constraints
      );
      if (result) {
        for (const key in result) {
          this.password_errorMsg = result[key][0];
        }
        return false;
      } else {
        console.log("something else");
        this.password_errorMsg = "";
        return true;
      }
    },
    async register(event) {
      event.preventDefault();
      if (!this.validateUsername()) {
        console.log("username error");
      }
      if (!this.validatePassword()) {
        console.log("password error");
      }
      if (this.validateUsername() && this.validatePassword()) {
        const response = await fetch("http://localhost:5000/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });
        if (response.status === 201) {
          this.$router.push("/login");
        } else {
          const data = await response.json();
          this.username_errorMsg = data.error;
        }
      }
    },
    cancel(event) {
      event.preventDefault();
      this.$router.push("/login");
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
  height: 50%;
  margin: auto;
}
</style>
