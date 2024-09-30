import { recipeBox } from '@happy/uikit-react'
import { type FC } from 'react'
import { useAccount } from 'wagmi'
import { useAccountDetails } from '../account/use-account-details'
import { SUPPORTED_CHAINS, SupportedChainsAliases } from '@happy/chains'

/*
- Confirming there should add/switch the chain if necessary, then trigger the burn transaction without requiring an extra click — though a button should be present in case the user cancels the tx or something goes awry.
- After the user confirms the tx in his wallet, sent a request to the backend, then show a waiting modal, and then a confirmation when the transaction lands on the destination chain (the backend will provide a transaction hash, see below).
- The two points above are different from how Superbridge handles things (it uses the “Activity” view that you don't have to implement).
*/

interface SummaryBridgeTransactionProps {
  source: SupportedChainsAliases
  destination: SupportedChainsAliases
  token: {
    amount: number
    id: string
  }
}

const SummaryBridgeTransaction: FC<SummaryBridgeTransactionProps> = (props) => {
  const { source, destination } = props
  const account = useAccount()
  const { isSupportedNetwork } = useAccountDetails()
  return (
    <section
      className={recipeBox({
        layer: '0',
        demarcation: 'subtle',
        className: '',
      })}
    >
      <ol>
        {!isSupportedNetwork ||
          (account.chainId !== SUPPORTED_CHAINS[source].id && <li>Switch network</li>)}
        <li>Burn tokens transaction</li>
        <li>Minting tokens on {SUPPORTED_CHAINS[destination]?.name}</li>
      </ol>
    </section>
  )
}

export { SummaryBridgeTransaction }
