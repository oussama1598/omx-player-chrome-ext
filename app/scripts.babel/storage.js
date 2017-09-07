const getData = (properties = {
    KodiUrl: 'http://oussama.local:8080'
  }) =>
  new Promise(resolve => {
    chrome.storage.sync.get(properties, resolve);
  })

const setData = properties =>
  new Promise(resolve => {
    chrome.storage.sync.set(properties, resolve);
  })
