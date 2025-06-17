"use client"

import { ProductOverviewStats } from "@/type"
import React, { useEffect, useState } from "react"
import { getProductOverviewStats } from "../actions"
import { BadgeDollarSign, Box, LucideShoppingCart, Tag } from "lucide-react"

const ProductOverview = ({ email }: { email: string }) => {
  const [stats, setStats] = useState<ProductOverviewStats | null>(null)

  const fetchStats = async () => {
    try {
      if (email) {
        const result = await getProductOverviewStats(email)
        if (result) {
          setStats(result)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  function formatNumber(value: number): string {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M"
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "k"
    return value.toFixed(1)
  }

  useEffect(() => {
    if (email) fetchStats()
  }, [email])

  return (
    <div>
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Carte 1 */}
          <div className="border-2 p-4 border-base-200 rounded-3xl w-full">
            <p className="text-sm text-gray-500">Produits en stock</p>
            <div className="flex justify-between items-center mt-2">
              <div className="stat-value">{formatNumber(stats.totalProducts)}</div>
              <div className="bg-primary/25 p-3 rounded-full">
                <Box className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          {/* Carte 2 */}
          <div className="border-2 p-4 border-base-200 rounded-3xl w-full">
            <p className="text-sm text-gray-500">Nombre de catégories</p>
            <div className="flex justify-between items-center mt-2">
              <div className="stat-value">{stats.totalCategories}</div>
              <div className="bg-primary/25 p-3 rounded-full">
                <Tag className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          {/* Carte 3 */}
          <div className="border-2 p-4 border-base-200 rounded-3xl w-full">
            <p className="text-sm text-gray-500">Valeur totale du stock</p>
            <div className="flex justify-between items-center mt-2">
              <div className="stat-value">{formatNumber(stats.stockValue)} €</div>
              <div className="bg-primary/25 p-3 rounded-full">
                <BadgeDollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          {/* Carte 4 */}
          <div className="border-2 p-4 border-base-200 rounded-3xl w-full">
            <p className="text-sm text-gray-500">Total des transactions</p>
            <div className="flex justify-between items-center mt-2">
              <div className="stat-value">{stats.totalCategories}</div>
              <div className="bg-primary/25 p-3 rounded-full">
                <LucideShoppingCart className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      )}
    </div>
  )
}

export default ProductOverview
