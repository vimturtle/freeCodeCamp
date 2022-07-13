function rot13(str) {
  return str.replace(/[A-Z]/g, (t) =>
    String.fromCharCode((t.charCodeAt(0) % 26) + 65)
  )
}

rot13('SERR PBQR PNZC')
