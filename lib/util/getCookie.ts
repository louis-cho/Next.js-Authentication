// utils/getCookie.ts
export const getCookieValue = (cookieString: string, name: string) => {
    const raw = cookieString
        .split('; ')
        .find((row) => row.startsWith(`${name}=`));
    return raw?.split('=')[1];
};