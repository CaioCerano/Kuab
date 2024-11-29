import { defineBackground } from 'wxt/sandbox'

export default defineBackground(() => {
	console.log('Background script', { id: browser.runtime.id })

	const isFirefox = () => {
		return typeof browser !== 'undefined' && navigator.userAgent.includes('Firefox')
	}

	if (isFirefox()) {
		// Firefox-specific implementation
		browser.browserAction.onClicked.addListener(() => {
			browser.sidebarAction.toggle()
		})
	} else {
		// Chrome-specific implementation
		// @ts-ignore
		browser.sidePanel
			.setPanelBehavior({ openPanelOnActionClick: true })
			.catch((error: Error) => {
				console.error('Error setting side panel behavior:', error)
			})
	}
})