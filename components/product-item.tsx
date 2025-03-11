interface ProductItemProps {
  name: string
  subtitle?: string
  size: string
  color: string
  price: string
  imageUrl: string
}

export function ProductItem({ name, subtitle, size, color, price, imageUrl }: ProductItemProps) {
  return (
    <div className="flex">
      <div className="flex-shrink-0 mr-4 border-2 border-blue-500 rounded-sm p-1 w-20 h-20 flex items-center justify-center">
        <input type="checkbox" className="h-4 w-4" defaultChecked />
      </div>
      <div className="flex-shrink-0 mr-4">
        <img src={imageUrl || "/placeholder.svg"} alt={name} className="w-20 h-20 object-cover rounded-md" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-sm">{name}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        <p className="text-sm">Size: {size}</p>
        <p className="text-sm">Color: {color}</p>
        <button className="text-sm text-blue-600 hover:underline mt-1">Details</button>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="font-medium">{price}</p>
      </div>
    </div>
  )
}

