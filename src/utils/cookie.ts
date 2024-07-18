export function getCookie(name: string) {
  let cookie = document.cookie;
  let cookieArray = cookie.split("; ");
  let cookieObj: { [key: string]: string } = {};
  cookieArray.forEach((c) => {
    let [key, value] = c.split("=");
    cookieObj[key] = value;
  });
  return cookieObj[name];
}

export function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}`
  document.cookie = `expires=${new Date(Date.now() + 3600).toUTCString()}`
}