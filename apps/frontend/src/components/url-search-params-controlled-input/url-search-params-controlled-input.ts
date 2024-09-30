import { type InputProps } from '@happy/uikit-react'

type URLSearchParamsControlledInput = InputProps & {
  defaultValue?: NonNullable<InputProps['defaultValue']>
  value?: NonNullable<InputProps['value']>
  onInput: NonNullable<InputProps['onInput']>
  name: NonNullable<InputProps['name']>
  id: NonNullable<InputProps['id']>
}

export { type URLSearchParamsControlledInput }
