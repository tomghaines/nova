import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

const apifyClient = new ApifyClient({ token: process.env.APIFY_TOKEN });

export async function POST(req: Request) {
  try {
    const { keywords, symbol } = await req.json();

    if (!keywords && !symbol) {
      return NextResponse.json(
        { error: 'Keyword or symbol is required' },
        { status: 400 }
      );
    }

    // Flexible search handling
    const searchTerms = [];
    if (symbol) {
      searchTerms.push(`$${symbol}`, `$${symbol.toLowerCase()}`);
    }
    if (keywords) {
      searchTerms.push(keywords);
    }
    const run = await apifyClient.actor('apidojo/tweet-scraper').call({
      customMapFunction: '(object) => { return {...object} }',
      includeSearchTerms: true,
      maxItems: 35,
      onlyImage: false,
      onlyQuote: false,
      onlyTwitterBlue: false,
      onlyVerifiedUsers: false,
      onlyVideo: false,
      searchTerms,
      sort: 'Top',
      tweetLanguage: 'en'
    });

    const datasetResponse = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        const stream = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Analyze these tweets about "${keywords || symbol}".
               If they appear to be about cryptocurrency or trading, focus on market sentiment and price discussion.
               If not, provide a general analysis of the discussion topics and sentiment with several pointers for each.`
            },
            {
              role: 'user',
              content: JSON.stringify(
                datasetResponse.items.map((tweet) => tweet.text)
              )
            }
          ],
          stream: true
        });

        // Process the stream by chunk
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(stream);
  } catch (error) {
    console.error('Error processing API request:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
