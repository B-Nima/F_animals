import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { districts, District } from '../data/districts';

interface ComparisonChartProps {
  selectedDistrict: District | null;
}

export function ComparisonChart({ selectedDistrict }: ComparisonChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 700;
    const height = 350;
    const margin = { top: 30, right: 30, bottom: 80, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Данные для сравнения
    const sortedDistricts = [...districts].sort((a, b) => 
      b.feedBase.hayProduction - a.feedBase.hayProduction
    );

    const xScale = d3.scaleBand()
      .domain(sortedDistricts.map(d => d.name.replace(' район', '')))
      .range([0, innerWidth])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(sortedDistricts, d => d.feedBase.hayProduction)! * 1.1])
      .range([innerHeight, 0]);

    // Столбики
    g.selectAll('.bar')
      .data(sortedDistricts)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.name.replace(' район', ''))!)
      .attr('y', d => yScale(d.feedBase.hayProduction))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.feedBase.hayProduction))
      .attr('fill', d => d.id === selectedDistrict?.id ? '#10b981' : '#3b82f6')
      .attr('fill-opacity', d => d.id === selectedDistrict?.id ? 1 : 0.6)
      .attr('rx', 3);

    // Ось X
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '9px')
      .style('fill', '#94a3b8')
      .attr('transform', 'rotate(-35)')
      .attr('text-anchor', 'end');

    // Ось Y
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', '#94a3b8');

    // Подпись оси Y
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -38)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#94a3b8')
      .text('Заготовка сена, тыс. тонн');

    // Заголовок
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 18)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#e2e8f0')
      .text('Сравнение районов по заготовке кормов');

  }, [selectedDistrict]);

  return <svg ref={svgRef} viewBox="0 0 700 350" className="w-full h-auto" />;
}
