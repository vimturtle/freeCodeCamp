function palindrome(str) {
  let tmp = str.replace(/[^A-Za-z0-9]/g, '').toLowerCase()

  return tmp.split('').reverse().join('') == tmp
}

palindrome('eye')
