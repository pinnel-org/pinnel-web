export interface PixelArea {
  x: number
  y: number
  width: number
  height: number
}

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

export const cropToJpeg = async (
  file: File,
  pixelArea: PixelArea,
  outputSize = 512,
  quality = 0.85,
): Promise<Blob> => {
  const srcUrl = URL.createObjectURL(file)
  try {
    const img = await loadImage(srcUrl)
    const canvas = document.createElement('canvas')
    canvas.width = outputSize
    canvas.height = outputSize
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')
    ctx.drawImage(
      img,
      pixelArea.x,
      pixelArea.y,
      pixelArea.width,
      pixelArea.height,
      0,
      0,
      outputSize,
      outputSize,
    )
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Failed to encode JPEG'))),
        'image/jpeg',
        quality,
      )
    })
  } finally {
    URL.revokeObjectURL(srcUrl)
  }
}
