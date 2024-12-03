'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import fetchMindshareData from '@/lib/database/MindshareData';
import { MindshareData } from '@/@types/data/MindshareData';
import { TextBox } from 'd3plus-text';
interface HierarchyDatum {
  values: MindshareData[];
}

interface TreemapNode extends d3.HierarchyRectangularNode<unknown> {
  data: {
    name: string;
    percentage: number;
  };
}

export const MindshareMap = ({ onLoadComplete }) => {
  const heatmapRef = useRef<HTMLDivElement>(null);
  const [mindshareData, setMindshareData] = useState<MindshareData[]>([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchMindshareData();
      setMindshareData(data);
    };
    getData();
  }, []);

  useEffect(() => {
    // Check for empty data
    if (!mindshareData || mindshareData.length === 0) return;

    if (heatmapRef.current) {
      // Clear any previous content
      d3.select(heatmapRef.current).selectAll('*').remove();
    }

    const width = 900;
    const height = 600;
    const cellPadding = 3;

    const svg = d3
      .select(heatmapRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Group data by date
    // const groupedData = d3.group(mindshareData, (d: MindshareData) => d.date);
    // const dates = Array.from(groupedData.keys());
    // const names = Array.from(new Set(mindshareData.map((d) => d.name)));

    // Create a treemap layout to occupy full space
    const root = d3
      .hierarchy<HierarchyDatum>(
        { values: mindshareData },
        (d: any) => d.values
      )
      .sum((d: any) => d.percentage)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    d3
      .treemap<HierarchyDatum>()
      .size([width, height])
      .padding(cellPadding)
      .round(true)(root);

    // Define the custom color scale with multiple color stops
    const colorScale = d3
      .scaleLinear()
      .domain([0, 0.5, 1]) // Divide the range into parts
      .range(['#300a0d', '#801a22', '#bf2633']); // The color stops

    // Normalize data values to range [0, 1]
    const maxValue = d3.max(root.leaves(), (d) => d.value) || 1;
    const normalizedValue = (value) => value / maxValue;

    // Draw cells
    const nodes = svg
      .selectAll<SVGGElement, TreemapNode>('g')
      .data(root.leaves() as unknown as TreemapNode)
      .join('g')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`)
      .on('mouseover', function (event, d) {
        // Calculate the width and height of each cell
        const width = d.x1 - d.x0;
        const height = d.y1 - d.y0;

        // Calculate the center coordinates of the cell
        const centerX = width / 2;
        const centerY = height / 2;

        d3.select(this)
          .transition()
          .duration(200)
          .attr(
            'transform',
            `translate(${d.x0 + centerX},${d.y0 + centerY}) scale(1.05) translate(${-centerX},${-centerY})`
          );
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', (d) => `translate(${d.x0},${d.y0}) scale(1)`);
      });

    // draw rectangles for each cell
    nodes
      .append('rect')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('fill', (d) => colorScale(normalizedValue(d.value || 0)))
      .attr('class', 'treemap-cell');

    // Append foreignObject for HTML content
    nodes
      .append('foreignObject')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('x', 10)
      .attr('y', 10)
      .append('xhtml:div')
      .attr('xmlns', 'http://www.w3.org/1999/xhtml')
      .attr(
        'class',
        'w-full h-full p-2 text-white text-xs text-left break-normal text-wrap flex flex-col justify-start'
      )
      .html(
        (d) => `
        <div class="font-bold text-base">${d.data.name}</div>
        <div class="mt-1">${(d.data.percentage * 100).toFixed(1)}%</div>
      `
      );

    onLoadComplete();
  }, [mindshareData]);

  return <div ref={heatmapRef}></div>;
};
