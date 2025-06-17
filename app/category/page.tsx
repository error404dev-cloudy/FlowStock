"use client"
import React, { useEffect, useState } from "react"
import Wrapper from "../components/Wrapper"
import CategoryModal from "../components/CategoryModal"
import { useUser } from "@clerk/nextjs"
import { toast } from "react-toastify"
import { deleteCategory, readCategories, updateCategory } from "../actions"
import { Category } from "@prisma/client"
import EmptyState from "../components/EmptyState"
import { Pencil, Trash } from "lucide-react"

const Page = () => {
    const { user } = useUser()
    const email = user?.primaryEmailAddress?.emailAddress as string

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
    const [categories, setCategories] = useState<Category[]>([])

    const loadCategories = async () => {
        if (email) {
            const data = await readCategories(email)
            if (data) setCategories(data)
        }
    }

    useEffect(() => {
        loadCategories()
    }, [email, loadCategories])

    const openCreateModal = () => {
        setName("")
        setDescription("")
        setEditMode(false)
        ;(document.getElementById("category_modal") as HTMLDialogElement)?.showModal()
    }

    const closeModal = () => {
        setName("")
        setDescription("")
        setEditMode(false)
        ;(document.getElementById("category_modal") as HTMLDialogElement)?.close()
    }

    const handleCreateCategory = async () => {
        setLoading(true)
        if (email) {
            await createCategory(name, email, description)
        }
        await loadCategories()
        closeModal()
        setLoading(false)
        toast.success("Catégorie ajoutée avec succès.")
    }

    const handleUpdateCategory = async () => {
        if (!editingCategoryId) return
        setLoading(true)
        if (email) {
            await updateCategory(editingCategoryId, email, name, description)
        }
        await loadCategories()
        closeModal()
        setLoading(false)
        toast.success("Catégorie mise à jour avec succès.")
    }

    const openEditModal = (category: Category) => {
        setName(category.name)
        setDescription(category.description || "")
        setEditMode(true)
        setEditingCategoryId(category.id)
        ;(document.getElementById("category_modal") as HTMLDialogElement)?.showModal()
    }

    const handleDeleteCategory = async (categoryId: string) => {
        const confirmDelete = confirm("Voulez-vous vraiment supprimer cette catégorie ? Tous les produits associés seront également supprimés.")
        if (!confirmDelete) return
        await deleteCategory(categoryId, email)
        await loadCategories()
        toast.success("Catégorie supprimée avec succès.")
    }

    return (
        <Wrapper>
            <div>
                <div className="mb-4">
                    <button className="btn btn-primary" onClick={openCreateModal}>
                        Ajouter une catégorie
                    </button>
                </div>

                {categories.length > 0 ? (
                    <div>
                        {categories.map((category) => (
                            <div key={category.id} className="mb-2 p-5 border-2 border-base-200 rounded-3xl flex justify-between items-center">
                                <div>
                                    <strong className="text-lg">{category.name}</strong>
                                    <div className="text-sm">{category.description}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="btn btn-sm" onClick={() => openEditModal(category)}>
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button className="btn btn-sm btn-error" onClick={() => handleDeleteCategory(category.id)}>
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        message={"Aucune catégorie disponible"}
                        IconComponent="Group"
                    />
                )}
            </div>

            <CategoryModal
                name={name}
                description={description}
                loading={loading}
                onclose={closeModal}
                onChangeName={setName}
                onChangeDescription={setDescription}
                onSubmit={editMode ? handleUpdateCategory : handleCreateCategory}
                editMode={editMode}
            />
        </Wrapper>
    )
}

export default Page

async function createCategory(name: string, email: string, description: string) {
    try {
        const res = await fetch("/api/category", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, description }),
        })

        if (!res.ok) {
            throw new Error("Erreur lors de la création de la catégorie")
        }

        const data = await res.json()
        console.log("Catégorie créée :", data)
    } catch (error) {
        console.error("Erreur :", error)
        toast.error("Erreur lors de l'ajout de la catégorie.")
    }
}
