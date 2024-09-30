import { SupportedChainsAliases } from '@happy/chains'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Account } from '~/components/account'
import { BridgeSearchParams } from '~/components/bridge'
import { AppRoutes } from '~/config'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="py-4 max-sm mx-auto w-full flex items-center justify-center relative z-30">
        <Account preferredChainUrlSearchParamKey={BridgeSearchParams.SourceChain} />
      </div>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to={AppRoutes.home}
          //@ts-ignore
          search={() => ({
            [BridgeSearchParams.SourceChain]: SupportedChainsAliases.HappyChainSepolia,
            [BridgeSearchParams.DestinationChain]: SupportedChainsAliases.OptimismSepolia,
          })}
          activeProps={{
            className: 'font-bold',
          }}
        >
          Home
        </Link>{' '}
        <Link
          to="/transactions"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Transactions
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
