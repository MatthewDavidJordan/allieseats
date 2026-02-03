import { Loading } from "@/components/loading"

export default function ListLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading text="Loading list..." />
    </div>
  )
}
