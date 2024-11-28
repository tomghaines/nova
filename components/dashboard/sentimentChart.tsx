'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import fetchSentimentData from '@/app/data/SentimentData';

import { SentimentData } from '@/app/types/data/SentimentData.types';

export const SentimentChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchSentimentData();
      setSentimentData(data);
    };
    getData();
  }, []);

  useEffect(() => {
    // Check for empty data
    if (!sentimentData || sentimentData.length === 0) return;

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
      .attr('stroke', '#D3D3D3')
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
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', height);

    // Define stops for gradient
    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#F25D27') // Dark orange for positive sentiment
      .attr('stop-opacity', 0.9);

    gradient
      .append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#D3D3D3') // Neutral grey for zero sentiment
      .attr('stop-opacity', 0.9);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#2D76BA') // Dark blue for negative sentiment
      .attr('stop-opacity', 0.9);

    // Draw smoothed path with gradient
    svg
      .append('path')
      .datum(sentimentData)
      .attr('fill', 'none')
      .attr('stroke', `url(#${gradientId})`)
      .attr('stroke-width', 2.5)
      .attr(
        'd',
        d3
          .line<SentimentData>()
          .curve(d3.curveCatmullRom) // Smooth path
          .x((d) => x(new Date(d.date)))
          .y((d) => y(d.sentimentValue))
      );

    // Tooltip elements
    const tooltip = d3
      .select(chartRef.current)
      .append('div')
      .style('position', 'absolute')
      .style('width', '150px')
      .style('background', '#fff')
      .style('border', '1px solid #ccc')
      .style('padding', '8px')
      .style('text-align', 'left')
      .style('border-radius', '4px')
      .style('box-shadow', '0px 2px 4px rgba(0,0,0,0.2)')
      .style('pointer-events', 'none')
      .style('opacity', 0.8);

    const focusDot = svg
      .append('circle')
      .attr('r', 5)
      .attr('fill', 'grey')
      .style('opacity', 0);

    const focusLine = svg
      .append('line')
      .attr('stroke', '#D3D3D3')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .style('opacity', 0);

    // Hover interaction
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mousemove', (event) => {
        const [mouseX, mouseY] = d3.pointer(event);
        const date = x.invert(mouseX);

        // Find the closest data point
        const bisect = d3.bisector((d: SentimentData) => new Date(d.date)).left;
        const index = bisect(sentimentData, date, 1);
        const d0 = sentimentData[index - 1];
        const d1 = sentimentData[index];
        const d =
          d1 &&
          date.getTime() - new Date(d0.date).getTime() >
            new Date(d1.date).getTime() - date.getTime()
            ? d1
            : d0;

        // Update focus dot position
        focusDot
          .attr('cx', x(new Date(d.date)))
          .attr('cy', y(d.sentimentValue))
          .style('opacity', 1);

        // Update focus line position
        focusLine
        .attr('x1', x(new Date(d.date)))
        .attr('x2', x(new Date(d.date)))
        .attr('y1', margin.top)
        .attr('y2', height - margin.bottom)
        .style('opacity', 1);

        // Calculate tooltip position
        const tooltipX = x(new Date(d.date)) - 20; // Offset from dot
        const tooltipY = mouseY; // Track the mouse's Y position

        // Adjust tooltip if it overflows on the right
        const overflowRight = tooltipX + 20 > width; // Assuming tooltip width is 150px
        const adjustedX = overflowRight ? tooltipX - 20 : tooltipX;

        const overflowTop = tooltipY + 30 > height;
        const adjustedY= overflowTop ? tooltipY - 30 : tooltipY;

        tooltip
          .style('opacity', 1)
          .style('font-size', '12px')
          .html(
            `<strong>Date:</strong> ${new Date(d.date).toLocaleString()}<br>
             <strong>Sentiment:</strong> ${d.sentimentValue}<br>
             <strong>Price:</strong> ${d.price}<br>
             <strong>Analysis:</strong> ${d.analysis}`
          )
          .style('left', `${adjustedX}px`) // Adjust position dynamically
          .style('top', `${adjustedY}px`);
      })
      .on('mouseout', () => {
        focusDot.style('opacity', 0);
        focusLine.style('opacity', 0);
        tooltip.style('opacity', 0);
      });
  }, [sentimentData]);

  return <div ref={chartRef}></div>;
};
