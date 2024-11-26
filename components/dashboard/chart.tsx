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

    // Define the stops for the gradient (orange to white to blue)
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#F57643'); // Orange
    gradient.append('stop').attr('offset', '50%').attr('stop-color', '#FFFFFF'); // White
    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#3A92CC'); // Blue

    // Draw path with gradient stroke
    svg
      .append('path')
      .datum(sentimentData)
      .attr('fill', 'none')
      .attr('stroke', `url(#${gradientId})`)
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line<any>()
          .x((d) => x(new Date(d.date)))
          .y((d) => y(d.sentimentValue))
      );

    // Tooltip
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

    // Add points and interactivity
    svg
      .selectAll('circle')
      .data(sentimentData)
      .join('circle')
      .attr('cx', (d) => x(new Date(d.date)))
      .attr('cy', (d) => y(d.sentimentValue))
      .attr('r', 5)
      .attr('fill', (d) => (d.sentimentValue >= 0 ? '#F57643' : '#3A92CC')) // Match gradient colors
      .on('mouseover', (event, d) => {
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>Date:</strong> ${new Date(d.date).toLocaleString()}<br>
             <strong>Sentiment:</strong> ${d.sentimentValue}<br>
             <strong>Price:</strong> ${d.price}<br>
             <strong>Analysis:</strong> ${d.analysis}`
          )
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });
  }, []);

  return <div ref={chartRef}></div>;
};
