// Wikipedia API service functions

export interface WikipediaPageSummary {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  originalimage?: {
    source: string;
    width: number;
    height: number;
  };
  lang: string;
  dir: string;
  timestamp: string;
  description?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

export interface WikipediaSearchResult {
  title: string;
  snippet: string;
  size: number;
  wordcount: number;
  timestamp: string;
}

export class WikipediaService {
  private static readonly BASE_URL = 'https://en.wikipedia.org/api/rest_v1';
  private static readonly SEARCH_URL = 'https://en.wikipedia.org/w/api.php';

  /**
   * Extract article title from Wikipedia URL
   */
  static extractTitleFromUrl(url: string): string | null {
    try {
      const urlPattern = /https?:\/\/[a-z]{2,3}\.wikipedia\.org\/wiki\/(.+)/i;
      const match = url.match(urlPattern);
      return match ? decodeURIComponent(match[1]) : null;
    } catch (error) {
      console.error('Error extracting title from URL:', error);
      return null;
    }
  }

  /**
   * Validate if URL is a valid Wikipedia article URL
   */
  static isValidWikipediaUrl(url: string): boolean {
    const pattern = /^https?:\/\/[a-z]{2,3}\.wikipedia\.org\/wiki\/.+/i;
    return pattern.test(url);
  }

  /**
   * Get page summary from Wikipedia REST API
   */
  static async getPageSummary(title: string): Promise<WikipediaPageSummary> {
    try {
      const encodedTitle = encodeURIComponent(title);
      const response = await fetch(`${this.BASE_URL}/page/summary/${encodedTitle}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching page summary:', error);
      throw new Error('Failed to fetch Wikipedia page summary');
    }
  }

  /**
   * Get full page content (HTML) from Wikipedia
   */
  static async getPageContent(title: string): Promise<string> {
    try {
      const encodedTitle = encodeURIComponent(title);
      const response = await fetch(`${this.BASE_URL}/page/html/${encodedTitle}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const htmlContent = await response.text();
      return htmlContent;
    } catch (error) {
      console.error('Error fetching page content:', error);
      throw new Error('Failed to fetch Wikipedia page content');
    }
  }

  /**
   * Search Wikipedia articles
   */
  static async searchArticles(query: string, limit: number = 10): Promise<WikipediaSearchResult[]> {
    try {
      const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        list: 'search',
        srsearch: query,
        srlimit: limit.toString(),
        origin: '*'
      });

      const response = await fetch(`${this.SEARCH_URL}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.query?.search || [];
    } catch (error) {
      console.error('Error searching Wikipedia:', error);
      throw new Error('Failed to search Wikipedia articles');
    }
  }

  /**
   * Get random Wikipedia article
   */
  static async getRandomArticle(): Promise<WikipediaPageSummary> {
    try {
      // First get random title
      const randomResponse = await fetch(`${this.SEARCH_URL}?action=query&format=json&list=random&rnnamespace=0&rnlimit=1&origin=*`);
      const randomData = await randomResponse.json();
      
      if (!randomData.query?.random?.[0]?.title) {
        throw new Error('No random article found');
      }
      
      const title = randomData.query.random[0].title;
      
      // Then get summary
      return await this.getPageSummary(title);
    } catch (error) {
      console.error('Error fetching random article:', error);
      throw new Error('Failed to fetch random Wikipedia article');
    }
  }
}