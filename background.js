chrome.runtime.onMessage.addListener((message, callback, sendResponse) => {
    if (message['sites']) {
        const sites = message['sites']
        if (sites.length > 0) {
            const firstUrl = sites[0];
            chrome.tabs.create({ 'url': firstUrl, 'active': false }, (tab) => {
                chrome.tabs.group({ tabIds: tab.id }, (groupId) => {
                    for (let index = 1; index < sites.length; index++) {
                        const url = sites[index];
                        chrome.tabs.create({ 'url': url, 'active': false }, (tab) => {
                            chrome.tabs.group({ groupId: groupId, tabIds: tab.id }, (groupId) => { });
                        });
                    }
                })
            });
        }
        sendResponse({ 'state': true });
    }
});
