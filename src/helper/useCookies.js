export const useCookies = () => {
  const saveToCookie = (cookieName, cookieValue) => {
    document.cookie = `${cookieName}=${cookieValue}`;
  };

  const readCookie = (cookieName, cookieValue) => {
    const cookies = document.cookie.split(";");
    let formCookie = "";
    cookies.forEach((cookie) => {
      if (cookie.trim().slice(0, cookieName.length) === cookieName) {
        formCookie = cookie.trim().slice(cookieName.length + 1);
      }
    });
    return formCookie;
  };
  return [saveToCookie, readCookie];
};
