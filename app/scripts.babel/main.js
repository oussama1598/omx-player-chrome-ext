const getCurrentTabUrl = () =>
  new Promise(resolve => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => resolve(tabs[0].url))
  })

const isYoutubeUrl = url => /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/.test(url)

const request = (method, url, data = {}) =>
  new Promise((resolve, reject) => {
    $[method](url, data)
      .done(resolve)
      .fail(reject)
  })

const getStreams = url =>
  getData()
  .then(data => request('get', `${data.localHost}/api/youtube`, {
    url
  }))
  .catch(err => Promise.reject(err.responseJSON.errors[0]))

const addStream = streamURI =>
  getData()
  .then(data => request('post', `${data.localHost}/api/stream`, {
    input: 'internet',
    streamURI
  }))
  .catch(err => Promise.reject(err.responseJSON.errors[0]))

const streamToPi = source =>
  getData()
  .then(data => request('get', `${data.raspiHost}/controls/play`, {
    source
  }))
  .catch(err => Promise.reject(err.responseJSON.errors[0]))

const buildHTML = format =>
  `<a class="collection-item" data-url="${format.url}">
    ${format.filetype} - ${format.resolution} - ${format.bitrate}kbps
  </a>`

const showError = err => {
  const loader = $('.loader')
  const collection = $('.collection')
  const error = $('.error')

  loader.addClass('hide')
  collection.addClass('hide')

  error.removeClass('hide').find('div').text(err)
}

$(document).ready(() => {
  const loader = $('.loader')
  const collection = $('.collection')
  const error = $('.error')

  collection.on('click', '.collection-item', function() {
    const url = $(this).attr('data-url')

    addStream(url)
      .then(result => streamToPi(result.streamUrl))
      .then(() => window.close())
      .catch(err => showError(err))
  })

  getCurrentTabUrl()
    .then(url => {
      const isYoutube = isYoutubeUrl(url)
      if (!isYoutube) return Promise.reject('Not a youtube url')

      loader.removeClass('hide')
      error.addClass('hide')

      return getStreams(url)
        .then(result => {
          loader.addClass('hide')
          collection.removeClass('hide')

          collection.html(result.map(format => buildHTML(format)).join(' '))
        })
    })
    .catch(err => showError(err))
})
