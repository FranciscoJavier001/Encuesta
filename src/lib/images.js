// Convierte un File a DataURL y lo comprime/redimensiona para que IndexedDB no explote.
export async function fileToCompressedDataURL(file, { maxW = 1400, maxH = 900, quality = 0.78 } = {}) {
  const dataURL = await readAsDataURL(file)
  const img = await loadImage(dataURL)

  const { width, height } = fit(img.width, img.height, maxW, maxH)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)

  // jpeg para ahorrar tamaño
  return canvas.toDataURL('image/jpeg', quality)
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function fit(w, h, maxW, maxH) {
  const ratio = Math.min(maxW / w, maxH / h, 1)
  return { width: Math.round(w * ratio), height: Math.round(h * ratio) }
}
