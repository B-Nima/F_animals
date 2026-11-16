import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { District } from '../data/districts';

interface FeedBaseChartProps {
  district: District;
}

export function FeedBaseChart({ district }: FeedBaseChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 500;
    const height = 280;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = [
      { label: 'Заготовка сена\n(тыс.т)', value: district.feedBase.hayProduction, color: '#10b981' },
      { label: 'Пастбища\n(тыс.га)', value: district.feedBase.pastureArea / 10, color: '#3b82f6' },
      { label: 'Сенокосы\n(тыс.га)', value: district.feedBase.naturalMeadows, color: '#8b5cf6' },
    ];

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)! * 1.2])
      .range([innerHeight, 0]);

    // Столбики с анимацией
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.label)!)
      .attr('y', innerHeight)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', d => d.color)
      .attr('rx', 4)
      .transition()
      .duration(800)
      .attr('y', d => yScale(d.value))
      .attr('height', d => innerHeight - yScale(d.value));

    // Значения на столбиках
    g.selectAll('.value')
      .data(data)
      .enter()
      .append('text')
      .attr('x', d => xScale(d.label)! + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.value) - 8)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#e2e8f0')
      .text(d => d.value.toFixed(1));

    // Ось X
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#94a3b8')
      .each(function() {
        const text = d3.select(this);
        const lines = text.text().split('\n');
        text.text('');
        lines.forEach((line, i) => {
          text.append('tspan')
            .attr('x', 0)
            .attr('dy', i === 0 ? '0em' : '1.2em')
            .text(line);
        });
      });

    // Ось Y
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', '#94a3b8');

    // Качество пастбищ
    const qualityColor = district.feedBase.pastureQuality === 'high' ? '#10b981' :
      district.feedBase.pastureQuality === 'medium' ? '#f59e0b' : '#ef4444';
    const qualityLabel = district.feedBase.pastureQuality === 'high' ? 'Высокое' :
      district.feedBase.pastureQuality === 'medium' ? 'Среднее' : 'Низкое';

    g.append('circle')
      .attr('cx', innerWidth - 20)
      .attr('cy', 10)
      .attr('r', 6)
      .attr('fill', qualityColor);
    g.append('text')
      .attr('x', innerWidth - 32)
      .attr('y', 14)
      .attr('text-anchor', 'end')
      .style('font-size', '11px')
      .style('fill', '#94a3b8')
      .text(`Качество: ${qualityLabel}`);

    // Заголовок
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 18)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#e2e8f0')
      .text('Кормовая база района');

  }, [district]);

  return <svg ref={svgRef} viewBox="0 0 500 280" className="w-full h-auto" />;
}
