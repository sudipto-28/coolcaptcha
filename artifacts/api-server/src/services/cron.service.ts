import * as cron from 'node-cron';
import { fetchAndSaveSource } from '../routes/feeds/feeds.route';
import { db, sourcesTable } from '@workspace/db';
import { eq } from 'drizzle-orm';

/**
 * Cron job service for scheduled RSS feed fetching
 */
export class CronService {
  private static instance: CronService;
  private task: cron.ScheduledTask | null = null;
  private isRunning: boolean = false;

  private constructor() {}

  static getInstance(): CronService {
    if (!CronService.instance) {
      CronService.instance = new CronService();
    }
    return CronService.instance;
  }

  /**
   * Start the cron job to fetch all RSS feeds every 30 minutes
   */
  start(): void {
    if (this.isRunning) {
      console.warn('Cron job is already running');
      return;
    }

    // Run every 30 minutes
    this.task = cron.schedule('*/30 * * * *', async () => {
      console.log('Starting scheduled RSS feed fetch...');
      await this.fetchAllFeeds();
      console.log('Scheduled RSS feed fetch completed');
    });

    this.isRunning = true;
    console.log('Cron job started: RSS feeds will be fetched every 30 minutes');
  }

  /**
   * Stop the cron job
   */
  stop(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
      this.isRunning = false;
      console.log('Cron job stopped');
    }
  }

  /**
   * Fetch all active RSS feeds
   */
  private async fetchAllFeeds(): Promise<void> {
    try {
      const sources = await db
        .select()
        .from(sourcesTable)
        .where(eq(sourcesTable.isActive, true));

      if (sources.length === 0) {
        console.log('No active sources found for cron job');
        return;
      }

      console.log(`Processing ${sources.length} sources in cron job`);

      for (const source of sources) {
        try {
          const result = await fetchAndSaveSource(source.id);
          console.log(`Cron: ${result.sourceName} - Saved: ${result.saved}, Skipped: ${result.skipped}, Filtered: ${result.filtered}, Failed: ${result.failed}`);
        } catch (error) {
          console.error(`Cron: Error processing source ${source.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Cron: Error fetching all feeds:', error);
    }
  }

  /**
   * Check if cron job is running
   */
  isActive(): boolean {
    return this.isRunning;
  }
}

// Export singleton instance
export const cronService = CronService.getInstance();
