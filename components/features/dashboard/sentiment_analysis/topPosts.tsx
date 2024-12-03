import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Repeat2,
  Heart,
  Bookmark,
  TrendingUp,
  TrendingDown,
  Share2,
  ExternalLink,
  SlidersHorizontal,
  ChevronDown,
  BarChart2
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Post {
  id: number;
  text: string;
  url: string;
  likes: number;
  retweets: number;
  bookmarks: number;
  created_at: string;
  weekly_sentiment_id: number;
}

interface TopPostProps {
  weeklyData: Array<{
    sentiment_score: number;
    tweets: Post[];
    date_range: string;
  }>;
  className?: string;
}

const TopPosts: React.FC<TopPostProps> = ({ weeklyData, className = '' }) => {
  const [sortBy, setSortBy] = useState<'engagement' | 'sentiment' | 'date'>(
    'engagement'
  );
  const [view, setView] = useState<'compact' | 'detailed'>('detailed');
  const [expandedTweet, setExpandedTweet] = useState<number | null>(null);

  const allTweets = React.useMemo(() => {
    const tweets = weeklyData
      .flatMap((week) =>
        week.tweets.map((tweet) => ({
          ...tweet,
          sentiment_score: week.sentiment_score,
          date_range: week.date_range,
          engagement_rate: (
            (tweet.likes + tweet.retweets + tweet.bookmarks) /
            1000
          ).toFixed(2),
          sentiment_impact: (
            (week.sentiment_score * (tweet.likes + tweet.retweets)) /
            1000
          ).toFixed(2)
        }))
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'sentiment':
            return b.sentiment_score - a.sentiment_score;
          case 'date':
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          default:
            return b.likes + b.retweets - (a.likes + a.retweets);
        }
      })
      .slice(0, 5);

    return tweets;
  }, [weeklyData, sortBy]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getSentimentColor = (score: number) => {
    if (score >= 0.5) return 'text-emerald-400 bg-emerald-500/10';
    if (score >= 0) return 'text-emerald-300 bg-emerald-500/5';
    if (score >= -0.5) return 'text-red-300 bg-red-500/5';
    return 'text-red-400 bg-red-500/10';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (allTweets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          'flex h-full flex-col rounded-lg bg-black/40 p-4',
          className
        )}
      >
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-medium text-white/60'>Top Posts</h3>
        </div>
        <div className='mt-8 flex flex-1 flex-col items-center justify-center gap-2'>
          <BarChart2 className='h-8 w-8 text-white/20' />
          <p className='text-center text-sm text-white/40'>
            No posts available for this period
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'flex h-full flex-col rounded-lg border-[1px] border-neutral-900/40 bg-neutral-900/40',
        className
      )}
    >
      <div className='flex-none p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <h3 className='text-sm font-medium text-white/60'>
              Contributing Posts
            </h3>
            <span className='rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/40'>
              {allTweets.length}
            </span>
          </div>

          <div className='flex items-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger className='flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-xs text-white/60 hover:bg-white/10'>
                <SlidersHorizontal className='h-3 w-3' />
                {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('engagement')}>
                  By Engagement
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('sentiment')}>
                  By Sentiment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('date')}>
                  By Date
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() =>
                setView((v) => (v === 'compact' ? 'detailed' : 'compact'))
              }
              className='rounded-md bg-white/5 p-1 text-white/60 hover:bg-white/10'
            >
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  view === 'detailed' && 'rotate-180'
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Posts */}
      <div className='flex-1 overflow-hidden p-4 pt-0'>
        <div className='scrollbar-hide h-full overflow-y-auto'>
          <div className='flex flex-col space-y-3'>
            <AnimatePresence>
              {allTweets.map((tweet, index) => (
                <motion.div
                  key={tweet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className='relative overflow-hidden rounded-lg bg-black/30 p-3 hover:bg-black/30'
                >
                  {/* Post content */}
                  <div className='mb-2 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <span className='rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium text-white/60'>
                        #{index + 1}
                      </span>
                      <span className='text-xs text-white/60'>
                        {tweet.date_range}
                      </span>
                      {view === 'detailed' && (
                        <span className='text-xs text-white/40'>
                          {formatDate(tweet.created_at)}
                        </span>
                      )}
                    </div>

                    <div className='flex items-center gap-2'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div
                              className={`flex h-6 items-center gap-1 rounded-full px-2 ${getSentimentColor(tweet.sentiment_score)}`}
                            >
                              {tweet.sentiment_score >= 0 ? (
                                <TrendingUp className='h-3 w-3' />
                              ) : (
                                <TrendingDown className='h-3 w-3' />
                              )}
                              <span className='text-xs font-medium'>
                                {tweet.sentiment_score.toFixed(2)}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className='text-xs'>Period Sentiment Score</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {view === 'detailed' && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className='rounded-full bg-blue-500/10 px-2 py-1'>
                                <span className='text-xs font-medium text-blue-400'>
                                  {tweet.engagement_rate}%
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className='text-xs'>Engagement Rate</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>

                  <div
                    className={cn(
                      'cursor-pointer',
                      expandedTweet !== tweet.id &&
                        view === 'compact' &&
                        'line-clamp-2'
                    )}
                    onClick={() =>
                      setExpandedTweet(
                        expandedTweet === tweet.id ? null : tweet.id
                      )
                    }
                  >
                    <p className='mb-3 text-left text-sm text-white/80 hover:text-white'>
                      {tweet.text}
                    </p>
                  </div>

                  <div className='flex items-center justify-between text-xs text-white/40'>
                    <div className='flex items-center gap-4'>
                      <div className='flex items-center gap-1'>
                        <Repeat2 className='h-3 w-3' />
                        {formatNumber(tweet.retweets)}
                      </div>
                      <div className='flex items-center gap-1'>
                        <Heart className='h-3 w-3' />
                        {formatNumber(tweet.likes)}
                      </div>
                      <div className='flex items-center gap-1'>
                        <Bookmark className='h-3 w-3' />
                        {formatNumber(tweet.bookmarks)}
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <a
                        href={tweet.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 hover:bg-white/10'
                      >
                        <ExternalLink className='h-3 w-3' />
                        <span>Open</span>
                      </a>
                      <button className='rounded-full bg-white/5 p-1 hover:bg-white/10'>
                        <Share2 className='h-3 w-3' />
                      </button>
                    </div>
                  </div>

                  <div
                    className='absolute bottom-0 left-0 h-[2px] rounded-full bg-blue-500/70'
                    style={{
                      width: `${((tweet.likes + tweet.retweets) / (allTweets[0].likes + allTweets[0].retweets)) * 100}%`
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TopPosts;
