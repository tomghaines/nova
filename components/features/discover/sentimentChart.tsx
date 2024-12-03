import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import fetchSentimentData from '@/lib/database/SentimentData';
import { useCoin } from '@/app/context/CoinContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type KeyPoint,
  ChartData,
  SentimentPoint,
  type SentimentStats
} from '@/@types/data/SentimentData';

// Prop types

interface SentimentBoxesProps {
  keyPoints: KeyPoint[];

  className?: string;
}

interface SentimentStatsProps {
  data: ChartData | null;
}

interface SentimentChartProps {
  onLoadComplete?: () => void;
}

const SentimentBoxes: React.FC<SentimentBoxesProps> = ({
  keyPoints,

  className = ''
}) => {
  const bullishPoints = keyPoints.filter((point) => point.type === 'bullish');
  const bearishPoints = keyPoints.filter((point) => point.type === 'bearish');

  return (
    <div className={`mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='relative overflow-hidden rounded-sm border border-emerald-500/20 bg-emerald-500/5 p-3 backdrop-blur-sm'
      >
        <div className='flex items-center gap-2'>
          <h3 className='mb-4 font-bold text-emerald-500'>Bullish Factors</h3>

          <TrendingUp className='mb-4 h-5 w-5 text-emerald-500' />
        </div>

        <ul className='space-y-2'>
          {bullishPoints.map((point, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className='flex items-start gap-2 text-sm text-emerald-300'
            >
              <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500' />

              {point.point}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='relative overflow-hidden rounded-sm border border-red-500/20 bg-red-500/5 p-3 backdrop-blur-sm'
      >
        <div className='flex items-center gap-2'>
          <h3 className='mb-4 font-bold text-red-500'>Bearish Factors</h3>

          <TrendingDown className='mb-4 h-5 w-5 text-red-500' />
        </div>

        <ul className='space-y-2'>
          {bearishPoints.map((point, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className='flex items-start gap-2 text-sm text-red-300'
            >
              <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500' />

              {point.point}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

const SentimentStats: React.FC<SentimentStatsProps> = ({ data }) => {
  const stats = useMemo<SentimentStats | null>(() => {
    if (!data?.weeklySentiment) return null;

    const sentiments = data.weeklySentiment.map((w) =>
      Number(w.sentiment_score)
    );

    const prices = data.weeklySentiment.map((w) => Number(w.price));

    const meanSentiment = d3.mean(sentiments);
    const maxSentiment = d3.max(sentiments);
    const minSentiment = d3.min(sentiments);

    if (
      meanSentiment === undefined ||
      maxSentiment === undefined ||
      minSentiment === undefined
    ) {
      return null;
    }

    return {
      avgSentiment: meanSentiment.toFixed(2),
      maxSentiment: maxSentiment.toFixed(2),
      minSentiment: minSentiment.toFixed(2),
      priceChange: (
        ((prices[prices.length - 1] - prices[0]) / prices[0]) *
        100
      ).toFixed(2)
    };
  }, [data]);

  if (!stats) return null;

  return (
    <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
      {[
        { label: 'Avg Sentiment: ', value: stats.avgSentiment },
        { label: 'Max Sentiment: ', value: stats.maxSentiment },
        { label: 'Min Sentiment: ', value: stats.minSentiment },
        { label: 'Price Change: ', value: `${stats.priceChange}%` }
      ].map((stat, index) => (
        <div
          key={index}
          className='flex items-center justify-between rounded-sm border border-white/10 px-2 py-1 backdrop-blur-sm'
        >
          <p className='text-sm'>{stat.label}</p>
          <p className='text-sm font-normal'>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export const SentimentChart: React.FC<SentimentChartProps> = ({
  onLoadComplete
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { selectedCoinSymbol } = useCoin();
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchSentimentData(selectedCoinSymbol);
        console.log(data);
        setChartData(data);
      } catch (err) {
        console.error(err);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [selectedCoinSymbol]);

  const sentimentData = useMemo<SentimentPoint[]>(() => {
    if (!chartData?.weeklySentiment) return [];

    return chartData.weeklySentiment
      .map((week) => {
        const [month, days] = week.date_range.split(' ');
        const [startDay] = days.split('-');
        const monthMap: { [key: string]: number } = {
          Jan: 0,
          Feb: 1,
          Mar: 2,
          Apr: 3,
          May: 4,
          Jun: 5,
          Jul: 6,
          Aug: 7,
          Sep: 8,
          Oct: 9,
          Nov: 10,
          Dec: 11
        };
        return {
          date: new Date(2024, monthMap[month], parseInt(startDay)),
          sentimentValue: week.sentiment_score,
          analysis: week.summary,
          price: week.price
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [chartData]);

  useEffect(() => {
    try {
      if (!sentimentData.length || !chartRef.current) return;
      const container = chartRef.current;
      const width = 845;
      const height = 400;
      const margin = { top: 20, right: 50, bottom: 30, left: 50 };

      // d3 Types
      const xDomain = d3.extent(sentimentData, (d) => d.date);
      const yPriceDomain = d3.extent(sentimentData, (d) => d.price);

      if (!xDomain[0] || !xDomain[1] || !yPriceDomain[0] || !yPriceDomain[1]) {
        throw new Error('Invalid data ranges');
      }

      // Clear previous chart
      d3.select(container).selectAll('*').remove();

      const svg = d3
        .select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .style('background', '#FFFFFF0');

      // Gradient definitions
      const defs = svg.append('defs');

      // Gradient for positive/green area
      const posGradient = defs
        .append('linearGradient')
        .attr('id', 'positiveGradient')
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '0%')
        .attr('y2', '100%');

      posGradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#10B981')
        .attr('stop-opacity', 0.7);

      posGradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#10B981')
        .attr('stop-opacity', 0.07);

      // Gradient for negative/red area
      const negGradient = defs
        .append('linearGradient')
        .attr('id', 'negativeGradient')
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '0%')
        .attr('y2', '100%');

      negGradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#EF4444')
        .attr('stop-opacity', 0.07);

      negGradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#EF4444')
        .attr('stop-opacity', 0.25);

      // Scales
      const x = d3
        .scaleTime()
        .domain(xDomain)
        .range([margin.left, width - margin.right]);

      const ySentiment = d3
        .scaleLinear()
        .domain([-0.6, 0.6])
        .range([height - margin.bottom, margin.top]);

      const yPrice = d3
        .scaleLinear()
        .domain(yPriceDomain)
        .range([height - margin.bottom, margin.top]);

      // Grid
      const grid = svg
        .append('g')
        .attr('class', 'grid')
        .style('stroke', 'rgba(255, 255, 255, 0.05)');

      grid
        .selectAll('line.vertical')
        .data(x.ticks(12))
        .join('line')
        .attr('x1', (d) => x(d))
        .attr('x2', (d) => x(d))
        .attr('y1', margin.top)
        .attr('y2', height - margin.bottom);

      grid
        .selectAll('line.horizontal')
        .data(ySentiment.ticks(5))
        .join('line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', (d) => ySentiment(d))
        .attr('y2', (d) => ySentiment(d));

      // Dashed zero line
      svg
        .append('line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', ySentiment(0))
        .attr('y2', ySentiment(0))
        .style('stroke', 'rgba(255, 255, 255, 0.2)')
        .style('stroke-dasharray', '4,4');

      // Areas with gradients
      const positiveArea = d3
        .area<SentimentPoint>()
        .x((d) => x(d.date))
        .y0(ySentiment(0))
        .y1((d) =>
          d.sentimentValue >= 0 ? ySentiment(d.sentimentValue) : ySentiment(0)
        )
        .curve(d3.curveMonotoneX);

      const negativeArea = d3
        .area<SentimentPoint>()
        .x((d) => x(d.date))
        .y0(ySentiment(0))
        .y1((d) =>
          d.sentimentValue <= 0 ? ySentiment(d.sentimentValue) : ySentiment(0)
        )
        .curve(d3.curveMonotoneX);

      // Area styles
      svg
        .append('path')
        .datum(sentimentData)
        .attr('fill', 'url(#positiveGradient)')
        .attr('d', (d) => positiveArea(d) || '');

      svg
        .append('path')
        .datum(sentimentData)
        .attr('fill', 'url(#negativeGradient)')
        .attr('d', (d) => negativeArea(d) || '');

      // Lines
      const sentimentLine = d3
        .line<SentimentPoint>()
        .x((d) => x(d.date))
        .y((d) => ySentiment(d.sentimentValue))
        .curve(d3.curveMonotoneX);

      const priceLine = d3
        .line<SentimentPoint>()
        .x((d) => x(d.date))
        .y((d) => yPrice(d.price))
        .curve(d3.curveMonotoneX);

      const sentimentPath = svg
        .append('path')
        .datum(sentimentData)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255, 255, 255, 0.7)')
        .attr('stroke-width', 1.5)
        .attr('d', (d) => sentimentLine(d) || '');

      const pricePath = svg
        .append('path')
        .datum(sentimentData)
        .attr('fill', 'none')
        .attr('stroke', '#60A5FA')
        .attr('stroke-width', 1)
        .attr('d', (d) => priceLine(d) || '');

      // Line path animation
      const sentimentLength = sentimentPath.node()?.getTotalLength() ?? 0;
      const priceLength = pricePath.node()?.getTotalLength() ?? 0;

      sentimentPath
        .attr('stroke-dasharray', `${sentimentLength} ${sentimentLength}`)
        .attr('stroke-dashoffset', sentimentLength)
        .transition()
        .duration(1000)
        .attr('stroke-dashoffset', 0);

      pricePath
        .attr('stroke-dasharray', `${priceLength} ${priceLength}`)
        .attr('stroke-dashoffset', priceLength)
        .transition()
        .duration(1000)
        .attr('stroke-dashoffset', 0);

      // Axes
      const xAxis = svg
        .append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(
          d3
            .axisBottom(x)
            .tickFormat((d: Date) => d3.timeFormat('%b')(d) as string)
            .tickSize(0)
        );

      const yAxisLeft = svg
        .append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(
          d3
            .axisLeft(yPrice)
            .tickFormat((d) => `$${d}`)
            .tickSize(0)
        );

      const yAxisRight = svg
        .append('g')
        .attr('transform', `translate(${width - margin.right},0)`)
        .call(d3.axisRight(ySentiment).tickSize(0));

      // Style axes
      [xAxis, yAxisLeft, yAxisRight].forEach((axis) => {
        axis.select('.domain').remove();

        axis
          .selectAll('.tick text')
          .attr('fill', 'rgba(255, 255, 255, 0.6)')
          .attr('font-size', '12px');
      });

      // Tooltip
      const tooltip = d3
        .select(container)
        .append('div')
        .attr(
          'class',
          'fixed z-50 hidden rounded-sm border border-white/10 bg-black/90 p-2 text-sm backdrop-blur-3xl'
        )
        .style('pointer-events', 'none');

      // Overlay
      const bisect = d3.bisector((d) => d.date).left;
      const focus = svg.append('g').style('display', 'none');

      // Focus circle sentiment
      focus
        .append('circle')
        .attr('class', 'sentiment-point')
        .attr('r', 4)
        .attr('fill', 'white')
        .attr('stroke', 'rgba(255, 255, 255, 0.5)')
        .attr('stroke-width', 2);

      // Focus circle price
      focus
        .append('circle')
        .attr('class', 'price-point')
        .attr('r', 4)
        .attr('fill', '#60A5FA')
        .attr('stroke', 'rgba(96, 165, 250, 0.5)')
        .attr('stroke-width', 2);

      // Vertical focus line
      focus
        .append('line')
        .attr('class', 'focus-line')
        .style('stroke', 'rgba(255, 255, 255, 0.2)')
        .style('stroke-width', 1)
        .style('stroke-dasharray', '4,4');

      const overlay = svg
        .append('rect')
        .attr('class', 'overlay')
        .attr('x', margin.left)
        .attr('y', margin.top)
        .attr('width', width - margin.left - margin.right)
        .attr('height', height - margin.top - margin.bottom)
        .style('fill', 'none')
        .style('pointer-events', 'all');

      overlay
        .on('mouseover', () => {
          focus.style('display', null);
          tooltip.style('display', null);
        })
        .on('mouseout', () => {
          focus.style('display', 'none');
          tooltip.style('display', 'none');
        })
        .on('mousemove', (event: any) => {
          const [mouseX] = d3.pointer(event);
          const x0 = x.invert(mouseX);
          const i = bisect(sentimentData, x0, 1);
          const d0 = sentimentData[i - 1];
          const d1 = sentimentData[i];

          if (!d0 || !d1) return;

          const d =
            x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime()
              ? d1
              : d0;

          focus
            .select('.sentiment-point')
            .attr('cx', x(d.date))
            .attr('cy', ySentiment(d.sentimentValue))
            .attr('fill', d.sentimentValue >= 0 ? '#10B981' : '#EF4444');

          focus
            .select('.price-point')
            .attr('cx', x(d.date))
            .attr('cy', yPrice(d.price));

          focus
            .select('.focus-line')
            .attr('x1', x(d.date))
            .attr('x2', x(d.date))
            .attr('y1', margin.top)
            .attr('y2', height - margin.bottom);

          tooltip
            .style('display', 'block')
            .style('left', `${x(d.date) + 12}px`)
            .style('top', `${ySentiment(d.sentimentValue) - 12}px`).html(`
  <div class="space-y-2">
    <div class="flex items-center justify-between gap-4">
      <span class="text-white/60">Date</span>
      <span class="font-medium">${d.date.toLocaleDateString()}</span>
    </div>
    <div class="flex items-center justify-between gap-4">
      <span class="text-white/60">Price</span>
      <span class="font-medium">$${d.price.toLocaleString()}</span>
    </div>
    <div class="flex items-center justify-between gap-4">
      <span class="text-white/60">Sentiment</span>
      <span class="font-medium ${d.sentimentValue >= 0 ? 'text-emerald-400' : 'text-red-400'}">
        ${d.sentimentValue.toFixed(2)}
      </span>
    </div>
    <div class=" max-w-xs text-left text-white/80">${d.analysis}</div>
  </div>
`);
        });

      // Legend
      const legend = svg
        .append('g')
        .attr(
          'transform',
          `translate(${margin.left + 10}, ${margin.top + 10})`
        );

      const legendItems = [
        { label: 'Price', color: '#60A5FA', type: 'line' },
        { label: 'Sentiment', color: 'white', type: 'line' }
      ];

      legendItems.forEach((item, i) => {
        const g = legend
          .append('g')
          .attr('transform', `translate(${i * 100}, 0)`);

        if (item.type === 'line') {
          g.append('line')
            .attr('x1', 0)
            .attr('x2', 20)
            .attr('stroke', item.color)
            .attr('stroke-width', item.label === 'Price' ? 1 : 1.5);
        }

        g.append('text')
          .attr('x', 30)
          .attr('y', 4)
          .text(item.label)
          .attr('fill', 'rgba(255, 255, 255, 0.6)')
          .attr('font-size', '12px');
      });

      onLoadComplete?.();
    } catch (err) {
      console.error(
        'Error rending chart:',
        err instanceof Error ? err.message : 'Unknown error'
      );
    }
  }, [sentimentData, onLoadComplete]);

  return (
    <Card className='w-full overflow-visible shadow-2xl backdrop-blur-sm'>
      <CardHeader className='border-b border-white/5 px-2 py-2'>
        <CardTitle className='text-md flex items-center gap-2 font-normal text-white'>
          <div className='flex items-center gap-2'>
            {chartData?.coinData?.icon && (
              <img
                src={chartData.coinData.icon}
                alt={chartData.coinData.name}
                className='h-6 w-6'
              />
            )}
            <span>{chartData?.coinData?.name} Sentiment Analysis</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-2 p-2'>
        {isLoading ? (
          <div className='flex h-[400px] items-center justify-center'>
            <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-white'></div>
          </div>
        ) : (
          <>
            <SentimentStats data={chartData} />
            <div className='relative'>
              <div
                ref={chartRef}
                className='w-full rounded-sm border-[1px] border-white/10'
              />
            </div>
            {chartData && <SentimentBoxes keyPoints={chartData.keyPoints} />}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SentimentChart;
