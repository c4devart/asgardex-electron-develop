import { SelectOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { palette } from 'styled-theme'

import { Label as UILabel } from '../../../components/uielements/label'

export const ExternalLinkIcon = styled(SelectOutlined)`
  svg {
    height: 20px;
    width: 20px;
    transform: scale(-1, 1) translateX(5px);
    color: ${palette('text', 1)};
  }
`

export const WalletTypeLabel = styled(UILabel).attrs({
  textTransform: 'uppercase',
  size: 'small'
})`
  font-family: 'MainFontRegular';
  color: ${palette('text', 2)};

  background: ${palette('gray', 0)};
  text-shadow: 1px 1px 1px ${palette('background', 1)};
  border-radius: 5px;
  padding: 1px 7px;
  width: auto;
`
