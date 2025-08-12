"use client";

import { normalizeText } from "@/lib/utils";
import { geoMercator, geoPath, select } from "d3";
import { useEffect, useRef, useState } from "react";
import * as topojson from "topojson-client";
import { GeometryObject, Topology } from "topojson-specification";
import { mapData } from "./mapData";

interface ProvinceMapProps {
  provinceName: string;
  data?: { name: string; value: string }[];
  label?: string;
}

const ProvinceMap = ({ provinceName, data = [], label }: ProvinceMapProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [width, setWidth] = useState<number>(300);
  const height = 200;

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      setWidth(svgRef.current?.getBoundingClientRect().width || 300);
    });

    resizeObserver.observe(svgRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!provinceName || !mapData) return;

    select(svgRef.current).selectAll("*").remove();

    const svg = select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    const provinces = topojson.feature(
      mapData as unknown as Topology,
      mapData.objects.vn_iso_province as GeometryObject
    );

    // Find the specific province
    const selectedProvince = (provinces as any).features.find(
      (feature: any) => {
        const featureName = feature.properties?.ten;
        return (
          normalizeText(featureName)?.includes(normalizeText(provinceName)) ||
          normalizeText(provinceName)?.includes(normalizeText(featureName))
        );
      }
    );

    if (!selectedProvince) return;

    // Set up projection and path generator for the specific province
    const projection = geoMercator().fitSize([width, height], selectedProvince);
    const path = geoPath().projection(projection);

    // Draw the selected province
    svg
      .append("g")
      .selectAll("path")
      .data([selectedProvince])
      .enter()
      .append("path")
      .attr("class", "selected-province")
      .attr("d", path as any)
      .attr("fill", "#e74c3c") // Red color for selected province
      .attr("stroke", "#c0392b")
      .attr("stroke-width", 1.5);
  }, [provinceName, data, width, height]);

  if (!provinceName) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <svg ref={svgRef} className="w-full" />
      <div className="text-sm font-semibold mt-2">{provinceName}</div>
      {!!label && !!data && (
        <div>
          <span className="text-sm">{label}:</span>
          <span className="ml-2 text-default-blue text-sm font-semibold">
            {data.find((item) =>
              normalizeText(provinceName)?.includes(normalizeText(item.name))
            )?.value || "0"}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProvinceMap;
