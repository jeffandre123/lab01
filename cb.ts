import * as fs from 'fs'
import * as readlineSync from 'readline-sync'

const file = './debts.txt'

interface Debt {
  name: string
  amount: number
}

function readFileAsync (
  callback: (err: NodeJS.ErrnoException | null, data?: string) => void
): void {
  fs.readFile(file, 'utf-8', callback)
}

function appendDebt (
  callback: (err: NodeJS.ErrnoException | null) => void
): void {
  const name = readlineSync.question('Enter the name: ')
  const amount = parseFloat(readlineSync.question('Enter the amount: '))

  try {
    const existingDebts = fs.readFileSync(file, 'utf-8')
    const debts: Debt[] = JSON.parse(existingDebts)

    debts.push({ name, amount })

    fs.writeFileSync(file, JSON.stringify(debts, null, 2), 'utf-8')
    console.log('Debt added successfully.')
    callback(null)
  } catch (err) {
    console.error('Error appending debt:', err)
    callback(err as NodeJS.ErrnoException)
  }
}

function listDebts (
  callback: (err: NodeJS.ErrnoException | null) => void
): void {
  try {
    const existingDebts = fs.readFileSync(file, 'utf-8')
    const debts: Debt[] = JSON.parse(existingDebts)

    console.log('List of Debts:')
    debts.forEach(debt => {
      console.log(`${debt.name}: $${debt.amount}`)
    })

    callback(null)
  } catch (err) {
    console.error('Error listing debts:', err)
    callback(err as NodeJS.ErrnoException)
  }
}

const [command] = process.argv.slice(2)

if (command === 'read') {
  readFileAsync((err, data) => {
    if (err) {
      console.error('Error reading file:', err)
    } else {
      console.log(data)
    }
  })
} else if (command === 'add') {
  appendDebt(err => {
    if (err) {
      console.error('Error adding debt:', err)
    }
  })
} else if (command === 'list') {
  listDebts(err => {
    if (err) {
      console.error('Error listing debts:', err)
    }
  })
} else {
  console.error('Invalid command. Use "read", "add", or "list".')
}
