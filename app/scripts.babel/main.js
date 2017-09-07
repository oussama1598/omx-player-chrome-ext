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
      .fail(err => {
        if (err.status !== 400) {
          return reject(`${url}: ${err.statusText}`)
        }

        return reject(err.responseJSON.errors[0])
      })
  })

const getStreams = url =>
  getData()
  .then(data => request('get', `${data.KodiUrl}/api/youtube`, {
    url
  }))
  .then(data => JSON.parse(data))

const streamToKodi = streamURI =>
  getData()
  .then(data => request('post', `${data.KodiUrl}/api/controls/play`, {
    source: streamURI
  }))

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

const showLoading = () => {
  const loader = $('.loader')
  const collection = $('.collection')
  const error = $('.error')

  error.addClass('hide')
  collection.addClass('hide')

  loader.removeClass('hide')
}

const timeoutPromise = timeout =>
  new Promise(resolve => {
    setTimeout(resolve, timeout)
  })

$(document).ready(() => {
  const loader = $('.loader')
  const collection = $('.collection')
  const error = $('.error')

  collection.on('click', '.collection-item', function() {
    const url = $(this).attr('data-url')

    showLoading()
    streamToKodi(url)
      .then(() => showError('Stream casted, check your player'))
      .then(() => timeoutPromise(2000))
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
