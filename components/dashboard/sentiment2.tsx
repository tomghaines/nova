import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import fetchSentimentData from '@/app/data/SentimentData';
import { SentimentData } from '@/app/types/data/SentimentData.types';
import { data, priceData } from './mockdata';

export const SentimentChart2 = ({ onLoadComplete }) => {
  const svgRef = useRef();


  const chartRef = useRef<HTMLDivElement>(null);
/*   const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchSentimentData();
      setSentimentData(data);
    };
    getData();
  }, []); */

  useEffect(() => {
    // Check for empty data
    if (!sentimentData || sentimentData.length === 0) return;

    // Clear existing chart
    if (chartRef.current) {
      d3.select(chartRef.current).selectAll('*').remove();
    }

    // Dimensions and margins
    const width = 800;
    const height = 450; // Increased height to provide more space for the legend
    const margin = { top: 80, right: 60, bottom: 40, left: 50 };
    
    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([margin.left, width - margin.right]);

    const yScalePrice = d3
      .scaleLinear()
      .domain([
        d3.min(priceData, (d) => d.price) - 0.5,
        d3.max(priceData, (d) => d.price) + 0.5
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const yScaleSentiment = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.value) - 0.1,
        d3.max(data, (d) => d.value) + 0.1
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    onLoadComplete();
    /*     // Line generator for sentiment
    const line = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScaleSentiment(d.value))
      .curve(d3.curveMonotoneX); */

    // Line generator for price
    const priceLine = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScalePrice(d.price))
      .curve(d3.curveMonotoneX);

    // Area generator for positive and negative areas
    /*     const area = d3
      .area()
      .x((d) => xScale(d.date))
      .y0((d) => yScaleSentiment(0))
      .y1((d) => yScaleSentiment(d.value))
      .curve(d3.curveMonotoneX); */

    // Function to calculate intersection points with y=0
    const getIntersectionPoints = (data) => {
      const intersectionPoints = [];
      for (let i = 1; i < data.length; i++) {
        const prev = data[i - 1];
        const curr = data[i];
        if (
          (prev.value >= 0 && curr.value < 0) ||
          (prev.value < 0 && curr.value >= 0)
        ) {
          const slope = (curr.value - prev.value) / (curr.date - prev.date);
          const intersectDate = new Date(
            prev.date.getTime() - prev.value / slope
          );
          intersectionPoints.push({ date: intersectDate, value: 0 });
        }
      }
      return intersectionPoints;
    };

    // Merge data and intersection points, then sort by date
    const intersectionPoints = getIntersectionPoints(data);
    const mergedData = [...data, ...intersectionPoints].sort(
      (a, b) => a.date - b.date
    );

    // Separate positive and negative areas
    const positiveArea = d3
      .area()
      .x((d) => xScale(d.date))
      .y0((d) => yScaleSentiment(0))
      .y1((d) => (d.value >= 0 ? yScaleSentiment(d.value) : yScaleSentiment(0)))
      .curve(d3.curveMonotoneX);

    const negativeArea = d3
      .area()
      .x((d) => xScale(d.date))
      .y0((d) => yScaleSentiment(0))
      .y1((d) => (d.value < 0 ? yScaleSentiment(d.value) : yScaleSentiment(0)))
      .curve(d3.curveMonotoneX);

    // Select SVG element
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous contents

    // Set SVG dimensions
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Append legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${margin.left + 30}, ${margin.top - 10})`);

    // Legend for price line
    legend
      .append('g')
      .attr('transform', 'translate(0, 0)')
      .call((g) => {
        g.append('line')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', 20)
          .attr('y2', 0)
          .attr('stroke', 'gray')
          .attr('stroke-width', 4);
        g.append('text')
          .attr('x', 30)
          .attr('y', 1)
          .text('Price')
          .attr('fill', 'grey')
          .style('font-size', '12px')
          .style('alignment-baseline', 'middle');
      });

    // Legend for sentiment area
    legend
      .append('g')
      .attr('transform', 'translate(150, 0)')
      .call((g) => {
        g.append('line')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', 10)
          .attr('y2', 0)
          .attr('stroke', 'green')
          .attr('stroke-width', 4)
          .attr('stroke-linecap', 'round');
        g.append('line')
          .attr('x1', 10)
          .attr('y1', 0)
          .attr('x2', 20)
          .attr('y2', 0)
          .attr('stroke', 'red')
          .attr('stroke-width', 4)
          .attr('stroke-linecap', 'round')
          .attr('opacity', 0.5);
        g.append('text')
          .attr('x', 30)
          .attr('y', 1)
          .text('Sentiment analytics')
          .attr('fill', 'grey')
          .style('font-size', '12px')
          .style('alignment-baseline', 'middle');
      });

    // Append positive area
    svg
      .append('path')
      .datum(mergedData)
      .attr('fill', 'green')
      .attr('opacity', 0.5)
      .attr('d', positiveArea);

    // Append negative area
    svg
      .append('path')
      .datum(mergedData)
      .attr('fill', 'red')
      .attr('opacity', 0.5)
      .attr('d', negativeArea);

    // Append sentiment line path
    /*     svg
      .append('path')
      .datum(mergedData)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('d', line); */

    // Append price line path
    svg
      .append('path')
      .datum(priceData)
      .attr('fill', 'none')
      .attr('stroke', '#ced2d9')
      .attr('stroke-width', 2.5)
      .attr('d', priceLine);

    // Append circles for data points
    svg
      .selectAll('.point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', (d) => xScale(d.date))
      .attr('cy', (d) => yScaleSentiment(d.value))
      .attr('r', 4)
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .attr('stroke-width', 1.5);

    // X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(width / 80)
          .tickSizeOuter(0)
      );

    // Y axis for price on the left
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScalePrice));

    // Y axis for sentiment on the right
    const yAxisRight = d3
      .axisRight(yScaleSentiment)
      .ticks(5)
      .tickFormat((d) => {
        return d >= 0 ? `+${d}` : d;
      });

    svg
      .append('g')
      .attr('transform', `translate(${width - margin.right},0)`)
      .call(yAxisRight)
      .selectAll('.tick text')
      .attr('fill', (d) => (d >= 0 ? 'green' : 'red'));
<<<<<<< HEAD
  }, [sentimentData, onLoadComplete]);
=======

  }, [/* sentimentData */, onLoadComplete]);

  return <svg ref={svgRef} ></svg>;
  };