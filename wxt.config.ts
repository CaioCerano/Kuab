import { defineConfig } from 'wxt'

export default defineConfig({
	manifest: {
		default_locale: 'en',
		description: '__MSG_extension_description__',
		name: '__MSG_extension_name__',
		action: {}, // This is necessary to enable the toolbar button
		permissions: ['sidePanel', 'activeTab', 'scripting'], // 'sidePanel' is required for sidebar functionality
	},
	modules: [
		'@wxt-dev/module-react',
		'@wxt-dev/auto-icons',
		'@wxt-dev/i18n/module',
	],
	srcDir: 'src',
})
