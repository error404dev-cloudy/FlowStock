import { Product } from "@/type"
import React from "react"
import ProductImage from "./ProductImage"
import { Plus } from "lucide-react"

interface ProductCompenentProps {
  product?: Product | null
  add?: boolean
  handleAddToCart?: (product: Product) => void
}

const ProductCompenent: React.FC<ProductCompenentProps> = ({ product, add, handleAddToCart }) => {
  if (!product) {
    return (
      <div className="border-2 border-base-200 p-4 rounded-lg w-full flex items-center">
        Sélectionnez un produit pour voir ses détails
      </div>
    )
  }

  return (
    <div className="border-2 border-base-200 p-4 rounded-lg w-full flex items-center">
      <div>
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          heightClass="h-28"
          widthClass="w-28"
        />
      </div>

      {/* Barre verticale avec fondu */}
      <div className="relative mx-8 h-28 w-[2px]">
        {/* Gradient top */}
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-transparent to-gray-400"></div>
        {/* Barre pleine */}
        <div className="absolute top-4 bottom-4 left-0 w-full bg-gray-400"></div>
        {/* Gradient bottom */}
        <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-transparent to-gray-400"></div>
      </div>

      <div className="ml-0 md:ml-12 space-y-3 flex flex-col items-start">
        <h2 className="text-lg font-bold text-black">{product.name}</h2>

        <div className="badge badge-success text-green-700 font-medium shadow-sm rounded-md">
          {product.categoryName}
        </div>

        <div className="badge badge-success text-green-700 font-medium shadow-sm rounded-md">
          {product.quantity} {product.unit}
        </div>
      </div>

      <div>
        {add && handleAddToCart && (
          <button
            onClick={() => handleAddToCart(product)}
            className="btn btn-sm btn-circle btn-primary ml-4 md:ml-20"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ProductCompenent
