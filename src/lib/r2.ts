import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3"

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

const ALLOWED_TYPES: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
}

function getConfig() {
    const accountId = process.env.R2_ACCOUNT_ID
    const accessKeyId = process.env.R2_ACCESS_KEY_ID
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
    const bucket = process.env.R2_BUCKET_NAME
    const publicUrl = process.env.R2_PUBLIC_URL

    if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
        throw new Error("Cloudflare R2 is not configured.")
    }

    return {
        accountId,
        accessKeyId,
        secretAccessKey,
        bucket,
        publicUrl: publicUrl.replace(/\/$/, ""),
    }
}

function getClient(accountId: string, accessKeyId: string, secretAccessKey: string) {
    return new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId, secretAccessKey },
    })
}

export function isR2Configured() {
    try {
        getConfig()
        return true
    } catch {
        return false
    }
}

export async function uploadProfileImage(file: File, folder: string) {
    const extension = ALLOWED_TYPES[file.type]
    if (!extension) {
        throw new Error("Please upload a JPEG, PNG, WebP, or GIF image.")
    }
    if (file.size > MAX_IMAGE_BYTES) {
        throw new Error("Image must be smaller than 5MB.")
    }

    const { accountId, accessKeyId, secretAccessKey, bucket, publicUrl } =
        getConfig()
    const client = getClient(accountId, accessKeyId, secretAccessKey)

    const key = `${folder}/${crypto.randomUUID()}.${extension}`
    const buffer = Buffer.from(await file.arrayBuffer())

    await client.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        })
    )

    return `${publicUrl}/${key}`
}

export async function deleteProfileImage(url: string) {
    let config
    try {
        config = getConfig()
    } catch {
        return
    }

    const { accountId, accessKeyId, secretAccessKey, bucket, publicUrl } = config
    if (!url.startsWith(`${publicUrl}/`)) {
        return
    }

    const key = url.slice(publicUrl.length + 1)
    const client = getClient(accountId, accessKeyId, secretAccessKey)

    try {
        await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
    } catch {
        // Best-effort cleanup; an orphaned object is not worth failing the mutation for.
    }
}
