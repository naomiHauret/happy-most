import { SUPPORTED_CHAINS, type SupportedChainsAliases } from '@happy/chains'
import tokenList from '@happy/token-lists/bridge'
import { RadioGroup } from '@ark-ui/react'
import { Button, Dialog, type DialogProps, Input } from '@happy/uikit-react'
import { useMemo, type FC } from 'react'
import { type URLSearchParamsControlledInput } from '../url-search-params-controlled-input'

type TokenSelectionFilters = {
  sourceChain: SupportedChainsAliases
  queryToken: string
  selectedToken?: string
}
interface DialogTokenSelectionProps extends Pick<DialogProps, 'visibility'> {
  filters: TokenSelectionFilters
  handleOnSelectToken: (value: string) => void
  inputQuerySearchToken: URLSearchParamsControlledInput
}

/**
 * Modal token selection widget.
 * Allows the user to filter and select a token from a list of supported tokens.
 * The selected token is reflected as a url search parameter
 */
const DialogTokenSelection: FC<DialogTokenSelectionProps> = (props) => {
  const {
    handleOnSelectToken,
    filters: { sourceChain, queryToken, selectedToken },
    inputQuerySearchToken,
    visibility,
  } = props
  const filteredTokens = useMemo(() => {
    const chainId = SUPPORTED_CHAINS[sourceChain].id
    return Object.entries(tokenList.tokenMap).filter(([key, value]) => {
      const query = queryToken.toLowerCase()
      if (
        value.chainId === chainId &&
        (value.name.toLowerCase().includes(query) ||
          value.symbol.includes(query) ||
          value.address.includes(query))
      ) {
        return value
      }
    })
  }, [tokenList.tokenMap, sourceChain, queryToken])
  const [, setDialogVisibility] = visibility
  return (
    <>
      <Dialog
        visibility={visibility}
        title="Select a token"
        description="Click on a token to select it and continue."
        actions={
          <Button
            className="overflow-hidden text-sm font-medium w-full h-full rounded-t-none min-h-12 justify-center"
            intent={selectedToken ? 'ghost-primary' : 'ghost'}
            onClick={() => setDialogVisibility(false)}
          >
            {selectedToken ? 'Continue' : 'Go back'}
          </Button>
        }
      >
        <div className="grid gap-5">
          <div>
            <label className="sr-only" htmlFor={inputQuerySearchToken.id}>
              Search token by name, symbol or address
            </label>
            <Input
              {...inputQuerySearchToken}
              aria-controls="filtered-tokens-list"
              aria-describedby={`${inputQuerySearchToken.id}-indications`}
            />
            <p className="sr-only" id={`${inputQuerySearchToken.id}-indications`}>
              The tokens list will update as you type.
            </p>
          </div>

          <div
            role="region"
            id="filtered-tokens-list"
            aria-atomic="true"
            aria-live="polite"
            className="-mx-4 lg:-mx-5 border-t border-inherit pt-3 "
          >
            <RadioGroup.Root
              defaultValue={queryToken}
              onValueChange={(e: { value: string }) => handleOnSelectToken(e.value)}
              orientation="vertical"
            >
              <RadioGroup.Label className="sr-only">Tokens</RadioGroup.Label>
              <RadioGroup.Indicator />
              <div className="grid @container gap-3">
                {filteredTokens.map(([key, value]) => (
                  <RadioGroup.Item
                    key={key}
                    value={key}
                    className="hover:bg-neutral-11/5 [&[data-state=checked]]:bg-primary-9/10 cursor-pointer pt-2.5 pb-1.5"
                  >
                    <RadioGroup.ItemText className="rounded-none flex justify-center flex-col @xs:flex-row relative gap-3 ps-2 pe-5 focus-within:ring-4 focus-within:ring-primary-9/25">
                      <div className="self-start shrink-0 w-8 h-8 rounded-full overflow-hidden bg-neutral-12/5">
                        <img
                          className="w-full h-full object-cover"
                          loading="lazy"
                          width="32"
                          height="32"
                          src={value.logoURI}
                          alt={`$${value.symbol} (${SUPPORTED_CHAINS[sourceChain].name})`}
                        />
                      </div>
                      <div className="grid grow">
                        <span className="font-medium text-neutral-12">{value.name}</span>
                        <span className="text-sm text-neutral-11 text-[0.95em]">
                          ${value.symbol}
                        </span>
                        <span className="max-w-[10ex] text-[0.75em] text-neutral-10 font-mono overflow-hidden overflow-ellipsis">
                          {value.address}
                        </span>
                      </div>
                      {selectedToken === key && (
                        <span className="font-bold motion-safe:animate-growIn text-xs text-primary-11 self-center">
                          Selected
                        </span>
                      )}
                    </RadioGroup.ItemText>
                    <RadioGroup.ItemControl />
                    <RadioGroup.ItemHiddenInput />
                  </RadioGroup.Item>
                ))}
              </div>
            </RadioGroup.Root>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export { DialogTokenSelection }
