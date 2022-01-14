<script setup>
import { computed } from "@vue/reactivity"
import { useStore } from "vuex"
import { DARK_THEME } from "./constants"
import NavigationBar from "./components/NavigationBar/NavigationBar.vue"

const store = useStore()
const theme = computed(() => store.state.settings.theme)
</script>

<template>
	<div class="app-wrapper" :class="[theme]">
		<div class="main bg-white dark:bg-zinc-900">
			<NavigationBar />
			<div class="view" :style="{ height: 'calc(100vh - 4rem)' }">
				<router-view />
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
