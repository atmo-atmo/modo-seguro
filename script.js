const checklist = document.querySelector('#safety-checklist')
const checks = checklist ? [...checklist.querySelectorAll('input[type="checkbox"]')] : []
const progressFill = document.querySelector('#progress-fill')
const progressText = document.querySelector('#progress-text')
const fakeButton = document.querySelector('#fake-download')
const fakeClues = document.querySelector('#fake-clues')
const tapNote = document.querySelector('#tap-note')
const progress = document.querySelector('#checklist-progress')
const resetButton = document.querySelector('#reset-checklist')
const toast = document.querySelector('#toast')
const blockerDemo = document.querySelector('.blocker-demo')
const blockerToggle = document.querySelector('#toggle-blocker')
const blockerResult = document.querySelector('#blocker-result')
const initialFakeLabel = fakeButton ? [...fakeButton.childNodes].map((node) => node.cloneNode(true)) : []
const initialTapNote = tapNote?.textContent
let toastTimer

function resetDownloadExample() {
  if (!fakeButton) return
  fakeButton.replaceChildren(...initialFakeLabel.map((node) => node.cloneNode(true)))
  fakeButton.classList.remove('is-exposed')
  fakeButton.hidden = false
  if (tapNote) tapNote.textContent = initialTapNote
  if (blockerToggle) {
    blockerToggle.setAttribute('aria-pressed', 'false')
    blockerToggle.textContent = 'SIMULAR UBLOCK ACTIVADO'
  }
  if (blockerResult) blockerResult.textContent = 'Sin bloqueo: el botón trucho queda a la vista.'
  window.clearTimeout(toastTimer)
  if (toast) toast.classList.remove('is-visible')
}

window.addEventListener('pageshow', resetDownloadExample)
window.addEventListener('hashchange', resetDownloadExample)

function showToast(message) {
  if (!toast) return
  window.clearTimeout(toastTimer)
  toast.textContent = message
  toast.classList.add('is-visible')
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 5000)
}

function updateProgress(announceCompletion = false) {
  const completed = checks.filter((check) => check.checked).length
  const percent = checks.length ? (completed / checks.length) * 100 : 0

  if (progressFill) progressFill.style.width = `${percent}%`
  if (progressText) progressText.textContent = `${completed}/${checks.length} revisiones hechas`

  if (announceCompletion && completed === checks.length && checks.length) {
    showToast('Revisar reduce riesgos; no garantiza que un archivo sea seguro.')
  }
}

function resetChecks() {
  checks.forEach((check) => { check.checked = false })
  updateProgress()
}

checks.forEach((check) => check.addEventListener('change', () => updateProgress(true)))
if (progress) progress.hidden = false
resetChecks()

window.addEventListener('pageshow', resetChecks)

if (fakeButton && fakeClues) {
  fakeButton.setAttribute('aria-controls', fakeClues.id)
  fakeButton.disabled = false
  fakeButton.addEventListener('click', () => {
    fakeButton.classList.add('is-exposed')
    fakeButton.textContent = 'SEÑALES DE ALERTA'
    if (tapNote) tapNote.textContent = 'Es una simulación: no comprueba tu bloqueador. En una descarga real, revisa la dirección y el archivo.'
    showToast('Un botón pequeño también puede engañar. Revisa el archivo antes de abrirlo.')
  })
}

if (blockerDemo && blockerToggle && fakeButton && blockerResult) {
  blockerDemo.hidden = false
  blockerToggle.addEventListener('click', () => {
    const enabled = blockerToggle.getAttribute('aria-pressed') !== 'true'
    resetDownloadExample()
    blockerToggle.setAttribute('aria-pressed', String(enabled))
    blockerToggle.textContent = enabled ? 'SIMULAR UBLOCK DESACTIVADO' : 'SIMULAR UBLOCK ACTIVADO'
    fakeButton.hidden = enabled
    blockerResult.textContent = enabled
      ? 'Con bloqueo: desaparece el anuncio falso. El archivo todavía necesita revisión.'
      : 'Sin bloqueo: el botón trucho queda a la vista.'
  })
}

if (resetButton) {
  resetButton.hidden = false
  resetButton.addEventListener('click', () => {
    resetChecks()
    showToast('Lista reiniciada. Revisa cada archivo desde el principio.')
  })
}
