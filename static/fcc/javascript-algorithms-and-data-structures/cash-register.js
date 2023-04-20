let index = [
  ['ONE HUNDRED', 100.0],
  ['TWENTY', 20.0],
  ['TEN', 10.0],
  ['FIVE', 5.0],
  ['ONE', 1.0],
  ['QUARTER', 0.25],
  ['DIME', 0.1],
  ['NICKEL', 0.05],
  ['PENNY', 0.01],
]

function checkCashRegister(price, cash, cid) {
  let output = { status: null, change: [] }
  let change = cash - price

  let register = cid.reduce(
    (acc, curr) => {
      acc.total += curr[1]
      acc[curr[0]] = curr[1]
      return acc
    },
    { total: 0 }
  )

  if (register.total === change) {
    output.status = 'CLOSED'
    output.change = cid
    return output
  }

  if (register.total < change) {
    output.status = 'INSUFFICIENT_FUNDS'
    return output
  }

  let change_arr = index.reduce((acc, curr) => {
    let value = 0

    while (register[curr[0]] > 0 && change >= curr[1]) {
      change -= curr[1]
      register[curr[0]] -= curr[1]
      value += curr[1]

      change = Math.round(change * 100) / 100
    }

    if (value > 0) {
      acc.push([curr[0], value])
    }
    return acc
  }, [])

  if (change_arr.length < 1 || change > 0) {
    output.status = 'INSUFFICIENT_FUNDS'
    return output
  }

  output.status = 'OPEN'
  output.change = change_arr
  return output
}

checkCashRegister(19.5, 20, [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100],
])
