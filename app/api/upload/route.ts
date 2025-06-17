import { NextRequest, NextResponse } from "next/server"
import { join } from "path"
import { existsSync } from "fs"
import { mkdir, writeFile, unlink } from "fs/promises"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
  const file = data.get("file") as File | null

  if (!file) {
    return NextResponse.json({ success: false, error: "Aucun fichier envoyé" })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadDir = join(process.cwd(), "public", "uploads")
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  const ext = file.name.split(".").pop()
  const uniqueName = crypto.randomUUID() + "." + ext
  const pathFile = join(uploadDir, uniqueName)

  await writeFile(pathFile, buffer)

  const publicPath = `/uploads/${uniqueName}`
  return NextResponse.json({ success: true, path: publicPath })
  } catch (error) {
    console.error(error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { path } = await request.json()

    if (!path) {
      return NextResponse.json({ success: false, message: "Chemin invalide." }, { status: 400 })
    }

    const filePath = join(process.cwd(), "public", path)

    if (!existsSync(filePath)) {
      return NextResponse.json({ success: false, message: "Fichier non trouvé." }, { status: 404 })
    }

    if (!filePath.startsWith(join(process.cwd(), "public"))) {
      return NextResponse.json({ success: false, message: "Chemin non autorisé." }, { status: 403 })
    }


    await unlink(filePath)

    return NextResponse.json({ success: true, message: "Fichier supprimé avec succès." }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 })
  }
}
