<script setup>
import LanguageChooser from '../components/NavigationBar/LanguageChooser.vue';
import ColorSchemeChooser from '../components/NavigationBar/ColorSchemeChooser.vue';
import ThemeToggler from '../components/NavigationBar/ThemeToggler.vue';
</script>

<template>
	<div class="settings h-full">
		<div class="flex h-full gap-8 p-5   ">
			<LanguageChooser />
			<ColorSchemeChooser />
			<ThemeToggler />
		</div>
	</div>
</template>
