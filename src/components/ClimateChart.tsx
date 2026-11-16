import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { District } from '../data/districts';

interface ClimateChartProps {
  district: District;
}

export function ClimateChart({ district }: ClimateChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 500;
    const height = 300;
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Данные для температурного графика (среднемесячные)
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    const avgTemp = district.climate.avgWinterTemp;
    const summerTemp = district.climate.avgSummerTemp;
    
    // Аппроксимация месячных температур
    const temperatures = months.map((_, i) => {
      const phase = (i - 6) / 6 * Math.PI; // пик в июле
      return (summerTemp + avgTemp) / 2 + ((summerTemp - avgTemp) / 2) * Math.cos(phase);
    });

    // Осадки по месяцам (аппроксимация)
    const annualPrecip = district.climate.precipitation;
    const precipitations = months.map((_, i) => {
      const summerFactor = Math.max(0, Math.cos((i - 6) / 6 * Math.PI));
      return (annualPrecip / 12) * (0.5 + summerFactor * 1.2);
    });

    // Шкалы
    const xScale = d3.scaleBand()
      .domain(months)
      .range([0, innerWidth])
      .padding(0.1);

    const yTempScale = d3.scaleLinear()
      .domain([Math.min(avgTemp - 5, -35), Math.max(summerTemp + 5, 25)])
      .range([innerHeight, 0]);

    const yPrecipScale = d3.scaleLinear()
      .domain([0, d3.max(precipitations)! * 1.3])
      .range([innerHeight, 0]);

    // Столбики осадков
    g.selectAll('.bar')
      .data(precipitations)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (_, i) => xScale(months[i])!)
      .attr('y', d => yPrecipScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yPrecipScale(d))
      .attr('fill', '#60a5fa')
      .attr('opacity', 0.4)
      .attr('rx', 2);

    // Линия температуры
    const line = d3.line<number>()
      .x((_, i) => xScale(months[i])! + xScale.bandwidth() / 2)
      .y(d => yTempScale(d))
      .curve(d3.curveCatmullRom);

    g.append('path')
      .datum(temperatures)
      .attr('fill', 'none')
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Точки температуры
    g.selectAll('.dot')
      .data(temperatures)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (_, i) => xScale(months[i])! + xScale.bandwidth() / 2)
      .attr('cy', d => yTempScale(d))
      .attr('r', 4)
      .attr('fill', '#ef4444')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    // Оси
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', '#94a3b8');

    g.append('g')
      .call(d3.axisLeft(yTempScale).ticks(6))
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', '#ef4444');

    // Подписи осей
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#94a3b8')
      .text('Месяцы');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -35)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#ef4444')
      .text('Температура, °C');

    // Заголовок
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 18)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#e2e8f0')
      .text('Климатический профиль района');

    // Легенда
    const legend = g.append('g').attr('transform', `translate(${innerWidth - 150}, -10)`);
    
    legend.append('line')
      .attr('x1', 0).attr('x2', 20).attr('y1', 0).attr('y2', 0)
      .attr('stroke', '#ef4444').attr('stroke-width', 3);
    legend.append('text')
      .attr('x', 25).attr('y', 4)
      .style('font-size', '11px').style('fill', '#e2e8f0')
      .text('Температура');

    legend.append('rect')
      .attr('x', 0).attr('y', 12).attr('width', 20).attr('height', 10)
      .attr('fill', '#60a5fa').attr('opacity', 0.4).attr('rx', 2);
    legend.append('text')
      .attr('x', 25).attr('y', 22)
      .style('font-size', '11px').style('fill', '#e2e8f0')
      .text('Осадки');

  }, [district]);

  return <svg ref={svgRef} viewBox="0 0 500 300" className="w-full h-auto" />;
}
