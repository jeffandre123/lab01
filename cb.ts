import * as fs from 'fs'
import * as readlineSync from 'readline-sync'

const file = './debts.txt'

interface Debt {
  name: string
  amount: number
}

type CallbackFunction = (err: NodeJS.ErrnoException | null) => void

function readFileAsync (callback: CallbackFunction): void {
  fs.readFile(file, 'utf-8', (err, readTheFile) => {
    if (err) {
      callback(err)
    } else {
      callback(null)
      console.log(readTheFile)
    }
  })
}

function appendDebt (callback: CallbackFunction): void {
  try {
    const name = readlineSync.question('Enter the name: ')
    const amount = parseFloat(readlineSync.question('Enter the amount: '))

    fs.readFile(file, 'utf-8', (readErr, existingDebts) => {
      if (readErr) {
        callback(readErr)
      } else {
        try {
          const debts: Debt[] = JSON.parse(existingDebts)

          debts.push({ name, amount })

          fs.writeFile(
            file,
            JSON.stringify(debts, null, 2),
            'utf-8',
            writeErr => {
              if (writeErr) {
                callback(writeErr)
              } else {
                console.log('Debt added successfully.')
                callback(null)
              }
            }
          )
        } catch (parseErr) {
          console.error('Error parsing debts:', parseErr)
          callback(parseErr as NodeJS.ErrnoException)
        }
      }
    })
  } catch (err) {
    console.error('Error appending debt:', err)
    callback(err as NodeJS.ErrnoException)
  }
}

function listDebts (callback: CallbackFunction): void {
  fs.readFile(file, 'utf-8', (err, existingDebts) => {
    if (err) {
      callback(err)
    } else {
      try {
        const debts: Debt[] = JSON.parse(existingDebts)

        console.log('List of Debts:')
        debts.forEach(debt => {
          console.log(`${debt.name}: $${debt.amount}`)
        })

        callback(null)
      } catch (parseErr) {
        console.error('Error parsing debts:', parseErr)
        callback(parseErr as NodeJS.ErrnoException)
      }
    }
  })
}

const [command] = process.argv.slice(2)

if (command === 'read') {
  readFileAsync(err => {
    if (err) {
      console.error('Error reading file:', err)
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
