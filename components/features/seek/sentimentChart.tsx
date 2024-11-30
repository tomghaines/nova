import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import fetchSentimentData from '@/app/data/SentimentData';
import { SentimentData } from '@/app/types/data/SentimentData.types';
import { data, priceData } from '../dashboard/mockdata';
import { Info } from 'lucide-react';

export const SentimentChart = ({timePeriod, onLoadComplete}) => {
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
    /* if (!sentimentData || sentimentData.length === 0) return; */

    // Clear existing chart
    if (chartRef.current) {
      d3.select(chartRef.current).selectAll('*').remove();
    }

    // Filter data based on selected time period
    const now = new Date(); // Get the current date
    if (timePeriod === 'Last 6 months') {
      data = data.filter((d) => d.date >= (() => { const tempDate = new Date(now); tempDate.setMonth(tempDate.getMonth() - $1); return tempDate; })());
      priceData = priceData.filter((d) => d.date >= new Date(now.setMonth(now.getMonth() - 6)));
    } else if (timePeriod === 'Last 3 months') {
      data = data.filter((d) => d.date >= new Date(now.setMonth(now.getMonth() - 3)));
      priceData = priceData.filter((d) => d.date >= new Date(now.setMonth(now.getMonth() - 3)));
    } else if (timePeriod === 'Last 1 months') {
      data = data.filter((d) => d.date >= new Date(now.setMonth(now.getMonth() - 1)));
      priceData = priceData.filter((d) => d.date >= new Date(now.setMonth(now.getMonth() - 1)));
    }

    // Dimensions and margins
    const width = 1100;
    const height = 600; 
    const margin = { top: 20, right: 55, bottom: 40, left: 55 };
    
    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([margin.left, width - margin.right]);

    const yScalePrice = d3
      .scaleLinear()
      .domain([d3.min(priceData, (d) => d.price) - 0.5, d3.max(priceData, (d) => d.price) + 0.5])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const yScaleSentiment = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.value) - 0.1,
        d3.max(data, (d) => d.value) + 0.1,
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);
    
    onLoadComplete();

    // Line generator for price
    const priceLine = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScalePrice(d.price))
    .curve(d3.curveMonotoneX);

    // Function to calculate intersection points with y=0
    const getIntersectionPoints = (data) => {
      const intersectionPoints = [];
      for (let i = 1; i < data.length; i++) {
        const prev = data[i - 1];
        const curr = data[i];
        if ((prev.value >= 0 && curr.value < 0) || (prev.value < 0 && curr.value >= 0)) {
          const slope = (curr.value - prev.value) / (curr.date - prev.date);
          const intersectDate = new Date(prev.date.getTime() - prev.value / slope);
          intersectionPoints.push({ date: intersectDate, value: 0 });
        }
      }
      return intersectionPoints;
    };

    // Merge data and intersection points, then sort by date
    const intersectionPoints = getIntersectionPoints(data);
    const mergedData = [...data, ...intersectionPoints].sort((a, b) => a.date - b.date);

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
  const legend = svg.append('g').attr('transform', `translate(${margin.left + 30}, ${margin.top - 10})`);

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
        .attr('stroke', '#ced2d9') // gray
        .attr('stroke-width', 4);
      g.append('text')
        .attr('x', 30)
        .attr('y', 1)
        .text('Price')
        .attr('fill', 'grey')
        .style('font-size', '16px')
        .style('alignment-baseline', 'middle');
    });

  // Legend for sentiment area
  legend
    .append('g')
    .attr('transform', 'translate(100, 0)')
    .call((g) => {
      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 10)
        .attr('y2', 0)
        .attr('stroke', '#00d97f')  // green
        .attr('stroke-width', 4)
        .attr('stroke-linecap', 'round');
      g.append('line')
        .attr('x1', 11)
        .attr('y1', 0)
        .attr('x2', 20)
        .attr('y2', 0)
        .attr('stroke', '#ff3344')  // red
        .attr('stroke-width', 4)
        .attr('stroke-linecap', 'round')
      g.append('text')
        .attr('x', 30)
        .attr('y', 1)
        .text('Sentiment analytics')
        .attr('fill', 'grey')
        .style('font-size', '16px')
        .style('alignment-baseline', 'middle');
    });

    // Append positive area
    svg
    .append('path')
    .datum(mergedData)
    .attr('fill', '#00d97f')  // green
    .attr('opacity', 1)
    .attr('d', positiveArea);
  
    // Append negative area
    svg
    .append('path')
    .datum(mergedData)
    .attr('fill', '#ff3344')  // red
    .attr('opacity', 1)
    .attr('d', negativeArea)

    // Append vertical line for tracking
    const trackingLine = svg
    .append('line')
    .attr('stroke', '#ced2d9')
    .attr('id', 'trackingLine')
    .attr('stroke-width', 1)
    .attr('opacity', 0)
    .attr('y1', margin.top)
    .attr('y2', height - margin.bottom);

    // Append a transparent rectangle for capturing mouse events
    svg
    .append('rect')
    .attr('width', width - margin.left - margin.right)
    .attr('height', height - margin.top - margin.bottom)
    .attr('x', margin.left)
    .attr('y', margin.top)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseover', (event, d) => {
      // Create tooltip for sentiment information if it doesn't exist
      if (!d3.select('#sentiment-tooltip').node()) {
        d3.select('body')
          .append('div')
          .attr('id', 'sentiment-tooltip')
          .attr('class', 'fixed p-2 bg-gray-800 text-white rounded text-xs shadow-md')
          .style('opacity', 0.9)
          .style('position', 'absolute');
      }

      // Create tooltip for AI analysis if it doesn't exist
      if (!d3.select('#ai-tooltip').node()) {
        d3.select('body')
          .append('div')
          .attr('id', 'ai-tooltip')
          .attr('class', 'fixed p-2 mt-2 max-w-xs bg-gray-800 text-white rounded text-xs shadow-md')
          .style('opacity', 0.9)
          .style('position', 'absolute');
      }

      // Make tracking line visible
       trackingLine.attr('opacity', 1);
    })
    .on('mousemove', (event) => {
      // Get mouse X position in the SVG coordinate space
      const mouseX = d3.pointer(event)[0];
      const mouseDate = xScale.invert(mouseX);

      // Find the nearest sentiment data point
      const bisectDate = d3.bisector((d) => d.date).left;
      const index = bisectDate(data, mouseDate);
      const nearestData = data[Math.max(0, Math.min(index, data.length - 1))];
      const formattedDate = nearestData.date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      // Find the matching priceData for the nearest date
      const matchingPriceData = priceData.find(
        (price) => price.date.getTime() === nearestData.date.getTime()
      );

      const priceText = matchingPriceData ? `$${matchingPriceData.price.toFixed(2)}` : 'N/A';

      // Update tooltips
      d3.select('#sentiment-tooltip')
        .style('left', `${Math.min(event.pageX + 10, window.innerWidth - 100)}px`)
        .style('top', `${Math.min(event.pageY - 28, window.innerHeight - 50)}px`)
        .html(`Sentiment: ${nearestData.value.toFixed(2)}<br>Price: ${priceText}<br>Date: ${formattedDate}`);

      d3.select('#ai-tooltip')
        .style('left', `${Math.min(event.pageX + 10, window.innerWidth - 100)}px`)
        .style('top', `${Math.min(event.pageY + 30, window.innerHeight - 70)}px`)
        .html(`
          Ⓘ Generated by AI: <br> The sentiment for this data point is ${nearestData.value.toFixed(2)} with a price of ${priceText}.
        `);
      
      // Update the vertical tracking line position
      trackingLine
        .attr('x1', mouseX)
        .attr('x2', mouseX);

      // Update the circle radius based on proximity to mouse
      circles.attr('r', (d) => {
        const circleX = xScale(d.date);
        const distance = Math.abs(circleX - mouseX);
        return distance < 5 ? 6 : 3; // Increase radius if close to the mouse, otherwise keep it normal
    });
    })
    .on('mouseout', () => {
      // Remove tooltips and trackingLine
      trackingLine.attr('opacity', 0);
      d3.select('#sentiment-tooltip').remove();
      d3.select('#ai-tooltip').remove();
      circles.attr('r', 3);
    });

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
      .attr('stroke', '#ced2d9') // grey
      .attr('stroke-width', 2)
      .attr('d', priceLine);

    // Append circles for data points and mouse events for tooltips
    const circles = svg
      .selectAll('.point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', (d) => xScale(d.date))
      .attr('cy', (d) => yScaleSentiment(d.value))
      .attr('r', 3)
      .attr('fill', '#ebecef')  // light grey

    // X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .style('font-size', '12px')
      .call(d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0));

    // Y axis for price on the left
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .style('font-size', '12px')
      .call(d3.axisLeft(yScalePrice));

    // Y axis for sentiment on the right
    const yAxisRight = d3.axisRight(yScaleSentiment).ticks(5).tickFormat((d) => {
      return d >= 0 ? `+${d}` : d;
    });

    svg
      .append('g')
      .attr('transform', `translate(${width - margin.right},0)`)
      .call(yAxisRight)
      .selectAll('.tick text')
      .style('font-size', '12px')
      .attr('fill', (d) => (d >= 0 ? '#00d97f' : '#ff3344')); // 'green' : 'red'

  }, [/* sentimentData, */ onLoadComplete]);

  return (
      <svg ref={svgRef} ></svg>
  )
  };