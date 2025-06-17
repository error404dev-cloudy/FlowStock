import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { readProducts, replenishStockWithTransaction } from "../actions";
import ProductCompenent from "./ProductCompenent";
import { Product } from "@/type";
import { toast } from "react-toastify";

const Stock = () => {
  const { user, isLoaded } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  // Fonction pour aller chercher les produits
  const fetchProducts = async (email: string) => {
    try {
      const products = await readProducts(email);
      console.log("📦 Produits récupérés :", products);
      if (products && products.length > 0) {
        setProducts(products);
      } else {
        console.warn("⚠️ Aucun produit trouvé pour cet utilisateur.");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des produits :", error);
    }
  };

  // Appel initial
  useEffect(() => {
    if (isLoaded && user?.primaryEmailAddress?.emailAddress) {
      const email = user.primaryEmailAddress.emailAddress;
      console.log("👤 Email utilisateur :", email);
      fetchProducts(email);
    } else {
      console.warn("⚠️ Utilisateur non chargé ou email manquant");
    }
  }, [isLoaded, user]);

  // Lorsqu’on change le produit sélectionné
  const handleProductChange = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProductId(productId);
    setSelectedProduct(product || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProductId || quantity <= 0) {
      toast.error("Veuillez sélectionner un produit et entrer une quantité valide.");
      return;
    }

    const email = user?.primaryEmailAddress?.emailAddress;

    try {
      if (!email) {
        toast.error("Email utilisateur manquant.");
        return;
      }

      await replenishStockWithTransaction(selectedProductId, quantity, email);
      toast.success("Le stock a été réapprovisionné avec succès !");
      await fetchProducts(email);

      // Réinitialisation du formulaire
      setSelectedProductId("");
      setQuantity(0);
      setSelectedProduct(null);

      const modal = document.getElementById("my_modal_stock") as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du stock :", error);
      toast.error("Erreur lors de la mise à jour du stock.");
    }
  };

  return (
    <div>
      <dialog id="my_modal_stock" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg">Gestion de stock</h3>
          <p className="py-4">
            Ajoutez des quantités aux produits disponibles dans votre stock.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block font-semibold">Sélectionner un produit</label>
            <select
              value={selectedProductId}
              className="select select-bordered w-full"
              required
              onChange={(e) => handleProductChange(e.target.value)}
            >
              <option value="">Sélectionner un produit</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.categoryName}
                </option>
              ))}
            </select>

            {/* Affichage de l'image du produit sélectionné */}
            {selectedProduct && <ProductCompenent product={selectedProduct} />}

            {/* Input de quantité */}
            <label className="block font-semibold">Quantité à ajouter</label>
            <input
              type="number"
              placeholder="Quantité à ajouter"
              value={quantity}
              min={0}
              required
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="input input-bordered w-full"
            />

            <button type="submit" className="btn btn-primary w-fit">
              Ajouter au stock
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Stock;
