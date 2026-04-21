import Parser from 'rss-parser';

type CustomItem = Parser.Item & {
  'media:content'?: { $?: { url?: string } };
  'media:thumbnail'?: { $?: { url?: string } };
};

const parser = new Parser<Record<string, unknown>, CustomItem>({
  customFields: {
    item: ['media:content', 'media:thumbnail', 'enclosure'],
  },
});

export interface NormalizedItem {
  externalId: string;
  title: string;
  link: string;
  publishedAt?: Date;
  imageUrl?: string;
  description?: string;
}

export async function parseRssFeed(rssUrl: string): Promise<NormalizedItem[]> {
  try {
    const feed = await parser.parseURL(rssUrl);
    
    if (!feed.items || feed.items.length === 0) {
      return [];
    }

    return feed.items
      .map((item) => normalizeRssItem(item))
      .filter((item): item is NormalizedItem => item !== null);
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    throw new Error('Failed to parse RSS feed');
  }
}

function extractImage(item: CustomItem): string | null {
  const enc = item.enclosure as { url?: string; type?: string } | undefined;
  if (enc?.url && enc.type?.startsWith('image/')) return enc.url;
  if (item['media:content']?.$?.url) return item['media:content'].$.url;
  if (item['media:thumbnail']?.$?.url) return item['media:thumbnail'].$.url;

  const html = item.content ?? item.summary ?? '';
  return html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? null;
}

function normalizeRssItem(item: CustomItem): NormalizedItem | null {
  // Extract external ID (guid, link, or title)
  const externalId = item.guid ?? item.link ?? item.title;
  
  if (!externalId) {
    return null;
  }

  // Extract link
  const link = item.link ?? '';
  if (!link) {
    return null;
  }

  // Extract image URL
  const imageUrl = extractImage(item);

  // Parse publication date
  let publishedAt: Date | undefined;
  if (item.pubDate) {
    publishedAt = new Date(item.pubDate);
  } else if (item.isoDate) {
    publishedAt = new Date(item.isoDate);
  }

  // Extract description
  const description = item.contentSnippet ?? item.summary ?? '';

  return {
    externalId,
    title: item.title?.trim() || 'Untitled',
    link,
    publishedAt,
    imageUrl: imageUrl ?? undefined,
    description,
  };
}
