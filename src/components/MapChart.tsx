import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { District } from '../data/districts';

interface MapChartProps {
  districts: District[];
  selectedDistrict: District | null;
  onSelectDistrict: (district: District) => void;
}

export function MapChart({ districts, selectedDistrict, onSelectDistrict }: MapChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 450;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Проекция для Бурятии
    const projection = d3.geoMercator()
      .center([107.5, 52.5])
      .scale(2800)
      .translate([(width - margin.left - margin.right) / 2, (height - margin.top - margin.bottom) / 2]);

    // Границы Бурятии (упрощённый контур)
    const buryatiaBorder: [number, number][] = [
      [99.0, 51.0], [99.5, 50.0], [100.5, 49.8], [101.5, 49.9],
      [102.5, 50.2], [103.5, 50.0], [104.5, 50.2], [105.5, 50.5],
      [106.5, 50.2], [107.5, 50.0], [108.5, 50.2], [109.5, 50.5],
      [110.5, 51.0], [111.5, 51.5], [112.5, 52.0], [113.5, 52.5],
      [114.5, 53.5], [115.5, 54.5], [116.0, 55.5], [115.5, 56.0],
      [114.5, 56.5], [113.0, 56.0], [112.0, 55.5], [111.0, 55.0],
      [110.0, 54.5], [109.0, 54.0], [108.0, 53.5], [107.0, 53.0],
      [106.0, 53.0], [105.0, 52.8], [104.0, 52.5], [103.0, 52.5],
      [102.0, 52.0], [101.0, 51.8], [100.0, 51.5], [99.0, 51.0],
    ];

    const pathGen = d3.geoPath().projection(projection);

    // Рисуем контур
    const geoJson: any = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [buryatiaBorder],
      },
      properties: {},
    };

    g.append('path')
      .datum(geoJson)
      .attr('d', pathGen as any)
      .attr('fill', '#1e293b')
      .attr('stroke', '#475569')
      .attr('stroke-width', 1.5);

    // Зоны (цветовое кодирование)
    const zoneColors: Record<string, string> = {
      'steppe': '#92400e',
      'forest-steppe': '#065f46',
      'mountain-taiga': '#1e3a5f',
      'mountain-tundra': '#4c1d95',
    };

    // Районы как точки
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip-buryatia')
      .style('position', 'absolute')
      .style('background', 'rgba(15, 23, 42, 0.95)')
      .style('border', '1px solid #475569')
      .style('border-radius', '8px')
      .style('padding', '8px 12px')
      .style('font-size', '12px')
      .style('color', '#e2e8f0')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', '1000')
      .style('box-shadow', '0 4px 6px rgba(0,0,0,0.3)');

    districts.forEach(district => {
      const [x, y] = projection([district.lng, district.lat]) || [0, 0];
      
      const isSelected = selectedDistrict?.id === district.id;
      const color = zoneColors[district.zone] || '#475569';

      // Внешний круг (зона)
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', isSelected ? 14 : 10)
        .attr('fill', color)
        .attr('fill-opacity', isSelected ? 0.9 : 0.6)
        .attr('stroke', isSelected ? '#fbbf24' : '#94a3b8')
        .attr('stroke-width', isSelected ? 3 : 1)
        .style('cursor', 'pointer')
        .on('mouseover', function(event) {
          d3.select(this).attr('r', 16).attr('fill-opacity', 0.9);
          tooltip
            .style('opacity', 1)
            .html(`<strong>${district.name}</strong><br/>
              Зона: ${getZoneLabel(district.zone)}<br/>
              САТ: ${district.climate.sumActiveTemps}°C<br/>
              Осадки: ${district.climate.precipitation} мм`);
        })
        .on('mousemove', function(event) {
          tooltip
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function() {
          d3.select(this)
            .attr('r', isSelected ? 14 : 10)
            .attr('fill-opacity', isSelected ? 0.9 : 0.6);
          tooltip.style('opacity', 0);
        })
        .on('click', function() {
          onSelectDistrict(district);
        });

      // Внутренний круг (индикатор)
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 4)
        .attr('fill', isSelected ? '#fbbf24' : '#e2e8f0')
        .style('pointer-events', 'none');
    });

    // Легенда зон
    const legend = g.append('g').attr('transform', `translate(10, ${height - margin.top - margin.bottom - 100})`);
    
    const zones = [
      { zone: 'steppe', label: 'Степная' },
      { zone: 'forest-steppe', label: 'Лесостепная' },
      { zone: 'mountain-taiga', label: 'Горно-таёжная' },
      { zone: 'mountain-tundra', label: 'Горно-тундровая' },
    ];

    zones.forEach((z, i) => {
      legend.append('circle')
        .attr('cx', 8).attr('cy', i * 22)
        .attr('r', 6)
        .attr('fill', zoneColors[z.zone]);
      legend.append('text')
        .attr('x', 20).attr('y', i * 22 + 4)
        .style('font-size', '11px')
        .style('fill', '#94a3b8')
        .text(z.label);
    });

    return () => {
      tooltip.remove();
    };
  }, [districts, selectedDistrict, onSelectDistrict]);

  return <svg ref={svgRef} viewBox="0 0 600 450" className="w-full h-auto" />;
}

function getZoneLabel(zone: string): string {
  const labels: Record<string, string> = {
    'steppe': 'Степная',
    'forest-steppe': 'Лесостепная',
    'mountain-taiga': 'Горно-таёжная',
    'mountain-tundra': 'Горно-тундровая',
  };
  return labels[zone] || zone;
}
