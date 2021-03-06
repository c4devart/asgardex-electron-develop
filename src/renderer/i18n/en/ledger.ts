import { LedgerMessages } from '../types'

const ledger: LedgerMessages = {
  'ledger.title': 'Ledger',
  'ledger.add.device': 'Add ledger',
  'ledger.error.nodevice': 'No device connected',
  'ledger.error.inuse': 'Ledger is already in use for another app',
  'ledger.error.appnotopened': 'Ledger app is not opened',
  'ledger.error.noapp': 'No Ledger app opened. Please open appropriate app on Ledger.',
  'ledger.error.getaddressfailed': 'Getting address from Ledger failed',
  'ledger.error.signfailed': 'Signing transaction by Ledger failed',
  'ledger.error.sendfailed': 'Sending transaction by Ledger failed',
  'ledger.error.depositfailed': 'Sending deposit transaction by Ledger failed',
  'ledger.error.invalidpubkey': 'Invalid public key for using Ledger.',
  'ledger.error.invaliddata': 'Invalid data.',
  'ledger.error.invalidresponse': 'Invalid response after sending transaction using Ledger.',
  'ledger.error.rejected': 'Action on Ledger was rejected.',
  'ledger.error.timeout': 'Timeout to handle action on Ledger.',
  'ledger.error.notimplemented': 'Action has not been implemented for Ledger.',
  'ledger.error.denied': 'Usage of Ledger has been denied',
  'ledger.error.unknown': 'Unknown Error'
}

export default ledger
