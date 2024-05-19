document.addEventListener('DOMContentLoaded', () => {
    const blocklistElement = document.getElementById('blocklist');
    const newBlocklistItemElement = document.getElementById('newBlocklistItem');
    const addButton = document.getElementById('addButton');
  
    function loadBlocklist() {
      chrome.storage.local.get(['blocklist'], (result) => {
        const blocklist = result.blocklist || [];
        blocklistElement.innerHTML = '';
        blocklist.forEach(domain => {
          const blocklistItemElement = document.createElement('div');
          blocklistItemElement.className = 'blocklist-item';
  
          const domainElement = document.createElement('span');
          domainElement.textContent = domain;
  
          const removeButton = document.createElement('button');
          removeButton.textContent = 'Remove';
          removeButton.addEventListener('click', () => {
            removeBlocklistItem(domain);
          });
  
          blocklistItemElement.appendChild(domainElement);
          blocklistItemElement.appendChild(removeButton);
          blocklistElement.appendChild(blocklistItemElement);
        });
      });
    }
  
    function addBlocklistItem(domain) {
      chrome.storage.local.get(['blocklist'], (result) => {
        const blocklist = result.blocklist || [];
        if (!blocklist.includes(domain)) {
          blocklist.push(domain);
          chrome.storage.local.set({ blocklist: blocklist }, loadBlocklist);
        }
      });
    }
  
    function removeBlocklistItem(domain) {
      chrome.storage.local.get(['blocklist'], (result) => {
        let blocklist = result.blocklist || [];
        blocklist = blocklist.filter(item => item !== domain);
        chrome.storage.local.set({ blocklist: blocklist }, loadBlocklist);
      });
    }
  
    addButton.addEventListener('click', () => {
      const domain = newBlocklistItemElement.value.trim();
      if (domain) {
        addBlocklistItem(domain);
        newBlocklistItemElement.value = '';
      }
    });
  
    loadBlocklist();
  });
  
  