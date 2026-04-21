import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';
import { Client } from 'basic-ftp';
import sharp from 'sharp';

/**
 * Gets today's date in YYYYMMDD format for daily folder structure
 */
function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

export interface UploadImageToFtpOptions {
  imageUrl: string;
  fileNamePrefix?: string;
}

interface FtpConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  secure: boolean;
  remoteDir: string;
  baseUrl: string;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required FTP env: ${name}`);
  return value;
}

function normalizeRemoteDir(dir: string | undefined): string {
  if (!dir) return '/uploads/coolcaptcha';
  const clean = dir.trim().replace(/\\/g, '/').replace(/\/+$/, '');
  const baseDir = clean.startsWith('/') ? clean : `/${clean}`;
  // Append today's date folder for daily uploads
  const today = getTodayDateString();
  return `${baseDir}/${today}`;
}

function buildRemoteFileName(prefix: string | undefined, extension: string): string {
  const safePrefix =
    (prefix || 'article-image')
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50) || 'article-image';

  return `${safePrefix}-${Date.now()}-${randomUUID()}${extension}`;
}

function buildPublicUrl(baseUrl: string, remoteDir: string, fileName: string): string {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  const normalizedDir = remoteDir.replace(/^\/+/, '').replace(/\/+$/, '');
  return `${normalizedBaseUrl}/${normalizedDir}/${fileName}`;
}

function readFtpConfig(): FtpConfig {
  return {
    host: getRequiredEnv('FTP_HOST'),
    user: getRequiredEnv('FTP_USER'),
    password: getRequiredEnv('FTP_PASSWORD'),
    baseUrl: getRequiredEnv('FTP_BASE_URL'),
    port: Number(process.env.FTP_PORT || 21),
    secure: process.env.FTP_SECURE === 'true',
    remoteDir: normalizeRemoteDir(process.env.FTP_REMOTE_DIR || '/uploads/coolcaptcha'),
  };
}

/**
 * Manages a single FTP connection for uploading multiple images.
 * Use this when uploading in a loop to avoid reconnecting per file.
 */
export class FtpUploader {
  private client: Client;
  private config: FtpConfig;

  constructor() {
    this.config = readFtpConfig();
    this.client = new Client();
    this.client.ftp.verbose = false;
  }

  async connect(): Promise<void> {
    const { host, port, user, password, secure, remoteDir } = this.config;
    await this.client.access({ host, port, user, password, secure });
    await this.client.ensureDir(remoteDir);
  }

  async upload({ imageUrl, fileNamePrefix }: UploadImageToFtpOptions): Promise<string> {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Image download failed with status ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    const fileBuffer = await sharp(rawBuffer)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();

    const fileName = buildRemoteFileName(fileNamePrefix, '.webp');
    const remotePath = `${this.config.remoteDir}/${fileName}`;

    await this.client.uploadFrom(Readable.from(fileBuffer), remotePath);
    return buildPublicUrl(this.config.baseUrl, this.config.remoteDir, fileName);
  }

  close(): void {
    this.client.close();
  }
}

/** Single-shot upload — opens and closes its own connection. */
export async function uploadImageToFtp(options: UploadImageToFtpOptions): Promise<string> {
  try {
    const uploader = new FtpUploader();
    await uploader.connect();
    try {
      return await uploader.upload(options);
    } finally {
      uploader.close();
    }
  } catch (error) {
    console.error('FTP upload failed, using original URL:', error);
    // Fallback to original URL on error
    return options.imageUrl;
  }
}
