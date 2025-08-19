const urlRegexPatterns = {
  linkedIn: /^https:\/\/(www\.)?linkedin\.com\/(in|pub|company)\/[A-Za-z0-9-]+\/?$/,
  twitter: /^https:\/\/(www\.)?x\.com\/[A-Za-z0-9_]{1,15}\/?$/,
  website: /^https:\/\/([A-Za-z0-9-]+\.)*[A-Za-z0-9-]+\.[A-Za-z]{2,}(?::\d{1,5})?(\/\S*)?$/,
  youtube:
    /^https:\/\/(www\.)?(youtube\.com|youtu\.be)\/(?:(?:watch\?v=|embed\/|v\/)|@[\w-]+)?([A-Za-z0-9_-]{11})(\S*)?$/,
  facebookUrl:
    /^https:\/\/(www\.)?facebook\.com\/(?:people\/[A-Za-z0-9-.]+\/\d+|profile\.php\?id=\d+|[A-Za-z0-9.]{5,})\/?$/,
}

export { urlRegexPatterns }
