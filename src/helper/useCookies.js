export const useCookies = () => {
  const saveToCookie = (cookieName, cookieValue) => {
    document.cookie = `${cookieName}=${JSON.stringify(cookieValue)}`;
  };

  const readCookie = (cookieName, cookieValue) => {
    const cookies = document.cookie.split(";");
    let formCookie = "";
    cookies.forEach((cookie) => {
      if (cookie.startsWith(`${cookieName}=`)) {
        formCookie = cookie.replace(`${cookieName}=`, "");
      }
    });
    return formCookie;
  };
  return [saveToCookie, readCookie];
};
