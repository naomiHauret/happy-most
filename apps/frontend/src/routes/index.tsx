import { SUPPORTED_CHAINS, SupportedChainsAliases } from '@happy/chains'
import tokenList from '@happy/token-lists/bridge'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { fallback, zodSearchValidator } from '@tanstack/router-zod-adapter'
import { useState } from 'react'
import { AppRoutes } from '~/config'
import { Bridge, BridgeSearchParams, type ValidSelectedToken } from '~/components/bridge'
import { DialogTokenSelection } from '~/components/dialog-token-selection'
import { useDebouncedCallback } from 'use-debounce'
import { object, nativeEnum, string, number } from 'zod'

/**
 * Validation schema for bridge widget
 * The bridge widget uses URLSearchParams as its state source, so we need to ensure type safety for the related search parameters
 */
const bridgeSchema = fallback(
  object({
    [BridgeSearchParams.SourceChain]: fallback(
      nativeEnum(SupportedChainsAliases),
      SupportedChainsAliases.HappyChainSepolia,
    ).default(SupportedChainsAliases.HappyChainSepolia),
    [BridgeSearchParams.DestinationChain]: fallback(
      nativeEnum(SupportedChainsAliases),
      SupportedChainsAliases.OptimismSepolia,
    ).default(SupportedChainsAliases.OptimismSepolia),
    [BridgeSearchParams.QueryToken]: string().optional(),
    [BridgeSearchParams.SelectedToken]: string().optional(),
    [BridgeSearchParams.SelectedTokenAmount]: number().positive().optional(),
  }),
  {
    // Default parameters values
    [BridgeSearchParams.SourceChain]: SupportedChainsAliases.HappyChainSepolia,
    [BridgeSearchParams.DestinationChain]: SupportedChainsAliases.OptimismSepolia,
  },
).transform((val) => {
  // Basic transformation to ensure source and destination chains are different
  if (val[BridgeSearchParams.DestinationChain] !== val[BridgeSearchParams.SourceChain]) return val
  return {
    ...val,
    [BridgeSearchParams.DestinationChain]:
      val[BridgeSearchParams.SourceChain] === SupportedChainsAliases.HappyChainSepolia
        ? SupportedChainsAliases.OptimismSepolia
        : SupportedChainsAliases.HappyChainSepolia,
  }
})

export const Route = createFileRoute(AppRoutes.home)({
  component: HomeComponent,
  validateSearch: zodSearchValidator(bridgeSchema),
})

function HomeComponent() {
  // URLSearchParameters for this page
  // This technically contains the state of the bridge widget
  const search = useSearch({ from: Route.fullPath })

  // Dialog token selection visibility
  const dialogTokenSelectionVisibility = useState(false)

  // Used to update URLSearchParameters (our state engine)
  const navigate = useNavigate({ from: Route.fullPath })

  // Debounced user input (token amount)
  const debouncedAmountValue = useDebouncedCallback(
    (value) => {
      if (!isNaN(value) && value > 0) {
        navigate({
          search: {
            ...search,
            [BridgeSearchParams.SelectedTokenAmount]: +value,
          },
        })
      } else {
        navigate({
          search: {
            ...search,
            [BridgeSearchParams.SelectedTokenAmount]: undefined,
          },
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
            Happy Bridge!
          </h1>
          <p className="text-sm text-center text-neutral-11">
            Select the token you want to bridge from chain A and to chain B. It's done in just a few
            seconds !
          </p>
        </div>

        <Bridge
          // Selected token amount
          amount={Number(search[BridgeSearchParams.SelectedTokenAmount]) ?? 0}
          // Bridge to
          destination={search[BridgeSearchParams.DestinationChain]}
          // Token selection dialog visibility
          dialogTokenSelectionVisibility={dialogTokenSelectionVisibility}
          handleOnSwitchUpChains={() => {
            let tokenSelection = search[BridgeSearchParams.SelectedToken]
            const destination = search[BridgeSearchParams.DestinationChain]
            const updatedSearchParams = {
              ...search,
              [BridgeSearchParams.DestinationChain]: search[BridgeSearchParams.SourceChain],
              [BridgeSearchParams.SourceChain]: search[BridgeSearchParams.DestinationChain],
            }
            if (tokenList.tokenMap?.[tokenSelection as ValidSelectedToken]) {
              const token = tokenList.tokenMap[tokenSelection as ValidSelectedToken]
              const chain = SUPPORTED_CHAINS[destination].id.toString()
              //@ts-ignore (sorry)
              const newTokenAddress = token?.extensions.bridge?.[chain]?.tokenAddress as string
              const newTokenId = `${chain}_${newTokenAddress}`
              updatedSearchParams[BridgeSearchParams.SelectedToken] = newTokenId
            }

            // When user switch up chains (supported chains), update selected token
            navigate({
              search: updatedSearchParams,
            })
          }}
          handleOnSetAmountAsMaxBalance={(value: string) => {
            // Update token amount with current selected token user balance value
            navigate({
              search: {
                ...search,
                [BridgeSearchParams.SelectedTokenAmount]: parseFloat(value),
              },
            })
          }}
          // Token amount input props
          inputAmountToken={{
            name: BridgeSearchParams.SelectedTokenAmount,
            id: BridgeSearchParams.SelectedTokenAmount,
            defaultValue: search[BridgeSearchParams.SelectedTokenAmount] ?? '',
            onInput: (e) => {
              debouncedAmountValue(e.currentTarget.value)
            },
          }}
          // Currently selected token (uses URLSearchParams as its source of truth)
          selectedToken={{
            key: search[BridgeSearchParams.SelectedToken] as ValidSelectedToken,
            value:
              tokenList.tokenMap?.[search[BridgeSearchParams.SelectedToken] as ValidSelectedToken],
          }}
          // Bridge token from (uses URLSearchParams as its source of truth)
          source={search[BridgeSearchParams.SourceChain]}
          // If the current URLSearchParams matches the schema we defined.
          // You can consider this is a first step for verification (ensuring the source of truth is as truthy as possible since users can input stuff in the url)
          isValid={bridgeSchema.parse(search) ? true : false}
        />
      </div>

      <DialogTokenSelection
        filters={{
          sourceChain: search[BridgeSearchParams.SourceChain],
          queryToken: search[BridgeSearchParams.QueryToken] ?? '',
          selectedToken: search[BridgeSearchParams.SelectedToken],
        }}
        handleOnSelectToken={(value: string) => {
          navigate({
            search: {
              ...search,
              [BridgeSearchParams.SelectedToken]: value,
            },
          })
        }}
        inputQuerySearchToken={{
          defaultValue: search[BridgeSearchParams.QueryToken] ?? '',
          name: BridgeSearchParams.QueryToken,
          id: BridgeSearchParams.QueryToken,
          onInput: (e) => {
            const value = e.currentTarget.value.trim()
            navigate({
              search: {
                ...search,
                [BridgeSearchParams.QueryToken]: value === '' ? undefined : value,
              },
            })
          },
        }}
        visibility={dialogTokenSelectionVisibility}
      />
    </>
  )
}
