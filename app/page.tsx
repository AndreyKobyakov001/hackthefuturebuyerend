import { AmazonHeader } from "@/components/amazon-header"
import { OrdersList } from "@/components/orders-list"

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AmazonHeader />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-medium mb-6">Recent orders</h1>
        <OrdersList />
      </main>
    </div>
  )
}

