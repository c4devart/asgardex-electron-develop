import { SwapMessages } from '../types'

const swap: SwapMessages = {
  'swap.state.pending': 'Échange en cours',
  'swap.state.success': 'Échange réussi',
  'swap.state.error': "Erreur lors de l'échange",
  'swap.input': 'Entrée',
  'swap.output': 'Sortie',
  'swap.recipient': 'Destinataire',
  'swap.info.max.fee': "Solde total de l'actif moins les frais d'échange estimés",
  'swap.slip.title': 'Slippage',
  'swap.slip.tolerance': 'Tolérance de slippage',
  'swap.errors.amount.balanceShouldCoverChainFee':
    '{fee} de frais de transaction doivent être couverts par votre solde (actuellement {balance}).',
  'swap.errors.amount.outputShouldCoverChainFee':
    '{fee} de frais de sortie doivent être couverts par la réception du montant (actuellement {amount}).',
  'swap.note.lockedWallet': 'Vous devez déverrouiller votre portefeuille pour échanger',
  'swap.note.nowallet': 'Créez ou importez un portefeuille pour échanger',
  'swap.errors.asset.missingSourceAsset': 'Actif source manquant',
  'swap.errors.asset.missingTargetAsset': 'Actif cible manquant'
}

export default swap
