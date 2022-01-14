<script setup>
import { computed } from "@vue/reactivity"
import { onMounted } from "@vue/runtime-core"
import {
	COLOR_SCHEME_PRIMARY_CLASSES,
	COLOR_SCHEME_HOVER_CLASSES,
} from "../../constants"
import store from "../../store"

const colorScheme = computed(() => store.state.settings.colorScheme)

const compile = () => {
	console.log(store.state.editor)
}
</script>

<template>
	<div class="flex h-16 items-center gap-2">
		<div class="flex h-10 divide-x dark:divide-zinc-700">
			<button
				@click="compile"
				class="button px-6 text-zinc-200 dark:text-zinc-300"
				:class="[
					...COLOR_SCHEME_PRIMARY_CLASSES[colorScheme],
					...COLOR_SCHEME_HOVER_CLASSES[colorScheme],
				]"
			>
				{{ $t("compile") }}
			</button>
		</div>
	</div>
</template>