<script setup>
import { computed, ref } from "@vue/reactivity"
import { useStore } from "vuex"
import FileBrowserToolbar from "./FileBrowserToolbar.vue"
import FileTree from "./FileTree.vue"

const store = useStore()

const toolbarElement = ref(null)

const toolbarElementHeight = computed(() =>
	toolbarElement.value ? toolbarElement.value.$el.clientHeight : 0
)
</script>

<template>
	<div class="file-browser h-full">
		<FileBrowserToolbar ref="toolbarElement" />
		<div
			class="bg-zinc-50 dark:bg-zinc-800 overflow-y-auto"
			:style="{ height: `calc(100% - ${toolbarElementHeight}px)` }"
		>
			<FileTree />
		</div>
	</div>
</template>

<style scoped>
</style>