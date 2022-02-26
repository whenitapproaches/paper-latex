<script setup>
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useStore } from "vuex"
import {
	COLOR_SCHEME_PRIMARY_CLASSES,
	COLOR_SCHEME_HOVER_CLASSES,
} from "../../constants"

const store = useStore()

const colorScheme = computed(() => store.state.settings.colorScheme)

const isActive = computed(() => store.state["message-popup"].isActive)

const content = computed(() => store.state["message-popup"].content)

const hide = () => store.dispatch("message-popup/hide")

const { t: $t } = useI18n({
	inheritLocale: true,
})
</script>

<template>
	<div
		class="fixed z-10 inset-0 overflow-y-auto"
		aria-labelledby="project-browser"
		role="dialog"
		aria-modal="true"
		v-show="isActive"
	>
		<div
			class="
				flex
				items-end
				justify-center
				min-h-screen
				pt-4
				px-4
				pb-20
				text-center
				sm:block sm:p-0
			"
		>
			<div
				class="
					fixed
					inset-0
					bg-zinc-500
					dark:bg-zinc-800
					bg-opacity-75
					dark:bg-opacity-75
					transition-opacity
				"
				aria-hidden="true"
				@click="hide"
			></div>

			<span
				class="hidden sm:inline-block sm:align-middle sm:h-screen"
				aria-hidden="true"
				>&#8203;</span
			>

			<div
				class="
					inline-block
					align-bottom
					bg-zinc-100
					dark:bg-zinc-800
					rounded-lg
					text-center
					overflow-hidden
					shadow-xl
					transform
					transition-all
					sm:my-8 sm:align-middle sm:max-w-lg sm:w-full
				"
			>
				<div class="text-lg text-zinc-500 dark:text-zinc-200 bg-white dark:bg-zinc-700 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
					{{ $t(content) }}
				</div>
				<div
					class="
						bg-zinc-50
						dark:bg-zinc-600
						px-4
						py-3
						sm:px-6 sm:flex sm:flex-row-reverse
					"
				>
					<button
						type="button"
						class="
							w-full
              mx-auto
							inline-flex
							justify-center
							rounded-md
							border border-transparent
							shadow-sm
							px-4
							py-2
							text-base
							font-medium
							text-zinc-200
							dark:text-zinc-300
							sm:w-auto sm:text-sm
						"
						:class="[
							...COLOR_SCHEME_PRIMARY_CLASSES[colorScheme],
							...COLOR_SCHEME_HOVER_CLASSES[colorScheme],
						]"
						@click="hide"
					>
						{{ $t("ok") }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>