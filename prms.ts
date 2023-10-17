import * as fs from 'fs/promises'
import * as readlineSync from 'readline-sync'

const file = './debts.txt'

interface Debt {
  name: string
  amount: number
}

async function readFileAsync (): Promise<void> {
  try {
    const readTheFile = await fs.readFile(file, 'utf-8')
    console.log(readTheFile)
  } catch (err) {
    console.log(err)
  }
}

async function appendDebt (): Promise<void> {
  try {
    const name = readlineSync.question('Enter the name: ')
    const amount = parseFloat(readlineSync.question('Enter the amount: '))

    const existingDebts = await fs.readFile(file, 'utf-8')
    const debts: Debt[] = JSON.parse(existingDebts)
    debts.push({ name, amount })

    await fs.writeFile(file, JSON.stringify(debts, null, 2), 'utf-8')

    console.log('Debt added successfully.')
  } catch (err) {
    console.error('Error appending debt:', err)
  }
}

async function listDebts (): Promise<void> {
  try {
    const existingDebts = await fs.readFile(file, 'utf-8')
    const debts: Debt[] = JSON.parse(existingDebts)

    console.log('List of Debts:')
    debts.forEach(debt => {
      console.log(`${debt.name}: $${debt.amount}`)
    })
  } catch (err) {
    console.error('Error listing debts:', err)
  }
}

const [command] = process.argv.slice(2)

if (command === 'read') {
  readFileAsync()
} else if (command === 'add') {
  appendDebt()
} else if (command === 'list') {
  listDebts()
} else {
  console.error('Invalid command. Use "read", "add", or "list".')
}
