<script setup>
import { computed } from "@vue/reactivity"
import store from "../../store"
import ThemeToggler from "./ThemeToggler.vue"
import ColorSchemeChooser from "./ColorSchemeChooser.vue"
import LanguageChooser from "./LanguageChooser.vue"
import {
	COLOR_SCHEME_PRIMARY_CLASSES,
	COLOR_SCHEME_DARK_CLASSES,
	COLOR_SCHEME_HOVER_CLASSES,
} from "../../constants"
import { useI18n } from "vue-i18n"

const colorScheme = computed(() => store.state.settings.colorScheme)

const { t: $t } = useI18n({
	inheritLocale: true,
})
</script>

<template>
	<nav :class="COLOR_SCHEME_PRIMARY_CLASSES[colorScheme]">
		<div class="mx-auto px-4">
			<div class="flex items-center justify-between h-16">
				<div class="flex items-center">
					<div class="hidden md:block">
						<div class="flex items-baseline space-x-4">
							<router-link
								:to="{ name: 'Home' }"
								class="px-3 py-2 rounded-md text-sm font-medium text-zinc-100"
								:class="[...COLOR_SCHEME_HOVER_CLASSES[colorScheme]]"
								:active-class="
									[
										...COLOR_SCHEME_DARK_CLASSES[colorScheme],
										'bg-white',
									].join(' ')
								"
								aria-current="page"
								>{{ $t("editor") }}</router-link
							>

							<router-link
								:to="{ name: 'Settings' }"
								class="px-3 py-2 rounded-md text-sm font-medium text-zinc-100"
								:class="[...COLOR_SCHEME_HOVER_CLASSES[colorScheme]]"
								:active-class="
									[
										...COLOR_SCHEME_DARK_CLASSES[colorScheme],
										'bg-white',
									].join(' ')
								"
								>{{ $t("settings") }}</router-link
							>

							<router-link
								:to="{ name: 'About' }"
								class="px-3 py-2 rounded-md text-sm font-medium text-zinc-100"
								:class="[...COLOR_SCHEME_HOVER_CLASSES[colorScheme]]"
								:active-class="
									[
										...COLOR_SCHEME_DARK_CLASSES[colorScheme],
										'bg-white',
									].join(' ')
								"
								>{{ $t("about") }}</router-link
							>
						</div>
					</div>
				</div>
				<div class="ml-4 flex items-center md:ml-6 gap-5"></div>
			</div>
		</div>
	</nav>
</template>