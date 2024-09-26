import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@happy/uikit-react'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="p-2 font-bold text-2xl">
      <h3>Welcome Home!</h3>
      <Button>hey, i'm a button !</Button>
    </div>
  )
}
