export interface NewsData { 
    source: string;
    author: string;
    title: string;
    description: string;
    url: string;
    publishedAt: Date;
    content: string;
}

export async function getNewsData(country: string, category: string, pageSize: number): Promise<NewsData[]> {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
        throw new Error(
            "NEWS_API_KEY is not configured. " +
            "Get a free API key at https://newsapi.org"
        );
    }

    const url = (
        "https://newsapi.org/v2/top-headlines" +
        `?apiKey=${apiKey}` +
        `${country ? `&country=${country}` : ""}` +
        `${category ? `&category=${category}` : ""}` +
        `${pageSize ? `&pageSize=${pageSize}` : ""}`
    ).trim();

    try {
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Country "${country}" not found. Please check the spelling.`);
            }
            if (response.status === 401) {
                throw new Error("Invalid API key. Please check your NEWS_API_KEY.");
            }
            throw new Error(`News API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return data.articles.map((article : any) => {
            return {
                source: article.source.name,
                author: article.author,
                title: article.title,
                description: article.description,
                url: article.url,
                publishedAt: new Date(article.publishedAt),
                content: article.content,
            };
        }) as NewsData[];
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to fetch news data. Please try again later.");
    }
}