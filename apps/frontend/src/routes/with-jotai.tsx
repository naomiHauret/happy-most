import { SUPPORTED_CHAINS, SupportedChainsAliases } from '@happy/chains'
import tokenList from '@happy/token-lists/bridge'
import { createFileRoute } from '@tanstack/react-router'
import { atom, useAtom } from 'jotai'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { nativeEnum, number, object, string } from 'zod'
import { Bridge, BridgeSearchParams, type ValidSelectedToken } from '~/components/bridge'
import { DialogTokenSelection } from '~/components/dialog-token-selection'
import { AppRoutes } from '~/config'

/**
 * Validation schema for bridge widget
 */
const bridgeSchema = object({
  [BridgeSearchParams.SourceChain]: nativeEnum(SupportedChainsAliases).default(
    SupportedChainsAliases.HappyChainSepolia,
  ),
  [BridgeSearchParams.DestinationChain]: nativeEnum(SupportedChainsAliases).default(
    SupportedChainsAliases.OptimismSepolia,
  ),
  [BridgeSearchParams.QueryToken]: string().default('').optional(),
  [BridgeSearchParams.SelectedToken]: string()
    .refine((val) => Object.keys(tokenList.tokenMap).includes(val), {
      message: 'Please select a valid token to bridge.',
    })
    .optional(),
  [BridgeSearchParams.SelectedTokenAmount]: number().positive().optional(),
}).refine(
  (val) => val[BridgeSearchParams.DestinationChain] !== val[BridgeSearchParams.SourceChain],
  {
    message: 'Destination and source chains must be different.',
  },
)

export const Route = createFileRoute(AppRoutes.jotaiVersion)({
  component: WithJotai,
})

/**
 * Bridge state
 */
const bridgeAtom = atom<{
  [BridgeSearchParams.SourceChain]: SupportedChainsAliases
  [BridgeSearchParams.DestinationChain]: SupportedChainsAliases
  [BridgeSearchParams.SelectedToken]?: ValidSelectedToken
  [BridgeSearchParams.SelectedTokenAmount]?: number
  [BridgeSearchParams.QueryToken]?: string
}>({
  [BridgeSearchParams.SourceChain]: SupportedChainsAliases.HappyChainSepolia,
  [BridgeSearchParams.DestinationChain]: SupportedChainsAliases.OptimismSepolia,
  [BridgeSearchParams.SelectedToken]: undefined,
  [BridgeSearchParams.SelectedTokenAmount]: undefined,
  [BridgeSearchParams.QueryToken]: '',
})

function WithJotai() {
  // Dialog token selection visibility
  const dialogTokenSelectionVisibility = useState(false)
  const [bridgeState, setBridgeState] = useAtom(bridgeAtom)

  // Debounced user input (token amount)
  const debouncedAmountValue = useDebouncedCallback(
    (value) => {
      if (!isNaN(value) && value > 0) {
        setBridgeState({
          ...bridgeState,
          [BridgeSearchParams.SelectedTokenAmount]: +value,
        })
      } else {
        setBridgeState({
          ...bridgeState,
          [BridgeSearchParams.SelectedTokenAmount]: undefined,
        })
      }
    },
    // delay in ms
    200,
  )
  return (
    <>
      <div className="@container w-full mx-auto max-w-lg">
        <div className="py-8">
          <h1 className="text-center text-3xl italic text-neutral-12 pb-7 font-bold">
            Happy Bridge! (with jotai under the hood)
          </h1>
          <p className="text-sm text-center text-neutral-11">
            Select the token you want to bridge from chain A and to chain B. It's done in just a few
            seconds !
          </p>
        </div>

        <Bridge
          // Selected token amount
          amount={Number(bridgeState[BridgeSearchParams.SelectedTokenAmount]) ?? 0}
          // Bridge to
          destination={bridgeState[BridgeSearchParams.DestinationChain]}
          // Token selection dialog visibility
          dialogTokenSelectionVisibility={dialogTokenSelectionVisibility}
          handleOnSwitchUpChains={() => {
            let tokenSelection = bridgeState[BridgeSearchParams.SelectedToken]
            const destination = bridgeState[BridgeSearchParams.DestinationChain]
            const updatedSearchParams = {
              ...bridgeState,
              [BridgeSearchParams.DestinationChain]: bridgeState[BridgeSearchParams.SourceChain],
              [BridgeSearchParams.SourceChain]: bridgeState[BridgeSearchParams.DestinationChain],
            }
            if (tokenList.tokenMap?.[tokenSelection as ValidSelectedToken]) {
              const token = tokenList.tokenMap[tokenSelection as ValidSelectedToken]
              const chain = SUPPORTED_CHAINS[destination].id.toString()
              //@ts-ignore (sorry)
              const newTokenAddress = token?.extensions.bridge?.[chain]?.tokenAddress as string
              const newTokenId = `${chain}_${newTokenAddress}` as ValidSelectedToken
              updatedSearchParams[BridgeSearchParams.SelectedToken] = newTokenId
            }

            // When user switch up chains (supported chains), update selected token
            setBridgeState(updatedSearchParams)
          }}
          handleOnSetAmountAsMaxBalance={(value: string) => {
            // Update token amount with current selected token user balance value
            setBridgeState({
              ...bridgeState,
              [BridgeSearchParams.SelectedTokenAmount]: parseFloat(value),
            })
          }}
          // Token amount input props
          inputAmountToken={{
            name: BridgeSearchParams.SelectedTokenAmount,
            id: BridgeSearchParams.SelectedTokenAmount,
            defaultValue: bridgeState[BridgeSearchParams.SelectedTokenAmount] ?? '',
            onInput: (e) => {
              debouncedAmountValue(e.currentTarget.value)
            },
          }}
          // Currently selected token
          selectedToken={{
            key: bridgeState[BridgeSearchParams.SelectedToken] as ValidSelectedToken,
            value:
              tokenList.tokenMap?.[
                bridgeState[BridgeSearchParams.SelectedToken] as ValidSelectedToken
              ],
          }}
          // Bridge token from
          source={bridgeState[BridgeSearchParams.SourceChain]}
          // 1st validation step
          isValid={bridgeSchema.parse(bridgeState) ? true : false}
        />
      </div>

      <DialogTokenSelection
        filters={{
          sourceChain: bridgeState[BridgeSearchParams.SourceChain],
          queryToken: bridgeState[BridgeSearchParams.QueryToken] ?? '',
          selectedToken: bridgeState[BridgeSearchParams.SelectedToken],
        }}
        handleOnSelectToken={(value: string) => {
          setBridgeState({
            ...bridgeState,
            [BridgeSearchParams.SelectedToken]: value as ValidSelectedToken,
          })
        }}
        inputQuerySearchToken={{
          defaultValue: bridgeState[BridgeSearchParams.QueryToken] ?? '',
          name: BridgeSearchParams.QueryToken,
          id: BridgeSearchParams.QueryToken,
          onInput: (e) => {
            const value = e.currentTarget.value.trim()
            setBridgeState({
              ...bridgeState,
              [BridgeSearchParams.QueryToken]: value === '' ? undefined : value,
            })
          },
        }}
        visibility={dialogTokenSelectionVisibility}
      />
    </>
  )
}
