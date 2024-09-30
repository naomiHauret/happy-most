import { SupportedChainsAliases } from '@happy/chains'
import { recipeButton } from '@happy/uikit-react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Account } from '~/components/account'
import { BridgeSearchParams } from '~/components/bridge'
import { AppRoutes } from '~/config'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="bg-neutral-1 border-y-neutral-11/10">
        <div className="py-4 md:max-w-screen-sm px-2 mx-auto w-full flex items-center justify-end relative z-30">
          <Account preferredChainUrlSearchParamKey={BridgeSearchParams.SourceChain} />
        </div>
      </div>
      <div className="pt-2 px-2 font-semibold max-w-sm flex justify-between mx-auto text-sm text-neutral-11 gap-2">
        <Link
          to={AppRoutes.home}
          //@ts-ignore
          search={() => ({
            [BridgeSearchParams.SourceChain]: SupportedChainsAliases.HappyChainSepolia,
            [BridgeSearchParams.DestinationChain]: SupportedChainsAliases.OptimismSepolia,
          })}
          className={recipeButton({
            intent: 'ghost',
            scale: 'small',
            class: 'w-full justify-center min-h-8',
          })}
          activeProps={{
            className: recipeButton({ intent: 'ghost-primary', scale: 'small' }),
          }}
        >
          Home
        </Link>{' '}
        <Link
          //@ts-ignore
          search={() => ({
            [BridgeSearchParams.SourceChain]: SupportedChainsAliases.HappyChainSepolia,
            [BridgeSearchParams.DestinationChain]: SupportedChainsAliases.OptimismSepolia,
          })}
          to={AppRoutes.transactions}
          className={recipeButton({
            intent: 'ghost',
            scale: 'small',
            class: 'w-full justify-center min-h-8',
          })}
          activeProps={{
            className: recipeButton({ intent: 'ghost-primary', scale: 'small' }),
          }}
        >
          Transactions
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  )
}
