console.log('Background script loaded');

let currentTabId = null;
let currentTabStartTime = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
  handleTabActivated(activeInfo);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === currentTabId && changeInfo.status === 'complete') {
    currentTabStartTime = Date.now();
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === currentTabId && currentTabStartTime !== null) {
    const timeSpent = Date.now() - currentTabStartTime;
    updateTimeSpent(currentTabId, timeSpent);
    currentTabId = null;
    currentTabStartTime = null;
  }
});

function handleTabActivated(activeInfo) {
  if (currentTabId !== null && currentTabStartTime !== null) {
    const timeSpent = Date.now() - currentTabStartTime;
    updateTimeSpent(currentTabId, timeSpent);
  }

  currentTabId = activeInfo.tabId;
  currentTabStartTime = Date.now();
}

async function updateTimeSpent(tabId, timeSpent) {
  chrome.tabs.get(tabId, (tab) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
      return;
    }

    const url = new URL(tab.url);
    const domain = url.hostname;

    chrome.storage.local.get([domain], (result) => {
      const previousTime = result[domain] || 0;
      const newTime = previousTime + timeSpent;
      chrome.storage.local.set({ [domain]: newTime }, () => {
        console.log(`Updated time for ${domain}: ${newTime} ms`);
      });
    });
  });
}

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = new URL(details.url);
    const domain = url.hostname;
    console.log(`Requesting URL: ${url.href}`);
    console.log(`Domain: ${domain}`);

    return new Promise((resolve) => {
      chrome.storage.local.get(['blocklist'], (result) => {
        const blocklist = result.blocklist || [];
        console.log(`Blocklist: ${JSON.stringify(blocklist)}`);
        if (blocklist.includes(domain)) {
          console.log(`Blocking domain: ${domain}`);
          alert(`Access to ${domain} is blocked.`);
          resolve({ cancel: true });
        } else {
          console.log(`Domain not blocked: ${domain}`);
          resolve({ cancel: false });
        }
      });
    });
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

