'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sentimentData } from './mockdata';

export const SentimentChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear existing chart
    if (chartRef.current) {
      d3.select(chartRef.current).selectAll('*').remove();
    }

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };

    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Parse and scale data
    const x = d3
      .scaleTime()
      .domain(d3.extent(sentimentData, (d) => new Date(d.date)) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain(
        d3.extent(sentimentData, (d) => d.sentimentValue) as [number, number]
      )
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Axes
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(6).tickSizeOuter(0));

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Horizontal line at y = 0
    svg
      .append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');

    // Define gradient for path coloring
    const gradientId = 'gradient-sentiment';
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', height);

    // Gradient stops with increased opacity for better visibility
    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#F25D27')
      .attr('stop-opacity', 0.9); // Darker orange
    gradient
      .append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#FFFFFF')
      .attr('stop-opacity', 0.9); // White
    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#2D76BA')
      .attr('stop-opacity', 0.9); // Darker blue

    // Draw smoothed path with gradient
    svg
      .append('path')
      .datum(sentimentData)
      .attr('fill', 'none')
      .attr('stroke', `url(#${gradientId})`)
      .attr('stroke-width', 3) // Slightly thicker for visibility
      .attr(
        'd',
        d3
          .line<any>()
          .curve(d3.curveCatmullRom) // Use curveCatmullRom for smoother but accurate alignment
          .x((d) => x(new Date(d.date)))
          .y((d) => y(d.sentimentValue))
      );

    // Tooltip elements
    const tooltip = d3
      .select(chartRef.current)
      .append('div')
      .style('position', 'absolute')
      .style('background', '#fff')
      .style('border', '1px solid #ccc')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('box-shadow', '0px 2px 4px rgba(0,0,0,0.2)')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    const focusDot = svg
      .append('circle')
      .attr('r', 5)
      .attr('fill', 'black')
      .style('opacity', 0);

    // Add hover interaction
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mousemove', (event) => {
        const [mouseX] = d3.pointer(event);
        const date = x.invert(mouseX);

        // Find the closest data point
        const bisect = d3.bisector((d: any) => new Date(d.date)).left;
        const index = bisect(sentimentData, date, 1);
        const d0 = sentimentData[index - 1];
        const d1 = sentimentData[index];
        const d =
          d1 && date - new Date(d0.date) > new Date(d1.date) - date ? d1 : d0;

        // Update focus dot and tooltip
        focusDot
          .attr('cx', x(new Date(d.date)))
          .attr('cy', y(d.sentimentValue))
          .style('opacity', 1);

        tooltip
          .style('opacity', 1)
          .html(
            `<strong>Date:</strong> ${new Date(d.date).toLocaleString()}<br>
             <strong>Sentiment:</strong> ${d.sentimentValue}<br>
             <strong>Price:</strong> ${d.price}<br>
             <strong>Analysis:</strong> ${d.analysis}`
          )
          .style('left', `${x(new Date(d.date)) + 50}px`) // Close to the dot
          .style('top', `${y(d.sentimentValue) - 28}px`);
      })
      .on('mouseout', () => {
        focusDot.style('opacity', 0);
        tooltip.style('opacity', 0);
      });
  }, []);

  return <div ref={chartRef}></div>;
};
