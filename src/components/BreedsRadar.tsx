import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BreedRecommendation } from '../utils/recommendations';

interface BreedsRadarProps {
  recommendations: BreedRecommendation[];
}

export function BreedsRadar({ recommendations }: BreedsRadarProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || recommendations.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 500;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Параметры для радарной диаграммы
    const params = [
      { key: 'score', label: 'Общая оценка' },
      { key: 'climate', label: 'Климат' },
      { key: 'feed', label: 'Корма' },
      { key: 'zone', label: 'Зона' },
      { key: 'economy', label: 'Экономика' },
    ];

    const topBreeds = recommendations.slice(0, 5);
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    const angleSlice = (Math.PI * 2) / params.length;
    const maxValue = 100;

    // Фоновые круги
    const levels = 5;
    for (let j = 0; j < levels; j++) {
      const r = (radius / levels) * (j + 1);
      g.append('circle')
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', '#334155')
        .attr('stroke-width', 0.5);
    }

    // Оси
    params.forEach((param, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      g.append('line')
        .attr('x1', 0).attr('y1', 0)
        .attr('x2', x).attr('y2', y)
        .attr('stroke', '#475569')
        .attr('stroke-width', 1);

      const labelX = Math.cos(angle) * (radius + 25);
      const labelY = Math.sin(angle) * (radius + 25);

      g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '11px')
        .style('fill', '#94a3b8')
        .text(param.label);
    });

    // Данные для каждой породы
    topBreeds.forEach((rec, idx) => {
      const values = [
        rec.score,
        Math.min(100, rec.score + (rec.breed.adaptation.coldResistance === 'very_high' ? 15 : rec.breed.adaptation.coldResistance === 'high' ? 8 : 0)),
        Math.min(100, rec.score + (rec.reasons.some(r => r.includes('корм')) ? 10 : -5)),
        Math.min(100, rec.score + (rec.reasons.some(r => r.includes('зона')) ? 10 : -5)),
        rec.breed.economicIndicators.profitability * 10,
      ];

      const radarLine = d3.lineRadial<number>()
        .radius(d => (d / maxValue) * radius)
        .angle((_, i) => i * angleSlice)
        .curve(d3.curveLinearClosed);

      g.append('path')
        .datum(values)
        .attr('d', radarLine)
        .attr('fill', colors[idx])
        .attr('fill-opacity', 0.1)
        .attr('stroke', colors[idx])
        .attr('stroke-width', 2);

      // Точки
      values.forEach((val, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const r = (val / maxValue) * radius;
        g.append('circle')
          .attr('cx', Math.cos(angle) * r)
          .attr('cy', Math.sin(angle) * r)
          .attr('r', 4)
          .attr('fill', colors[idx]);
      });
    });

    // Легенда
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 180}, 20)`);

    topBreeds.forEach((rec, idx) => {
      const ly = idx * 22;
      legend.append('rect')
        .attr('x', 0).attr('y', ly)
        .attr('width', 12).attr('height', 12)
        .attr('fill', colors[idx])
        .attr('rx', 2);
      legend.append('text')
        .attr('x', 18).attr('y', ly + 10)
        .style('font-size', '10px')
        .style('fill', '#e2e8f0')
        .text(rec.breed.name.length > 20 ? rec.breed.name.slice(0, 20) + '...' : rec.breed.name);
    });

    // Заголовок
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#e2e8f0')
      .text('Сравнение пород по параметрам');

  }, [recommendations]);

  return <svg ref={svgRef} viewBox="0 0 500 400" className="w-full h-auto" />;
}
