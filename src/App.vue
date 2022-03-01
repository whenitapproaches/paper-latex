<script setup>
import { computed, ref } from "@vue/reactivity"
import { useStore } from "vuex"
import { DARK_THEME } from "./constants"
import NavigationBar from "./components/NavigationBar/NavigationBar.vue"
import WindowBar from "./components/WindowBar/WindowBar.vue"
import MessagePopup from "./components/MessagePopup/MessagePopup.vue"

const store = useStore()
const theme = computed(() => store.state.settings.theme)

const windowBarElement = ref(null)
const navigationBarElement = ref(null)

const windowBarElementHeight = computed(() =>
	windowBarElement.value ? windowBarElement.value.$el.clientHeight : 0
)

const navigationBarElementHeight = computed(() =>
	navigationBarElement.value ? navigationBarElement.value.$el.clientHeight : 0
)
</script>

<template>
	<div class="app-wrapper" :class="[theme]">
		<div class="main bg-white dark:bg-zinc-900">
			<WindowBar ref="windowBarElement" />
			<NavigationBar ref="navigationBarElement" />
			<MessagePopup />
			<div
				id="view"
				:style="{
					height: `calc(100vh - ${
						windowBarElementHeight + navigationBarElementHeight
					}px)`,
				}"
			>
				<router-view v-slot="{ Component }">
					<keep-alive>
						<component :is="Component" />
					</keep-alive>
				</router-view>
			</div>
		</div>
	</div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap");

#app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	font-family: "Inter", sans-serif;
}

.main {
	min-height: 100vh;
	overflow-y: hidden;
}

.overlay {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
}
</style>
