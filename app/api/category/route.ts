import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { name, email, description } = await req.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Champs manquants." }, { status: 400 })
    }

    // findFirst au lieu de findUnique
    const association = await prisma.association.findFirst({ where: { email } })

    if (!association) {
      return NextResponse.json({ error: "Association introuvable." }, { status: 404 })
    }

    // Vérifie bien que le champ s'appelle associationId dans Prisma
    const newCategory = await prisma.category.create({
      data: { name, description, associationId: association.id },
    })

    return NextResponse.json({ success: true, message: "Catégorie créée", data: newCategory })
  } catch (error) {
    console.error("POST /api/category error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email manquant." }, { status: 400 })
    }

    const association = await prisma.association.findFirst({ where: { email } })

    if (!association) {
      return NextResponse.json({ error: "Association introuvable." }, { status: 404 })
    }

    const categories = await prisma.category.findMany({ where: { associationId: association.id } })

    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error("GET /api/category error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
