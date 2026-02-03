import { Loading } from "@/components/loading"

export default function ListsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading text="Loading lists..." />
    </div>
  )
}
