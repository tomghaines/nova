import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  SlidersHorizontal,
  Info,
  BarChart2,
  Filter,
  Grid,
  List,
  PieChart,
  Share2,
  Download,
  RefreshCw
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  PieChart as RechartsChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from 'recharts';
import fetchMindshareData from '@/lib/database/MindshareData';

interface MindshareComponentProps {
  onLoadComplete?: () => void;
}

type ViewType = 'treemap' | 'list' | 'pie';

const MindshareComponent: React.FC<MindshareComponentProps> = ({
  onLoadComplete
}) => {
  const [mindshareData, setMindshareData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState<ViewType>('treemap');
  const [timeRange, setTimeRange] = useState('24H');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'percentage' | 'name'>('percentage');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchMindshareData();
        console.log('Fetched mindshare data:', data);
        setMindshareData(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
        if (onLoadComplete) onLoadComplete();
      }
    };

    fetchData();
  }, [timeRange]);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchMindshareData();
      setMindshareData(data);
    } catch (err) {
      console.error('Error refreshing:', err);
    }
    setIsRefreshing(false);
  };

  const processedData = useMemo(() => {
    if (!mindshareData.length) return [];

    let filtered = Array.from(
      new Map(
        mindshareData
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((item) => [item.name, item])
      ).values()
    );

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Convert to final format
    const processed = filtered.map((item) => ({
      ...item,
      percentage: parseFloat(item.percentage),
      formattedDate: new Date(item.date).toLocaleString()
    }));

    // Apply sorting
    return processed.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.percentage - a.percentage;
    });
  }, [mindshareData, searchTerm, sortBy]);

  const totalPercentage = useMemo(() => {
    return processedData.reduce((sum, item) => sum + item.percentage, 0);
  }, [processedData]);

  const getColorScale = (value, alpha = 1) => {
    const maxPercentage = Math.max(...processedData.map((d) => d.percentage));
    const normalizedValue = value / maxPercentage;
    return `rgba(${48 + Math.floor(normalizedValue * 140)}, ${10 + Math.floor(normalizedValue * 30)}, ${13 + Math.floor(normalizedValue * 38)}, ${alpha})`;
  };

  const handleExport = () => {
    const csv = [
      ['Topic', 'Percentage', 'Last Updated'],
      ...processedData.map((item) => [
        item.name,
        (item.percentage * 100).toFixed(1) + '%',
        item.formattedDate
      ])
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'mindshare_data.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (isLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center rounded-lg border-[1px] border-neutral-900/40 bg-neutral-800/30 p-8'>
        <div className='flex flex-col items-center gap-2'>
          <div className='h-2 w-24 animate-pulse rounded-full bg-neutral-700' />
          <span className='text-xs text-white/40'>
            Loading mindshare data...
          </span>
        </div>
      </div>
    );
  }

  if (error || !processedData.length) {
    return (
      <div className='flex h-full w-full flex-col items-center justify-center rounded-lg border-[1px] border-neutral-900/40 bg-neutral-800/30 p-8'>
        <BarChart2 className='h-8 w-8 text-white/20' />
        <span className='mt-2 text-sm text-white/40'>
          {error || 'No mindshare data available'}
        </span>
        <button
          onClick={refreshData}
          className='mt-4 rounded-md bg-white/5 px-4 py-2 text-xs text-white/60 hover:bg-white/10'
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className='flex h-full w-full flex-col rounded-lg border-[1px] border-neutral-900/40 bg-neutral-800/30'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-white/5 p-4'>
        <div className='flex items-center gap-2'>
          <h3 className='text-sm font-medium text-white/60'>
            Market Mindshare
          </h3>
          <Badge variant='secondary' className='bg-white/5 text-white/60'>
            {processedData.length} Topics
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className='h-4 w-4 text-white/40' />
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-xs'>
                  Market attention distribution across topics
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className='flex items-center gap-2'>
          {/* Search */}
          <input
            type='text'
            placeholder='Search topics...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='h-7 rounded-md bg-white/5 px-2 text-xs text-white/60 placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/20'
          />

          {/* Refresh */}
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className='rounded-md bg-white/5 p-1.5 text-white/60 hover:bg-white/10 disabled:opacity-50'
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </button>

          {/* Time Range */}
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-xs text-white/60 hover:bg-white/10'>
              <SlidersHorizontal className='h-3 w-3' />
              {timeRange}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setTimeRange('24H')}>
                Last 24 Hours
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('7D')}>
                Last 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('30D')}>
                Last 30 Days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger className='rounded-md bg-white/5 p-1.5 text-white/60 hover:bg-white/10'>
              <Filter className='h-3.5 w-3.5' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('percentage')}>
                Sort by Percentage
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Sort by Name
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger className='rounded-md bg-white/5 p-1.5 text-white/60 hover:bg-white/10'>
              {view === 'treemap' ? (
                <Grid className='h-3.5 w-3.5' />
              ) : view === 'list' ? (
                <List className='h-3.5 w-3.5' />
              ) : (
                <PieChart className='h-3.5 w-3.5' />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setView('treemap')}>
                <Grid className='mr-2 h-4 w-4' /> Treemap View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView('list')}>
                <List className='mr-2 h-4 w-4' /> List View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export */}
          <button
            onClick={handleExport}
            className='rounded-md bg-white/5 p-1.5 text-white/60 hover:bg-white/10'
          >
            <Download className='h-3.5 w-3.5' />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-hidden p-4'>
        <AnimatePresence mode='wait'>
          {view === 'treemap' && (
            <motion.div
              key='treemap'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='grid h-full grid-cols-4 gap-2'
            >
              <LayoutGroup>
                {processedData.map((item, index) => (
                  <motion.div
                    layout
                    key={item.name}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className='group relative flex flex-col rounded-lg p-3 hover:ring-1 hover:ring-white/10'
                    style={{
                      backgroundColor: getColorScale(item.percentage),
                      gridRow: `span ${Math.ceil((item.percentage / Math.max(...processedData.map((d) => d.percentage))) * 8)}`
                    }}
                    onClick={() => setSelectedTopic(item)}
                  >
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium text-white/90'>
                        {item.name}
                      </span>
                      <div className='flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/90'>
                        {(item.percentage * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div className='mt-2 text-xs text-white/60'>
                      Last updated: {new Date(item.date).toLocaleString()}
                    </div>

                    <div className='mt-auto pt-2'>
                      <Progress
                        value={(item.percentage / totalPercentage) * 100}
                        className='h-1 bg-white/10'
                      />
                    </div>

                    <div className='absolute inset-x-0 bottom-0 flex justify-end p-2 opacity-0 transition-opacity group-hover:opacity-100'>
                      <button className='rounded-full bg-white/10 p-1.5 hover:bg-white/20'>
                        <Share2 className='h-3 w-3 text-white/60' />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </LayoutGroup>
            </motion.div>
          )}

          {view === 'list' && (
            <motion.div
              key='list'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='space-y-2'
            >
              {processedData.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className='group flex items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10'
                  onClick={() => setSelectedTopic(item)}
                >
                  <div className='flex items-center gap-4'>
                    <span className='text-sm font-medium text-white/90'>
                      {item.name}
                    </span>
                    <span className='text-xs text-white/60'>
                      {item.formattedDate}
                    </span>
                  </div>

                  <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-2'>
                      <div
                        className='h-3 w-3 rounded-full'
                        style={{
                          backgroundColor: getColorScale(item.percentage)
                        }}
                      />
                      <span className='text-sm font-bold text-white/90'>
                        {(item.percentage * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className='relative h-1 w-32 rounded-full bg-white/10'>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(item.percentage / Math.max(...processedData.map((d) => d.percentage))) * 100}%`
                        }}
                        className='absolute left-0 h-full rounded-full'
                        style={{
                          backgroundColor: getColorScale(item.percentage)
                        }}
                      />
                    </div>
                    <button className='opacity-0 group-hover:opacity-100'>
                      <Share2 className='h-4 w-4 text-white/40 hover:text-white/60' />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {view === 'pie' && (
            <motion.div
              key='pie'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='flex h-full items-center justify-center'
            >
              <div className='h-[400px] w-[400px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <RechartsChart>
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className='rounded-lg bg-black/90 p-2'>
                              <div className='text-sm font-medium text-white'>
                                {data.name}
                              </div>
                              <div className='text-xs text-white/60'>
                                {(data.percentage * 100).toFixed(1)}%
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Pie
                      data={processedData}
                      dataKey='percentage'
                      nameKey='name'
                      cx='50%'
                      cy='50%'
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                    >
                      {processedData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={getColorScale(entry.percentage)}
                          style={{ filter: 'brightness(1.1)' }}
                          stroke='rgba(0,0,0,0.2)'
                        />
                      ))}
                    </Pie>
                  </RechartsChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Topic Details */}
      <Dialog
        open={!!selectedTopic}
        onOpenChange={() => setSelectedTopic(null)}
      >
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle className='flex items-center justify-between'>
              <span>{selectedTopic?.name}</span>
              <Badge variant='secondary' className='bg-white/5 text-white/90'>
                {(selectedTopic?.percentage * 100).toFixed(1)}%
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <h4 className='text-sm font-medium text-white/60'>Timeline</h4>
              <div className='mt-2'>
                <div className='text-xs text-white/40'>
                  Last updated: {selectedTopic?.formattedDate}
                </div>
              </div>
            </div>

            <div>
              <h4 className='text-sm font-medium text-white/60'>Share</h4>
              <div className='mt-2 flex gap-2'>
                <button className='rounded-md bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10'>
                  Copy Link
                </button>
                <button className='rounded-md bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10'>
                  Share Chart
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MindshareComponent;
