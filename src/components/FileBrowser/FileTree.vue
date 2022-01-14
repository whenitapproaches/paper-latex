<script setup>
import { computed } from "@vue/reactivity"
import { useStore } from "vuex"
import FileTreeFile from "./FileTreeFile.vue"
import FileTreeFolder from "./FileTreeFolder.vue"
import { sortLocales } from "../../helpers"
import {
	FILE_BROWSER_FILES_KEY,
	FILE_BROWSER_FOLDERS_KEY,
	PROJECT_STORAGE_FOLDER_NAME,
} from "../../constants"

const store = useStore()

const currentProject = computed(() => store.state.project.currentProject)
</script>

<template>
	<ul class="list-none">
		<li
			v-for="folder in sortLocales(
				currentProject.storage[FILE_BROWSER_FOLDERS_KEY],
				'name'
			)"
			:key="`${currentProject.name}-${folder.name}`"
		>
			<FileTreeFolder
				:title="folder.name"
				:folder="folder"
				:path="[currentProject.name, PROJECT_STORAGE_FOLDER_NAME, folder.name]"
			></FileTreeFolder>
		</li>
		<li
			v-for="fileName in sortLocales(
				currentProject.storage[FILE_BROWSER_FILES_KEY]
			)"
			:key="`${currentProject.name}-${fileName}`"
		>
			<FileTreeFile
				:title="fileName"
				:path="[currentProject.name, PROJECT_STORAGE_FOLDER_NAME, fileName]"
			></FileTreeFile>
		</li>
	</ul>
</template>