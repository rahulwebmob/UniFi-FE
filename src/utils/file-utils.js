export const extractFilename = (fileName) => {
  if (!fileName) {
    return ''
  }
  const [, ...rest] = fileName.split('_')
  return rest.join('_') || fileName
}
