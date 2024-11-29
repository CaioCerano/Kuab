import { defineBackground } from 'wxt/sandbox'

export default defineBackground(() => {
	console.log('Background script', { id: browser.runtime.id })

	if (import.meta.env.FIREFOX) {
		// Firefox-specific implementation
		browser.browserAction.onClicked.addListener(() => {
			browser.sidebarAction.toggle()
		})
	}
	else if (import.meta.env.CHROME) {
		// Chrome-specific implementation
		// @ts-ignore
		browser.sidePanel
			.setPanelBehavior({ openPanelOnActionClick: true })
			.catch((error: Error) => {
				console.error('Error setting side panel behavior:', error)
			})
	}
})