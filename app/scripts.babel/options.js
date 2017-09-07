const showError = err => {
  $('.error-text').text(err)
  $('.success-text').text('')
}

const showSuccess = msg => {
  $('.error-text').text('')
  $('.success-text').text(msg)
}

const ValidURL = str =>
  new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i').test(str)


$(document).ready(() => {
  const KodiUrl = $('#KodiURL')

  getData()
    .then(data => {
      KodiUrl.val(data.KodiUrl)
    })

  $('#form').submit(ev => {
    const KodiUrlVal = KodiUrl.val()

    ev.preventDefault()

    if (!ValidURL(KodiUrlVal)) return showError('Kodi\'s Url should be a valid url')

    setData({
        KodiUrl: KodiUrlVal
      })
      .then(() => showSuccess('Settings Saved!'))
  })
})
