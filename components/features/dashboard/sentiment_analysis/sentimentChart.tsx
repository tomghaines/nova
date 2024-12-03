import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SentimentPoint } from '@/@types/data/SentimentData';
import { motion } from 'framer-motion';

interface SentimentChartProps {
  data: SentimentPoint[];
  onLoadComplete?: () => void;
}

const SentimentChart: React.FC<SentimentChartProps> = ({
  data: sentimentData,
  onLoadComplete
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Resize observer to scale dynamically
  useEffect(() => {
    if (!chartRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.round(width),
          height: Math.round(height)
        });
      }
    });

    resizeObserver.observe(chartRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    try {
      if (
        !sentimentData.length ||
        !chartRef.current ||
        !dimensions.width ||
        !dimensions.height
      )
        return;

      const container = chartRef.current;
      const { width, height } = dimensions;
      const margin = { top: 20, right: 50, bottom: 20, left: 50 };

      // Clear previous chart
      d3.select(container).selectAll('*').remove();

      const svg = d3
        .select(container)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .style('overflow', 'visible');

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
        .domain(d3.extent(sentimentData, (d) => d.date) as [Date, Date])
        .range([margin.left, width - margin.right]);

      const ySentiment = d3
        .scaleLinear()
        .domain([-0.6, 0.6])
        .range([height - margin.bottom, margin.top])
        .nice();

      const yPrice = d3
        .scaleLinear()
        .domain(d3.extent(sentimentData, (d) => d.price) as [number, number])
        .range([height - margin.bottom, margin.top])
        .nice();

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
        .style('pointer-events', 'none')
        .style('position', 'absolute')
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
        .style('pointer-events', 'all')
        .style('cursor', 'crosshair');

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
        'Error rendering chart:',
        err instanceof Error ? err.message : 'Unknown error'
      );
    }
  }, [sentimentData, dimensions, onLoadComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className='flex h-full w-full'
    >
      <div ref={chartRef} className='h-[400px] min-h-[400px] w-full' />
    </motion.div>
  );
};

export default SentimentChart;
