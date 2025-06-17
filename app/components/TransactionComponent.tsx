import { Transaction } from "@/type"
import React from "react"
import ProductImage from "./ProductImage"

const TransactionComponent = ({ tx }: { tx: Transaction }) => {
  const formattedDate = new Date(tx.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <div className="p-4 border-2 border-base-200 rounded-3xl flex items-center mb-4">
      {/* IMAGE */}
      <div>
        {tx.imageUrl && (
          <ProductImage
            src={tx.imageUrl}
            alt={tx.imageUrl}
            heightClass="h-16"
            widthClass="w-16"
          />
        )}
      </div>

      {/* INFOS */}
      <div className="ml-4 flex justify-between w-full items-center mt-2">
        <div>
          {/* Nom du produit */}
          <p className="font-semibold">{tx.productName}</p>

          {/* Badge de catégorie - STYLE CORRIGÉ */}
          <div className="badge text-green-700 bg-green-100">
            {tx.categoryName}
          </div>
        </div>

        {/* QUANTITÉ + DATE */}
        <div className="flex flex-end flex-col">
          <div className="text-right">
            {tx.type === "IN" ? (
              <span className="text-success font-bold text-xl capitalize">
                +{tx.quantity} {tx.unit}
              </span>
            ) : (
              <span className="text-error font-bold text-xl capitalize">
                -{tx.quantity} {tx.unit}
              </span>
            )}

            <div className="text-xs text-gray-500">{formattedDate}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionComponent
