
const extId = 'tabs2clip';
const excluded_urls = ['chrome','moz','about','data'];

function onBrowserActionClicked() { 

	// query all tabs from active Window
	browser.tabs.query({currentWindow: true}).then( (tabs) => {

		// url storage
		let clipText = '';
		
		// get urls from tabs
		tabs.forEach( (tab) => {
			for (let ex of excluded_urls) {
				if( tab.url.startsWith(ex) ){
					return;
				}
			}
			clipText += tab.url + '\n';
		});
		// remove trailing \n
		clipText = clipText.trim();

		// write urls to clipboard
		navigator.clipboard.writeText(clipText).then(function() {

			browser.notifications.create(extId, {
				"type": "basic",
				"iconUrl": browser.runtime.getURL("icons.png"),
				"title": "Successfully copied tab urls to clipboard",
				"message": "Use CTRL+V <PASTE> to insert them into any notepad or editor"
			});

		});

	}).catch( (e) => {

		browser.notifications.create(extId, {
			"type": "basic",
			"iconUrl": browser.runtime.getURL("icons.png"),
			"title": "Failed to copy tab urls to clipboard",
			"message": e.toString()
		});

	});

}

// listener
browser.browserAction.onClicked.addListener(onBrowserActionClicked); 

