import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const { name, email, description } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: "Champs manquants." }, { status: 400 })
  }

  const association = await prisma.association.findUnique({ where: { email } })

  if (!association) {
    return NextResponse.json({ error: "Association introuvable." }, { status: 404 })
  }

  const newCategory = await prisma.category.create({
    data: { name, description, associationId: association.id },
  })

  return NextResponse.json({ success: true, message: "Catégorie créée", data: newCategory })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ error: "Email manquant." }, { status: 400 })
  }

  const association = await prisma.association.findUnique({ where: { email } })

  if (!association) {
    return NextResponse.json({ error: "Association introuvable." }, { status: 404 })
  }

  const categories = await prisma.category.findMany({ where: { associationId: association.id } })

  return NextResponse.json({ success: true, data: categories })
}

