export function encryptCaesar(str, shift = 3) {
return str.replace(/[a-z]/gi, (c) => {
const base = c <= 'Z' ? 65 : 97;
return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
});
}
export function decryptCaesar(str, shift = 3) {
return encryptCaesar(str, 26 - shift);
}
export function base64Encode(str) {
return btoa(str);
}
export function base64Decode(str) {
return atob(str);
}
