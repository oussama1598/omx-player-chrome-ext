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
  const localHostInput = $('#localHost')
  const raspiHostInput = $('#raspiHost')

  getData()
    .then(data => {
      localHostInput.val(data.localHost)
      raspiHostInput.val(data.raspiHost)
    })

  $('#form').submit(ev => {
    const localHost = localHostInput.val()
    const raspiHost = raspiHostInput.val()

    ev.preventDefault()

    if (!ValidURL(localHost)) return showError('localHost should be a valid url')
    if (!ValidURL(raspiHost)) return showError('raspiHost should be a valid url')

    setData({
        localHost,
        raspiHost
      })
      .then(() => showSuccess('Settings Saved!'))
  })
})
