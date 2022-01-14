<script setup>
import Editor from "../components/Editor/Editor.vue"
import Preview from "../components/Preview/Preview.vue"
import FileBrowser from "../components/FileBrowser/FileBrowser.vue"
</script>

<template>
	<div class="home h-full">
		<div class="flex h-full gap-8">
			<div class="w-1/6 h-full">
				<FileBrowser />
			</div>
			<div class="flex w-5/6 gap-8">
				<Editor class="w-1/2 h-full" />
				<Preview class="w-1/2 h-full" />
			</div>
		</div>
	</div>
</template>
