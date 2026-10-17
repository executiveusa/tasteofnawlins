import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import ImageTracer from 'imagetracerjs'

// Vectorize approved-style Fal wordmark during preview build.
const url = 'https://v3b.fal.media/files/b/0aaec2f6/WUvPH23Hq_9OMUfA5l-T2_e4rDjGFP.png'
const response = await fetch(url, { signal: AbortSignal.timeout(30000) })
if (!response.ok) throw new Error('Failed to retrieve Fal artwork: ' + response.status)
const buffer = Buffer.from(await response.arrayBuffer())
const { data, info } = await sharp(buffer)
  .resize({ width: 1000, withoutEnlargement: true })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
const rgba = new Uint8ClampedArray(info.width * info.height * 4)
let minX = info.width, minY = info.height, maxX = 0, maxY = 0
for (let y=0;y<info.height;y++) for (let x=0;x<info.width;x++) {
  const i = (y*info.width+x)*3
  const o = (y*info.width+x)*4
  const r = data[i], g=data[i+1], b=data[i+2]
  // Preserve colored ink and discard near-white backing.
  const whiteness = Math.min(r,g,b)
  let alpha = Math.max(0, Math.min(255, Math.round((255-whiteness)*3.5)))
  if (whiteness < 225) { minX=Math.min(minX,x); minY=Math.min(minY,y); maxX=Math.max(maxX,x); maxY=Math.max(maxY,y) }
  rgba[o] = r; rgba[o+1] = g; rgba[o+2] = b; rgba[o+3] = alpha
}
if (maxX-minX < 50 || maxY-minY < 20) throw new Error('Fal artwork is empty or too small')
const pad=6
const left=Math.max(0,minX-pad),top=Math.max(0,minY-pad)
const width=Math.min(info.width-left,maxX-left+pad+1)
const height=Math.min(info.height-top,maxY-top+pad+1)
const trimmed=new Uint8ClampedArray(width*height*4)
for(let y=0;y<height;y++) for(let x=0;x<width;x++) {
 const src=((top+y)*info.width+left+x)*4
 const dst=(y*width+x)*4
 trimmed.set(rgba.subarray(src,src+4),dst)
}
const svg=ImageTracer.imagedataToSVG({width,height,data:trimmed},{
 numberofcolors:9, colorquantcycles:3, blurradius:0, ltres:.8, qtres:.8,
 pathomit:8, strokewidth:0, scale:1, viewbox:true, linefilter:true
})
if (!svg.includes('<path')) throw new Error('SVG path generation failed')
await fs.mkdir('public/images',{recursive:true})
await fs.writeFile(path.join('public','images','taste-wordmark-fal.svg'),svg)
console.log('Generated Fal vector wordmark:',width,'x',height,Buffer.byteLength(svg),'bytes')
