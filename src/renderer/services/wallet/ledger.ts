import * as RD from '@devexperts/remote-data-ts'
import { Chain } from '@xchainjs/xchain-util'
import * as FP from 'fp-ts/lib/function'
import * as Rx from 'rxjs'
import * as RxOp from 'rxjs/operators'

import { LedgerErrorId, Network } from '../../../shared/api/types'
import { isError } from '../../../shared/utils/guard'
import { eqLedgerAddressMap } from '../../helpers/fp/eq'
import { observableState } from '../../helpers/stateHelper'
import { INITIAL_LEDGER_ADDRESSES_MAP } from './const'
import {
  KeystoreState,
  KeystoreState$,
  LedgerAddressesMap,
  LedgerAddressLD,
  LedgerAddressRD,
  LedgerService
} from './types'
import { hasImportedKeystore } from './util'

export const createLedgerService = ({ keystore$ }: { keystore$: KeystoreState$ }): LedgerService => {
  // State of all added Ledger addresses
  const {
    get$: ledgerAddresses$,
    get: ledgerAddresses,
    set: setLedgerAddresses
  } = observableState<LedgerAddressesMap>(INITIAL_LEDGER_ADDRESSES_MAP)

  const setLedgerAddressRD = ({
    addressRD,
    chain,
    network,
    walletIndex = 0
  }: {
    addressRD: LedgerAddressRD
    chain: Chain
    network: Network
    walletIndex: number
  }) => {
    const addresses = ledgerAddresses()
    // TODO(@asgdx-team) Let's think about to use `immer` or similar library for deep, immutable state changes
    return setLedgerAddresses({
      ...addresses,
      [chain]: {
        addresses: {
          ...addresses[chain]['addresses'],
          [network]: addressRD
        },
        walletIndex: walletIndex
      }
    })
  }

  /**
   * Get ledger address from memory
   */
  const getLedgerAddress$ = (chain: Chain, network: Network): LedgerAddressLD =>
    FP.pipe(
      ledgerAddresses$,
      RxOp.map((addressesMap) => addressesMap[chain].addresses),
      RxOp.distinctUntilChanged(eqLedgerAddressMap.equals),
      RxOp.map((addressMap) => addressMap[network])
    )

  const getWalletIndex$ = (chain: Chain): Rx.Observable<number> =>
    FP.pipe(
      ledgerAddresses$,
      RxOp.map((addressesMap) => addressesMap[chain].walletIndex)
    )

  const verifyLedgerAddress = (chain: Chain, network: Network, walletIndex = 0): void =>
    window.apiHDWallet.verifyLedgerAddress({ chain, network, walletIndex })

  /**
   * Removes ledger address from memory
   */
  const removeLedgerAddress = (chain: Chain, network: Network): void =>
    setLedgerAddressRD({
      addressRD: RD.initial,
      chain,
      network,
      walletIndex: 0
    })

  /**
   * Sets ledger address in `pending` state
   */
  const setPendingLedgerAddress = (chain: Chain, network: Network): void =>
    setLedgerAddressRD({
      addressRD: RD.pending,
      chain,
      network,
      walletIndex: 0
    })

  /**
   * Ask Ledger to get address from it
   */
  const askLedgerAddress$ = (chain: Chain, network: Network, walletIndex = 0): LedgerAddressLD =>
    FP.pipe(
      // remove address from memory
      removeLedgerAddress(chain, network),
      // set pending
      () => setPendingLedgerAddress(chain, network),
      // ask for ledger address
      () => Rx.from(window.apiHDWallet.getLedgerAddress({ chain, network, walletIndex })),
      RxOp.map(RD.fromEither),
      // store address in memory
      RxOp.tap((addressRD: LedgerAddressRD) => setLedgerAddressRD({ chain, addressRD, network, walletIndex })),
      RxOp.catchError((error) =>
        Rx.of(
          RD.failure({
            errorId: LedgerErrorId.GET_ADDRESS_FAILED,
            msg: isError(error) ? error.toString() : `${error}`
          })
        )
      ),
      RxOp.startWith(RD.pending)
    )

  // Whenever keystore has been removed, reset all stored ledger addresses
  const keystoreSub = keystore$.subscribe((keystoreState: KeystoreState) => {
    if (!hasImportedKeystore(keystoreState)) {
      setLedgerAddresses(INITIAL_LEDGER_ADDRESSES_MAP)
    }
  })

  const dispose = () => {
    keystoreSub.unsubscribe()
    setLedgerAddresses(INITIAL_LEDGER_ADDRESSES_MAP)
  }

  return { askLedgerAddress$, getLedgerAddress$, verifyLedgerAddress, removeLedgerAddress, getWalletIndex$, dispose }
}
