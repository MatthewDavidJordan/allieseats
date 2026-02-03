import { Loading } from "@/components/loading"

export default function ReviewLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading text="Preparing your review..." />
    </div>
  )
}
