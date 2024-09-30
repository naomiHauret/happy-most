import { SUPPORTED_CHAINS, SupportedChainsAliases } from '@happy/chains'
import tokenList from '@happy/token-lists/bridge'
import { type DialogProps, Button, Callout, Input, recipeBox } from '@happy/uikit-react'
import { useEffect, useRef, type FC } from 'react'
import { TbArrowsExchange2 } from 'react-icons/tb'
import { useAccount, useSimulateContract } from 'wagmi'
import { BiChevronDown } from 'react-icons/bi'
import { type URLSearchParamsControlledInput } from '../url-search-params-controlled-input'
import { useAccountDetails } from '../account/use-account-details'
import { useRequestBridge, type ValidSelectedToken } from './use-request-bridge'
import { useSelectedTokenDetails } from './use-selected-token-details'
import abiSimpleERC2O from '@happy/abis/SimpleERC20'
import { parseUnits } from 'viem'
import { TransactionFlowSummary } from './transaction-summary'

enum BridgeSearchParams {
  SourceChain = 'bridge-source',
  DestinationChain = 'bridge-destination',
  QueryToken = 'bridge-query-search-token',
  SelectedToken = 'bridge-selected-token',
  SelectedTokenAmount = 'bridge-selected-token-amount',
}
type TokenInfo = (typeof tokenList.tokenMap)[ValidSelectedToken]

interface CardChainProps {
  flowIndication: string
  chain: string
}
const CardChain: FC<CardChainProps> = (props) => {
  return (
    <div
      className={recipeBox({
        layer: '0',
        demarcation: 'subtle',
        className:
          'px-3 text-[1rem] h-inherit @xs:px-6 py-3 w-full grid items-center leading-tight',
      })}
    >
      <span className="text-[0.7em] font-medium text-neutral-11">{props.flowIndication}</span>
      <span className="text-sm font-semibold text-neutral-12">{props.chain}</span>
    </div>
  )
}

interface BridgeProps {
  amount?: number
  destination: SupportedChainsAliases
  dialogTokenSelectionVisibility: NonNullable<DialogProps['visibility']>
  handleOnSetAmountAsMaxBalance: (value: string) => void
  handleOnSwitchUpChains: () => void
  inputAmountToken: URLSearchParamsControlledInput
  isValid: boolean
  querySearchToken?: string
  selectedToken?: {
    key: ValidSelectedToken
    value: TokenInfo
  }
  source: SupportedChainsAliases
}

/**
 * Bridge widget (form). Allows the user to transfer a given token from chain A to B (given that the token exists on both chains)
 * The form data values (source, destination, amount to bridge)... are reflected as url search parameters
 */
