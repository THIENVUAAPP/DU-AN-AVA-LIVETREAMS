const url1 = "https://www.tiktok.com/@cuncannepubg/live";
const url2 = "https://www.tiktok.com/live";
const url3 = "https://vt.tiktok.com/ZSF3456/";

const getEmbedUrl = (url) => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('tiktok.com')) {
    const usernameMatch = url.match(/@([a-zA-Z0-9_.-]+)/);
    if (usernameMatch && usernameMatch[0]) {
      return `https://www.tiktok.com/embed/${usernameMatch[0]}/live?autoplay=1&muted=1`;
    } else {
      return "INVALID_TIKTOK_URL";
    }
  }
  return url;
};

console.log(getEmbedUrl(url1));
console.log(getEmbedUrl(url2));
console.log(getEmbedUrl(url3));
