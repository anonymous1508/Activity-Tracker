document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(null, (items) => {
    const timeList = document.getElementById('timeList');
    const domains = Object.keys(items);

    if (domains.length === 0) {
      const noDataElement = document.createElement('div');
      noDataElement.textContent = 'No data available';
      timeList.appendChild(noDataElement);
    } else {
      domains.forEach(domain => {
        const timeSpent = items[domain];
        
        const domainElement = document.createElement('div');
        domainElement.className = 'domain';

        const domainNameElement = document.createElement('span');
        domainNameElement.textContent = domain;

        const timeElement = document.createElement('span');
        timeElement.textContent = `${Math.round(timeSpent / 1000)} seconds`;

        domainElement.appendChild(domainNameElement);
        domainElement.appendChild(timeElement);
        timeList.appendChild(domainElement);
      });
    }
  });
});