const Bridge: FC<BridgeProps> = (props) => {
  const {
    amount,
    destination,
    dialogTokenSelectionVisibility,
    handleOnSetAmountAsMaxBalance,
    handleOnSwitchUpChains,
    inputAmountToken,
    isValid,
    selectedToken,
    source,
  } = props

  // Currently connected account
  const accountData = useAccount()
  const { isSupportedNetwork } = useAccountDetails()

  // Currently selected token balance (for the given connected account)
  const tokenBalance = useSelectedTokenDetails({
    chainId: SUPPORTED_CHAINS[source].id,
    selectedToken: selectedToken?.value
      ? {
          address: selectedToken?.value?.address as `0x${string}`,
          decimals: selectedToken?.value?.decimals as number,
        }
      : undefined,
    accountAddress: accountData?.address,
  })
  

  const {
    handleSubmitRequest,
    mutationBridgeFlow,
    mutationBurnTokens,
    mutationSendBridgeRequest,
    mutationSwitchChain,
  } = useRequestBridge({tokenBalanceQueryKey: tokenBalance.queryBalanceOf.queryKey})


  const querySimulateBurn = useSimulateContract({
    abi: abiSimpleERC2O,
    address: selectedToken?.value?.address as `0x${string}`,
    functionName: 'burn',
    chainId: SUPPORTED_CHAINS[source].id,
    account: accountData?.address,
    args: [parseUnits(String(!amount ? 0 : amount), selectedToken?.value?.decimals as number)],
    query: {
      enabled:
        accountData?.isConnected &&
        Boolean(selectedToken?.value) &&
        Boolean(!!amount && amount > 0),
    },
  })

  // Select token dialog visibility
  const [isVisible, setDialogVisibility] = dialogTokenSelectionVisibility

  // Token amount to bridge ref
  const inputAmountRef = useRef<any>(null)

  // Form bridge ref (useful to trigger form submit with a hidden button)
  const formRef = useRef()

  // Controlled amount input
  // this allows us to set the amount via buttons in addition of the input
  // not the best but it does the job
  useEffect(() => {
    if (inputAmountRef.current) {
      inputAmountRef.current = Number(inputAmountToken.value ?? '')
    }
  }, [inputAmountToken.value])

  return (
    <div
      className={recipeBox({
        layer: '1',
        demarcation: 'subtle',
        className: 'p-4 grid gap-1.5',
      })}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (
            mutationBridgeFlow.status !== 'pending' &&
            isValid &&
            amount &&
            amount > 0 &&
            tokenBalance?.formatted &&
            amount <= +tokenBalance?.formatted
          ) {
            handleSubmitRequest({
              source,
              destination,
              tokenId: selectedToken?.key as ValidSelectedToken,
              amount,
            })
          }
        }}
        name="bridge-request"
      >
        <div>
          <div className="flex pb-2.5 justify-evenly">
            <CardChain flowIndication="From" chain={SUPPORTED_CHAINS[source].name} />
            <Button
              type="button"
              className="transition-all active:bg-primary-12/10 active:!text-primary-10 active:!border-primary-11/50 relative z-10 !bg-base my-auto min-w-8 justify-center !p-[unset] -mx-3 aspect-square !rounded-full"
              intent="outline"
              aria-label="Click to switch up source chain and destination chain"
              onClick={handleOnSwitchUpChains}
            >
              <TbArrowsExchange2 />
            </Button>
            <CardChain flowIndication="To" chain={SUPPORTED_CHAINS[destination].name} />
          </div>
          <div
            className={recipeBox({
              layer: '2',
              demarcation: 'subtle',
              class:
                'flex justify-between items-center gap-3 hover:bg-mix-neutral-11 focus-within:bg-mix-neutral-11 focus-within:bg-mix-amount-5',
            })}
          >
            <div className="w-full">
              <div className="flex text-2xl  justify-between gap-3 pe-1.5">
                <label className="sr-only" htmlFor={inputAmountToken.name}>
                  Amount of tokens to bridge
                </label>
                <Input
                  placeholder="0.0001"
                  step="0.000000000000000001"
                  min="0"
                  max={tokenBalance?.formatted ? tokenBalance?.formatted : '0'}
                  inputMode="decimal"
                  inputClass="font-bold"
                  intent="ghost"
                  aria-describedby={`${inputAmountToken.name}-help`}
                  {...inputAmountToken}
                  readOnly={mutationBridgeFlow.status === 'pending'}
                  ref={inputAmountRef}
                />

                <Button
                  type="button"
                  aria-disabled={mutationBridgeFlow.status === 'pending'}
                  aria-label="Open token selection modal"
                  intent="neutral"
                  className="self-center text-[0.625em]"
                  onClick={() => setDialogVisibility(true)}
                >
                  <span className="pe-[1ex]">
                    {!selectedToken?.value?.symbol ? 'Select' : `$${selectedToken?.value?.symbol}`}
                  </span>
                  <BiChevronDown className={isVisible ? 'rotate-180' : ''} />
                </Button>
              </div>

              <div className="relative border-t border-inherit focus-within:underline text-neutral-12/60 focus-within:text-primary-9">
                <div className="px-3 py-2 text-xs  " id={`${inputAmountToken.name}-help`}>
                  <span className="sr-only">Maximum value: </span>
                  <span>
                    {tokenBalance?.queryBalanceOf?.status === 'success' ? (
                      <>
                        Your balance: {tokenBalance?.formatted} {selectedToken?.value?.symbol}
                      </>
                    ) : tokenBalance?.queryBalanceOf?.status === 'pending' &&
                      accountData.isConnected ? (
                      <span className="animate-pulse">Loading balance...</span>
                    ) : (
                      '--.--'
                    )}
                  </span>
                </div>

                <button
                  type="button"
                  aria-disabled={mutationBridgeFlow.status === 'pending'}
                  onClick={() => {
                    handleOnSetAmountAsMaxBalance(tokenBalance?.formatted)
                    inputAmountRef.current = +tokenBalance?.formatted
                  }}
                  className="cursor-pointer absolute inset-0 w-full h-full z-10 opacity-0"
                >
                  Use maximum value
                </button>
              </div>
            </div>
          </div>

          <input
            readOnly
            defaultValue={selectedToken?.key}
            name={BridgeSearchParams.SelectedToken}
            id={BridgeSearchParams.SelectedToken}
            type="text"
            hidden
            aria-disabled="true"
          />

          <input
            readOnly
            defaultValue={source}
            name={BridgeSearchParams.SourceChain}
            id={BridgeSearchParams.SourceChain}
            type="text"
            hidden
            aria-disabled="true"
          />
          <input
            readOnly
            defaultValue={destination}
            name={BridgeSearchParams.DestinationChain}
            id={BridgeSearchParams.DestinationChain}
            type="text"
            hidden
            aria-disabled="true"
          />
        </div>
        <input
          ref={formRef}
          aria-disabled={
            isValid === false ||
            !amount ||
            amount === 0 ||
            !tokenBalance?.formatted ||
            +tokenBalance?.formatted === 0 ||
            amount > +tokenBalance?.formatted ||
            mutationBridgeFlow.status === 'pending'
          }
          type="submit"
          hidden
        />
      </form>

      {['pending', 'error'].includes(mutationBridgeFlow.status) && <section
        className='pt-3 animate-fadeIn'
        >
          <p className='text-xs pb-4 px-2 text-center text-neutral-11/70'>Your request is being processed. Follow the steps as indicated below.</p>

          <div className='grid gap-3'>
            <TransactionFlowSummary 
                mutationSwitchChain={mutationSwitchChain}
                shouldSwitchChain={!isSupportedNetwork ||
                  (accountData?.chainId !== SUPPORTED_CHAINS[source].id)}
                transactions={[
                  {
                    id: 'burn-tokens-source-tx',
                    label: "Sign the burn transaction in your wallet",
                    mutationStatus: mutationBurnTokens.status
                  },
                  {
                    id: 'mint-tokens-destination-tx',
                    label: "Wait for your tokens to arrive. Kick back and relax !",
                    mutationStatus: mutationSendBridgeRequest.status

                  }
                ]}
          
            />

          </div>
      </section>}
      {mutationBridgeFlow.status === 'success' && <section className='animate-appear bg-neutral-1 text-xs p-3 rounded-md text-positive-9 border border-positive-9/10' aria-live="polite">
            <p className='font-bold'>Your transaction was processed successfully !</p>
            <p className='font-medium text-neutral-12'>You can check your <a className="underline hover:no-underline focus:no-underline" target="_blank" href={`${mutationBridgeFlow?.data?.mint?.block_explorer?.url}/tx/${mutationBridgeFlow?.data?.mint?.transaction_hash}`}>mint transaction</a> and <a className="underline hover:no-underline focus:no-underline"  target="_blank" href={`${mutationBridgeFlow?.data?.burn?.block_explorer?.url}/tx/${mutationBridgeFlow?.data?.burn?.transaction_hash}`}>burn transaction</a></p>

          </section>}

      <Button
        isLoading={
          [querySimulateBurn.status, mutationBridgeFlow.status].includes('pending') &&
          !!amount &&
          amount > 0 &&
          amount <= +tokenBalance?.formatted
        }
        aria-disabled={
          [querySimulateBurn.status, mutationBridgeFlow.status].includes('pending') ||
          querySimulateBurn.status === 'error'
        }
        onClick={() => {
          if (
            ![querySimulateBurn.status, mutationBridgeFlow.status].includes('pending') &&
            querySimulateBurn.status !== 'error'
          )
            formRef?.current?.click()
        }}
        className="w-full text-lg justify-center min-h-10"
        intent={mutationBridgeFlow.status === 'pending' ? 'ghost' : 'primary'}
        type="button"
      >
        {mutationBridgeFlow.status === 'pending' ? 'Processing...' : 'Bridge'}
      </Button>
      {(amount ?? 0) <= 0 && (
        <Callout className="motion-safe:animate-growIn">
          You can't bridge a negative amount of tokens.
        </Callout>
      )}
      {(amount ?? 0) > (Number(tokenBalance?.formatted) ?? 0) && (
        <Callout className="motion-safe:animate-growIn">
          You don't have this amount of tokens in your wallet.
        </Callout>
      )}
      {querySimulateBurn?.error && (
        <Callout className="motion-safe:animate-growIn">{querySimulateBurn?.error?.name}</Callout>
      )}
      {mutationBridgeFlow?.error && (
        <Callout className="motion-safe:animate-growIn">{mutationBridgeFlow?.error?.name}</Callout>
      )}
    </div>
  )
}

export { Bridge, BridgeSearchParams, type TokenInfo }
