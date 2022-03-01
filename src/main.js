import { createApp } from "vue"
import App from "./App.vue"
import store from "./store"
import router from "./router"

import "./assets/index.css"
import i18n from './i18n'

const app = createApp(App).use(i18n).use(store).use(router)
app.mount("#app")
