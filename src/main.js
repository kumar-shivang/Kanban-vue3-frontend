import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "./scss/styles.scss";
import "./assets/main.css";
import * as bootstrap from "bootstrap";
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(bootstrap);
app.mount("#app");
