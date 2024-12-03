import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

const apifyClient = new ApifyClient({ token: process.env.APIFY_TOKEN });

export async function POST(req: Request) {
  try {
    const { keywords, symbol } = await req.json();
    const url = new URL(req.url);
    const streamOption = url.searchParams.get('stream') === 'true';
    const acceptHeader = req.headers.get('Accept');

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

    if (streamOption) {
      // If the user wants a streaming response
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
    } else {
      // Return standard JSON response
      const analysis = await openai.chat.completions.create({
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
        ]
      });

      // Handle Accept header
      if (acceptHeader?.includes('application/json')) {
        return NextResponse.json({
          analysis: analysis.choices[0].message?.content
        });
      } else if (acceptHeader?.includes('text/html')) {
        // You can customize the HTML response here
        return new NextResponse(
          `<html><body><h1>Analysis</h1><p>${analysis.choices[0].message?.content}</p></body></html>`,
          { headers: { 'Content-Type': 'text/html' } }
        );
      } else {
        return NextResponse.json(
          { error: 'Unsupported Accept header' },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error('Error processing API request:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
