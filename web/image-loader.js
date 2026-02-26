const normalizeSrc = (src) => {
    return src[0] === "/" ? src.slice(1) : src;
  };

const cloudflareLoader = ({ src, width, quality }) => {
  const params = [`width=${width}`, `format=auto`]

  if (quality) {
    params.push(`quality=${quality}`)
  } else {
    params.push(`quality=${80}`)
  }

  const paramsString = params.join(',')
  return `https://www.venuee-performance.com/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`
}

export default cloudflareLoader
