import { defineConfig } from 'wxt'

export default defineConfig({
	manifest: {
		default_locale: 'en',
		description: '__MSG_extension_description__',
		name: '__MSG_extension_name__',
		action: {}, // This is necessary to enable the toolbar button
		permissions: [
			'sidePanel',
			'activeTab',
			'scripting',
			'tabs',
		],
		host_permissions: [
			"<all_urls>"
		],
		browser_specific_settings: {
			gecko: {
				id: "caiocerano@gmail.com",
				strict_min_version: "109.0"
			}
		}
	},
	modules: [
		'@wxt-dev/module-react',
		'@wxt-dev/auto-icons',
		'@wxt-dev/i18n/module',
	],
	srcDir: 'src',
})
