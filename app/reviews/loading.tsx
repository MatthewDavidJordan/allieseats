import { Loading } from "@/components/loading"

export default function ReviewsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading text="Loading reviews..." />
    </div>
  )
}
