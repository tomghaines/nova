export interface Tweet {
  url: string;
  twitterUrl: string;
  id: string;
  text: string;
  retweetCount: number;
  replyCount: number;
  likeCount: number;
  quoteCount: number;
  createdAt: string;
  bookmarkCount: number;
  isRetweet: boolean;
  isQuote: boolean;
}

declare namespace API {
  interface NewsletterSignupRequest {
    email: string;
  }
  interface NewsletterSignupResponse {
    message: string;
  }
  interface ErrorResponse {
    error: string;
  }
}
