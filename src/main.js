import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "./scss/styles.scss";
// import "./assets/main.css";
import * as bootstrap from "bootstrap";
import vueApexcharts from "vue3-apexcharts/src";
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(vueApexcharts)
app.use(bootstrap);
app.mount("#app");
