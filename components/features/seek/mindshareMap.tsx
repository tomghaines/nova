'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import fetchMindshareData from '@/lib/database/MindshareData';
import { MindshareData } from '@/@types/data/MindshareData';

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

    // Draw cells
    const nodes = svg
      .selectAll<SVGGElement, TreemapNode>('g')
      .data(root.leaves() as unknown as TreemapNode)
      .join('g')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`);

    nodes
      .append('rect')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('fill', (d) => d3.interpolateOrRd(d.value * 4)) // Color scheme for heatmap
      .attr('fill', (d) => d3.interpolateOrRd(d.value * 4)) // Color scheme for heatmap
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
  }, [mindshareData]);

  onLoadComplete();

  return <div ref={heatmapRef}></div>;
};
