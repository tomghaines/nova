import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newsContent = body.newsContent;
    const url = new URL(req.url);
    const acceptHeader = req.headers.get('Accept');

    console.log('Headers:', Array.from(req.headers.entries()));
    console.log('Parsed Body:', body);


    // empty input
    if (!newsContent) {
      return NextResponse.json(
        { error: 'News content is required' },
        { status: 400 }
      );
    }
    
    // POST request content to perplexity api
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content:
              'You provide context analysis based on the user input and give relevant recommended readings (news articles).'
          },
          {
            role: 'user',
            content: newsContent
          }
        ],
        max_token: 500,
        return_images: false,
        return_related_questions: false,
        temperature: 0.6,
        top_p: 0.7,
        search_recency_filter: 'month',
        presence_penalty: 1
      })
    };

    // response from perplexity
    let response;
    try {
      response = await fetch(
        'https://api.perplexity.ai/chat/completions',
        options
      );

      // if response error
      if (!response.ok) {
        const responseText = await response.text();
        console.error(
          `Perplexity API returned an error: ${response.status} ${response.statusText}`,
          responseText
        );
        return NextResponse.json(
          {
            error: `Perplexity API returned an error: ${response.status}`,
            details: responseText
          },
          { status: response.status }
        );
      }

    } catch (networkError) {
      // network error
      console.error('Network error during fetch:', networkError);
      return NextResponse.json(
        {
          error: 'Network error occurred',
          details: JSON.stringify(networkError)
        },
        { status: 500 }
      );
    }

    // analysis processing (response -> json format)
    let analysis;
    try {
      analysis = await response.json();
    } catch (jsonError) {
      console.error('Failed to parse response as JSON:', jsonError);
      return NextResponse.json(
        {
          error: 'Failed to parse response from Perplexity API',
          details: (jsonError as Error).message
        },
        { status: 500 }
      );
    }

    // format analysis based on header format
    // only accept json or html header format
    if (!acceptHeader || (!acceptHeader.includes('application/json') && !acceptHeader.includes('text/html'))) {
      return NextResponse.json({
        recommendations: analysis.choices[0]?.message?.content
      });
    } else if (acceptHeader?.includes('text/html')) {
      return new NextResponse(
        `<html><body><h1>Recommended Readings</h1><p>${analysis.choices[0]?.message?.content}</p></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    } else {
      return NextResponse.json(
        { error: 'Unsupported Accept header' },
        { status: 400 }
      );
    }

  } catch (error: unknown) {
    // unknown errors
    console.error('Unknown error type:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        details: 'Unknown error type'
      },
      { status: 500 }
    );
  }
}
