import React, { useState, useMemo, useCallback } from 'react'

import { assetAmount, bn, formatAssetAmountCurrency } from '@xchainjs/xchain-util'
import { Row, Dropdown } from 'antd'
import BigNumber from 'bignumber.js'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/pipeable'
import { useIntl } from 'react-intl'

import { ReactComponent as DownIcon } from '../../assets/svg/icon-down.svg'
import { sequenceTOption } from '../../helpers/fpHelpers'
import { ChangeSlipToleranceHandler } from '../../services/app/types'
import { PoolAssetDetail } from '../../services/midgard/types'
import { SlipTolerance } from '../../types/asgardex'
import * as Styled from './CurrencyInfo.styles'

type CurrencyInfoProps = {
  from?: O.Option<PoolAssetDetail>
  to?: O.Option<PoolAssetDetail>
  slip?: BigNumber
  isCausedSlippage: boolean
  slipTolerance: SlipTolerance
  changeSlipTolerance: ChangeSlipToleranceHandler
}

export const SLIP_PERCENTAGES: SlipTolerance[] = [3, 5, 10]
export const SLIP_TOLERANCE_KEY = 'asgdx-slip-tolerance'

export const CurrencyInfo = ({
  to = O.none,
  from = O.none,
  slip = bn(0),
  isCausedSlippage,
  slipTolerance,
  changeSlipTolerance
}: CurrencyInfoProps) => {
  const intl = useIntl()
  const [slipDropdownVisible, setSlipDropdownVisible] = useState(false)

  const changeSlipToleranceHandler = useCallback(
    (slipTolerance) => {
      localStorage.setItem(SLIP_TOLERANCE_KEY, slipTolerance)
      changeSlipTolerance(slipTolerance)
      setSlipDropdownVisible(false)
    },
    [changeSlipTolerance]
  )

  const slipSettings = useMemo(() => {
    return (
      <>
        {SLIP_PERCENTAGES.map((slip) => (
          <Row style={{ alignItems: 'center' }} key={slip}>
            <Styled.SlipLabel key={slip} onClick={() => changeSlipToleranceHandler(slip)}>
              {slip}%
            </Styled.SlipLabel>
          </Row>
        ))}
      </>
    )
  }, [changeSlipToleranceHandler])

  const renderSlipSettings = useMemo(
    () => (
      <Dropdown
        onVisibleChange={(visible) => setSlipDropdownVisible(visible)}
        visible={slipDropdownVisible}
        overlay={slipSettings}
        trigger={['click']}
        placement="bottomCenter">
        <Styled.DropdownContentWrapper style={{ alignItems: 'center', width: '50px' }}>
          <Styled.SlipLabel>{slipTolerance}%</Styled.SlipLabel>
          <DownIcon />
        </Styled.DropdownContentWrapper>
      </Dropdown>
    ),
    [slipSettings, slipTolerance, slipDropdownVisible]
  )

  return pipe(
    sequenceTOption(from, to),
    O.map(([from, to]) => {
      return (
        <Styled.Container key={'currency info'}>
          <div>
            {formatAssetAmountCurrency({
              asset: from.asset,
              amount: assetAmount(1),
              trimZeros: true
            })}{' '}
            ={' '}
            {formatAssetAmountCurrency({
              asset: to.asset,
              amount: assetAmount(from.assetPrice.dividedBy(to.assetPrice)),
              trimZeros: true
            })}
          </div>
          <div>
            {formatAssetAmountCurrency({
              asset: to.asset,
              amount: assetAmount(1),
              trimZeros: true
            })}{' '}
            ={' '}
            {formatAssetAmountCurrency({
              asset: from.asset,
              amount: assetAmount(to.assetPrice.dividedBy(from.assetPrice)),
              trimZeros: true
            })}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
              {isCausedSlippage ? (
                <Styled.SlipToleranceWarning>
                  {intl.formatMessage({ id: 'swap.slip.title' })}: {slip.toNumber().toFixed(0)}%
                </Styled.SlipToleranceWarning>
              ) : (
                <Styled.SlipToleranceText>
                  {intl.formatMessage({ id: 'swap.slip.title' })}: {slip.toNumber().toFixed(0)}%
                </Styled.SlipToleranceText>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Styled.SlipToleranceText>{intl.formatMessage({ id: 'swap.slip.tolerance' })}:</Styled.SlipToleranceText>
              {renderSlipSettings}
            </div>
          </div>
        </Styled.Container>
      )
    }),
    O.toNullable
  )
}
