'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { mindshareData } from './mockdata'; 

export const MindshareMap = () => {
  const heatmapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heatmapRef.current) {
      // Clear any previous content
      d3.select(heatmapRef.current).selectAll('*').remove();
    }

    const width = 800;
    const height = 400;
    const cellPadding = 2;

    const svg = d3
      .select(heatmapRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Group data by date
    const groupedData = d3.group(mindshareData, (d) => d.date);
    const dates = Array.from(groupedData.keys());
    const names = Array.from(new Set(mindshareData.map((d) => d.name)));

    // Create a treemap layout to occupy full space
    const root = d3.hierarchy({ values: mindshareData }, (d: any) => d.values)
      .sum((d: any) => d.percentage)
      .sort((a, b) => b.value - a.value);

    d3.treemap()
      .size([width, height])
      .padding(cellPadding)
      .round(true)(root);

    // Draw cells
    const nodes = svg
      .selectAll('g')
      .data(root.leaves())
      .join('g')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`);

    nodes
      .append('rect')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('fill', (d) => d3.interpolateOrRd(d.value)) // Color scheme for heatmap
      .attr('stroke', '#ffffff');

    // Add text labels inside cells
    nodes
      .append('text')
      .attr('x', (d) => (d.x1 - d.x0) / 2)
      .attr('y', (d) => (d.y1 - d.y0) / 2)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .style('fill', '#ffffff') // White text for visibility
      .style('font-size', '10px')
      .text((d) => `${d.data.name}\n${(d.data.percentage * 100).toFixed(1)}%`);

  }, []);

  return <div ref={heatmapRef}></div>;
};
