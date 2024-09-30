import { recipeBox } from "@happy/uikit-react"
import { cva } from "class-variance-authority"
import { type FC } from "react"
import { BiLoader, BiCheck, BiSolidErrorCircle } from "react-icons/bi"
import { type UseSwitchChainReturnType, type Config } from "wagmi"

type ActionStatus ='idle' | 'pending' | 'error' | 'success'
interface ActionIndicatorProps {
    status: ActionStatus
}
const ActionIndicator: FC<ActionIndicatorProps>= (props) => {
    return <span >
    {props.status === 'pending' && <BiLoader className="animate-spin text-[1.25em]" />}
    {props.status === 'success' && <BiCheck className="animate-fadeIn text-positive-9 text-[1.25em]" />}
    {props.status === 'error' && <BiSolidErrorCircle className="animate-fadeIn text-negative-9 text-[1.25em]" />}
    </span>
}

const labelActionLine = cva('items-center inline-flex gap-[2ex]', {
    variants: {
      status: {
        idle: '[&_span]:last:opacity-50',
        default: '',
      },
    },
    defaultVariants: {
      status: 'default',
    },
  })
  

interface TransactionFlowSummaryProps {
    mutationSwitchChain: UseSwitchChainReturnType<Config, unknown>
    shouldSwitchChain: boolean,
    transactions: Array<{
        id: string
        mutationStatus: ActionStatus
        label: React.ReactNode
    }>
}
  const TransactionFlowSummary: FC<TransactionFlowSummaryProps> = (props) => {
    const { mutationSwitchChain, shouldSwitchChain, transactions } = props
 return <ol className={recipeBox({
    layer: '0',
    demarcation: 'subtle',
    class: 'border-t border-neutral-11/10 divide-y [&_li]:px-2 [&_li]:py-2  divide-neutral-11/10 text-xs',
  })} >
               {shouldSwitchChain && (
                <li className={labelActionLine({status: mutationSwitchChain.status === 'idle' ? 'idle' : 'default'})}>
                  
                <ActionIndicator status={mutationSwitchChain.status} />
                <span data-label className={mutationSwitchChain.status === 'pending' ? 'animate-pulse' : ''}>
                  Switch network in your wallet
                </span>

                </li>
              )}
    {transactions.map(tx => {
        return <li key={tx.id} className={labelActionLine({status: tx.mutationStatus === 'idle' ? 'idle' : 'default'})}>
                  
        <ActionIndicator status={tx.mutationStatus} />
        <span className={tx.mutationStatus === 'pending' ? 'animate-pulse' : ''}>
          {tx.label}
        </span>

        </li>
        
  
    })}
  </ol>


}

export { TransactionFlowSummary }