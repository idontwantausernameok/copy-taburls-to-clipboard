
const extId = 'tabs2clip';
const excluded_urls = ['chrome:','moz:','about:','data:','blob:'];

async function onBrowserActionClicked() { 

	let notify_title = '';
	let notify_message = '';

	try {

		// query all tabs from active Window
		const tabs = await browser.tabs.query({currentWindow: true});

		// url storage
		let clipText = '';

		// get urls from tabs
		tabs.forEach( (tab) => {
			for (let ex of excluded_urls) {
				if( tab.url.startsWith(ex) ){ return; }
			}
			clipText += tab.url + '\n';
		});
		// remove trailing \n
		clipText = clipText.trim();

		// special case for empty list, lets inform the user
		if( clipText === '' ) {
			throw Error('url list empty, please note, that urls starting with "'+ excluded_urls.join('", "') + '" will be ignored');
		}


		// write urls to clipboard
		await navigator.clipboard.writeText(clipText);

		notify_title = "Successfully copied urls to clipboard";
		notify_message = "Use CTRL+V <PASTE> to insert them into any notepad or editor";



	} catch(e) {
		notify_title = 'Failed to copy urls to clipboard';
		notify_message = e.message;
	}

	browser.notifications.create(extId, {
		"type": "basic",
		"iconUrl": browser.runtime.getURL("icon.png"),
		"title": notify_title, 
		"message":  notify_message 
	});
}

// register listener
browser.browserAction.onClicked.addListener(onBrowserActionClicked); 

