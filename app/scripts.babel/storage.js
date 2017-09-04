const getData = (properties = {
    localHost: 'http://localhost:9000',
    raspiHost: 'http://raspberrypi.local:8082'
  }) =>
  new Promise(resolve => {
    chrome.storage.sync.get(properties, resolve);
  })

const setData = properties =>
  new Promise(resolve => {
    chrome.storage.sync.set(properties, resolve);
  })
