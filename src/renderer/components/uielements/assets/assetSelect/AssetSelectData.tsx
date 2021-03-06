import React from 'react'

import { bn, formatBN, Asset } from '@xchainjs/xchain-util'
import BigNumber from 'bignumber.js'

import { Network } from '../../../../../shared/api/types'
import { Label } from '../../label'
import { AssetIcon } from '../assetIcon'
import {
  AssetSelectDataWrapper,
  AssetSelectDataWrapperType,
  AssetSelectDataWrapperSize
} from './AssetSelectData.styles'

type Props = {
  asset: Asset
  target?: Asset
  price?: BigNumber
  priceValid?: boolean
  size?: AssetSelectDataWrapperSize
  className?: string
  type?: AssetSelectDataWrapperType
  showAssetName?: boolean
  network: Network
}

export const AssetSelectData: React.FC<Props> = (props): JSX.Element => {
  const {
    asset,
    target,
    price = bn(0),
    priceValid = true,
    size = 'small',
    className = '',
    type = 'normal',
    showAssetName = true,
    network
  } = props
  const formattedPrice = formatBN(price)
  // TODO add valid formatters
  const priceLabel = priceValid && Number(formattedPrice) !== 0 ? `$ ${formattedPrice}` : ''

  return (
    <AssetSelectDataWrapper
      size={size}
      hasTarget={target !== undefined}
      type={type}
      className={`coinData-wrapper ${className}`}>
      {asset && <AssetIcon asset={asset} size={size} network={network} />}
      {showAssetName && (
        <div className="assetSelectData-asset-info">
          <Label className="assetSelectData-asset-label" weight="600">
            {asset?.ticker ?? 'unknown'}
          </Label>
        </div>
      )}
      <div className="asset-price-info">
        <Label size="small" color="gray" weight="bold">
          {priceLabel}
        </Label>
      </div>
    </AssetSelectDataWrapper>
  )
}
