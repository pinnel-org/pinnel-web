const base64urlEncode = (input: Uint8Array): string =>
  btoa(String.fromCharCode(...input))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

export const generateCodeVerifier = (): string => {
  const array = new Uint8Array(32)
  window.crypto.getRandomValues(array)
  return base64urlEncode(array)
}

export const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const encoded = new TextEncoder().encode(verifier)
  const digest = await window.crypto.subtle.digest('SHA-256', encoded)
  return base64urlEncode(new Uint8Array(digest))
}
