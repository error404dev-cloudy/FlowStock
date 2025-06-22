"use client"

import React, { useEffect, useState } from "react"
import Wrapper from "../components/Wrapper"
import { useUser } from "@clerk/nextjs"
import { Product } from "@/type"
import { deleteProduct, readProducts } from "../actions"
import EmptyState from "../components/EmptyState"
import ProductImage from "../components/ProductImage"
import Link from "next/link"
import { Trash } from "lucide-react"
import { toast } from "react-toastify"


const Page = () => {
  const { user, isLoaded } = useUser()
  const [products, setProducts] = useState<Product[]>([])

  const email = user?.primaryEmailAddress?.emailAddress as string

  const fetchProducts = async () => {
    try {
      if (email) {
        const products = await readProducts(email)
        if (products) {
          setProducts(products)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (email) fetchProducts()
  }, [email])

  const handleDeleteProduct = async (product: Product) => {
    const confirmDelete = confirm("Voulez-vous vraiment supprimer ce produit ?")
    if (!confirmDelete) return

    try {
      if (product.imageUrl) {
        const resDelete = await fetch("/api/upload", {
          method: "DELETE",
          body: JSON.stringify({ path: product.imageUrl }),
          headers: { "Content-Type": "application/json" },
        })

        const text = await resDelete.text()

        // Ici on indique à TypeScript que dataDelete a une propriété success de type booléen
        const dataDelete: { success: boolean } = JSON.parse(text)

        if (!dataDelete.success) {
          throw new Error("Erreur lors de la suppression de l'image.")
        }
      }

      if (email) {
        await deleteProduct(product.id, email)
        await fetchProducts()
        toast.success("Produit supprimé avec succès")
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (!isLoaded) return null

  return (
    <Wrapper>
      <div className="overflow-x-auto">
        {products.length === 0 ? (
          <EmptyState message="Aucun produit disponible" IconComponent="PackageSearch" />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Image</th>
                <th>Nom</th>
                <th>Description</th>
                <th>Prix</th>
                <th>Quantité</th>
                <th>Catégorie</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <th>{index + 1}</th>
                  <td>
                    <ProductImage
                      src={product.imageUrl}
                      alt={product.imageUrl}
                      heightClass="h-12"
                      widthClass="w-12"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price} €</td>
                  <td>{product.quantity || 0}</td>
                  <td>{product.categoryName || "Non catégorisé"}</td>
                  <td className="flex gap-2 flex-col">
                    <Link className="btn btn-xs w-fit btn-primary" href={`/update-product/${product.id}`}>
                      Modifier
                    </Link>
                    <button
                      className="btn btn-xs w-fit"
                      onClick={() => handleDeleteProduct(product)}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Wrapper>
  )
}

export default Page
