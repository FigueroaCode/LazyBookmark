// Initialize button with user's preferred color
let tabBtn = document.getElementById("open-tabs-btn");
let addTabBtn = document.getElementById("add-tab-btn");
let linksContainer = document.getElementById("links-container");

loadLinks();

// When the button is clicked, inject setPageBackgroundColor into current page
tabBtn.addEventListener("click", () => {
	let siteLinks = localStorage.getItem('siteLinks')
	if (siteLinks) {
		siteLinks = JSON.parse(siteLinks);
		// call background.js
		chrome.runtime.sendMessage({ 'sites': siteLinks }, (response) => {

		});
	}
});

addTabBtn.addEventListener("click", () => {
	chrome.tabs.query({ active: true }, tabs => {
		const url = tabs[0].url;
		saveLink(url);
	});
});

function saveLink(link) {
	let siteLinks = localStorage.getItem("siteLinks");
	if (!siteLinks) {
		siteLinks = [];
	} else {
		siteLinks = JSON.parse(siteLinks);
	}

	siteLinks.push(link);

	localStorage.setItem("siteLinks", JSON.stringify(siteLinks))
	loadLinks();
}

function loadLinks() {
	let siteLinks = localStorage.getItem("siteLinks");
	if (siteLinks) {
		siteLinks = JSON.parse(siteLinks);
		// Remove all child nodes
		linksContainer.textContent = '';
		for (let index in siteLinks) {
			const link = siteLinks[index];
			const child = document.createElement('DIV');
			child.classList.add('url-item');
			const title = document.createElement('SPAN');
			title.classList.add('url-title');
			title.textContent = link;

			const removeBtn = document.createElement('BUTTON');
			removeBtn.classList.add('url-btn');
			removeBtn.appendChild(document.createTextNode('❌'));
			removeBtn.addEventListener("click", removeLink);

			child.dataset.indexNumber = index;
			child.appendChild(removeBtn);
			child.appendChild(title);
			
			linksContainer.appendChild(child);
        }
    }
}

function removeLink() {
	const index = this.parentElement.dataset.indexNumber;
	let siteLinks = localStorage.getItem("siteLinks");
	if (!index || !siteLinks) {
		return;
	}
	siteLinks = JSON.parse(siteLinks);
	siteLinks.splice(index, 1);

	localStorage.setItem("siteLinks", JSON.stringify(siteLinks))
	loadLinks();
}