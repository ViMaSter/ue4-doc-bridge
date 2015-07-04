function injectExtensionScript(filename) {
	var scriptTag = document.createElement('script');
	scriptTag.src = chrome.extension.getURL(filename);
	(document.head||document.documentElement).appendChild(scriptTag);
}

injectExtensionScript("js/extend.js");
injectExtensionScript("js/jq.js");
injectExtensionScript("js/config.js");
injectExtensionScript("js/main.js");
