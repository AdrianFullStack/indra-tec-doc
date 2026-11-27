import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ConfigService } from "@nestjs/config";

export class S3Service {
    private readonly client: S3Client;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.client = new S3Client({
            region: this.configService.getOrThrow('aws.region'),
            credentials: {
                accessKeyId: this.configService.getOrThrow('aws.accessKeyId'),
                secretAccessKey: this.configService.getOrThrow('aws.secretAccessKey'),
            },
        });
    }

    async upload(
        key: string,
        body: Buffer,
        contentType: string,
    ) {
        await this.client.send(
            new PutObjectCommand({
                Bucket: this.configService.getOrThrow('aws.bucket'),
                Key: key,
                Body: body,
                ContentType: contentType,
                // ServerSideEncryption: 'aws:kms',
                // SSEKMSKeyId: this.configService.getOrThrow('aws.kmsKeyId'),
            }),
        );
    }

    async getDownloadUrl(key: string) {
        return getSignedUrl(
            this.client,
            new GetObjectCommand({
                Bucket: this.configService.getOrThrow('aws.bucket'),
                Key: key,
            }),
            {
                expiresIn: 300,
            },
        );
    }

    async delete(key: string) {
        await this.client.send(
            new DeleteObjectCommand({
                Bucket: this.configService.getOrThrow('aws.bucket'),
                Key: key,
            }),
        );
    }
}