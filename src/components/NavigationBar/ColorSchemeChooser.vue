<script setup>
import { computed, ref } from "@vue/reactivity"
import { useI18n } from "vue-i18n"
import { useStore } from "vuex"
import {
	COLOR_SCHEME_PRIMARY_CLASSES,
	COLOR_SCHEME_HOVER_CLASSES,
	COLOR_SCHEME_LIGHT_CLASSES,
} from "../../constants"

const store = useStore()

const currentColorScheme = computed(() => store.state.settings.colorScheme)

const updateColorScheme = (colorScheme) => {
  isDropdownActive.value = false
	store.dispatch("updateColorScheme", colorScheme)
}

const isDropdownActive = ref(false)

const { t: $t } = useI18n({
	inheritLocale: true,
})
</script>

<template>
	<div class="relative inline-block text-left">
		<div>
			<button
				type="button"
				class="
					inline-flex
					justify-center
					w-full
					rounded-md
					border border-gray-300
					shadow-sm
					px-4
					py-2
					w-56
					bg-white
					text-sm
					font-medium
					text-gray-700
					hover:bg-gray-50
				"
				id="menu-button"
				aria-expanded="true"
				aria-haspopup="true"
        @click.prevent="isDropdownActive = !isDropdownActive"
			>
				{{ $t("choose_color_scheme") }}
				<svg
					class="-mr-1 ml-2 h-5 w-5"
          :class="{
            'rotate-180': isDropdownActive
          }"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>

		<div
			class="
				origin-top-right
				absolute
				left-0
				mt-2
				w-56
				rounded-md
				shadow-lg
				bg-white
				dark:bg-zinc-800
				ring-1 ring-black ring-opacity-5
				focus:outline-none
				z-50
			"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="menu-button"
			tabindex="-1"
      v-show="isDropdownActive"
		>
			<div class="py-1" role="none">
				<!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
				<a
					href="#"
					class="
						flex
						items-center
						text-zinc-600
						dark:text-zinc-200
						block
						px-4
						py-2
						text-sm
						hover:bg-zinc-100 hover:dark:bg-zinc-600
					"
					:class="
						currentColorScheme === colorScheme
							? [...COLOR_SCHEME_LIGHT_CLASSES[currentColorScheme]]
							: []
					"
					role="menuitem"
					tabindex="-1"
					id="menu-item-0"
					v-for="(colors, colorScheme) in COLOR_SCHEME_PRIMARY_CLASSES"
					:key="colorScheme"
					@click.prevent="updateColorScheme(colorScheme)"
				>
					<div class="w-5 h-5" :class="colors"></div>
					<p class="pl-3">{{ $t(colorScheme) }}</p>
				</a>
			</div>
		</div>
	</div>
</template>