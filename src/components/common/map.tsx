"use client";

import { normalizeText } from "@/lib/utils";
import {
  extent,
  geoMercator,
  geoPath,
  range,
  ScaleQuantize,
  scaleQuantize,
  schemeYlOrRd,
  select,
  selectAll,
} from "d3";
import { useCallback, useEffect, useRef, useState } from "react";
import * as topojson from "topojson-client";
import { GeometryObject, Topology } from "topojson-specification";
import { mapData } from "./mapData";

type DataType = {
  name: string;
  value: string;
};

interface MapProps {
  data: DataType[];
  legendLabel: string;
  isLoading: boolean;
  showLegend?: boolean;
  onProvinceClick?: (province: string) => void;
  ratio?: number;
  label?: string; // New label prop
}

const MapChart = ({
  data,
  legendLabel,
  isLoading,
  showLegend = true,
  onProvinceClick,
  ratio = 600 / 800, // ratio = height / width,
  label = "", // Default empty label
}: MapProps) => {
  const [tooltip, setTooltip] = useState({
    visible: false,
    province: "",
    value: "",
    coordinates: { x: 0, y: 0 },
    clicked: false, // Track if tooltip was opened by click
  });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [width, setWidth] = useState<number>(800);

  // const width =
  //   select(svgRef.current)?.node()?.getBoundingClientRect().width || 800;
  // const height = width * ratio;

  // Create the legend
  const createLegend = useCallback(
    (colorScale: ScaleQuantize<string, never>) => {
      const legendSvg = select("#legend");

      const domainValues = colorScale.domain();
      const numberOfColors = colorScale.range().length;

      // Generate ticks for the legend
      const ticks = range(numberOfColors).map((i) => {
        const ratio = i / (numberOfColors - 1);
        return Math.round(
          domainValues[0] + ratio * (domainValues[1] - domainValues[0])
        );
      });

      const legend = legendSvg
        .selectAll(".legend-item")
        .data(colorScale.range())
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(${i * 40}, 0)`); // Adjust spacing for horizontal layout

      legend
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 40)
        .attr("height", 20)
        .style("fill", (d) => d); // Fill with the color from the range

      legend
        .append("text")
        .attr("x", 20) // Center the text below the color block
        .attr("y", 30) // Move the text down to be below the color block
        .attr("text-anchor", "middle") // Center the text horizontally
        .attr("font-size", "12px")
        .text((d, i) => {
          return ticks[i]; // Display the tick value, formatted as needed
        });
    },
    []
  );

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      setWidth(svgRef.current?.getBoundingClientRect().width || 800);
    });

    resizeObserver.observe(svgRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!isLoading && mapData) {
      select(svgRef.current).selectAll("*").remove();

      const height = width * ratio;

      const svg = select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("id", "map")
        .attr("viewBox", [0, 0, width, height]);
      // .attr("preserveAspectRatio", "xMidYMid meet");

      const provinces = topojson.feature(
          mapData as unknown as Topology,
          mapData.objects.vn_iso_province as GeometryObject
        ),
        country = topojson.mesh(
          mapData as unknown as Topology,
          mapData.objects.vn_iso_province as GeometryObject,
          (a, b) => a == b
        );
      // Set up projection and path generator
      const projection = geoMercator().fitSize([width, height], provinces);

      const path = geoPath().projection(projection);

      // Calculate domain
      const range = extent(
        data?.map((item) => Number(item?.value || 0)) || [0, 0]
      ) as [number, number];

      const colorScale = scaleQuantize(range, schemeYlOrRd[9]);

      if (showLegend) {
        createLegend(colorScale);
      }

      // Draw provinces
      svg
        .append("g")
        .selectAll("path")
        .data((provinces as any).features)
        .enter()
        .append("path")
        .attr("class", "province")
        .attr("d", path as any)
        .attr("fill", function (d: any) {
          const name = d?.properties?.ten;

          if (!name) {
            return "white";
          }

          const provinceItem = data?.find((item) => item.name?.includes(name));

          return colorScale(Number(provinceItem?.value || 0));
        })
        .attr("stroke", "#666")
        .attr("stroke-width", 0.3)
        .style("cursor", onProvinceClick ? "pointer" : "default")
        .on("click", function (event: MouseEvent, d: any) {
          const name = d?.properties?.ten;
          const provinceItem = data?.find((item) =>
            normalizeText(item.name)
              ?.replaceAll(/[^a-zA-Z0-9\s]/g, "")
              ?.includes(normalizeText(name)?.replaceAll(/[^a-zA-Z0-9\s]/g, ""))
          );

          // Show tooltip on click
          setTooltip({
            visible: true,
            province: provinceItem?.name || d?.properties?.ten,
            value: provinceItem?.value || "0",
            coordinates: { x: event.clientX, y: event.clientY },
            clicked: true,
          });
        })
        .on("mouseover", function (event: MouseEvent, d: any) {
          // Only show visual feedback, no tooltip on hover
          selectAll(".province")
            .transition()
            .duration(200)
            .style("opacity", 0.2);
          select(this).transition().duration(200).style("opacity", 1);
        })
        .on("mouseleave", function () {
          // Reset visual feedback
          selectAll(".province").transition().duration(200).style("opacity", 1);
        });

      // Draw country border
      svg
        .append("path")
        .datum(country)
        .attr("fill", "none")
        .attr("stroke", "#666")
        .attr("stroke-width", 0.1)
        .attr("d", path);
    }
  }, [
    createLegend,
    data,
    isLoading,
    showLegend,
    width,
    onProvinceClick,
    ratio,
  ]);

  return (
    <>
      <svg
        ref={svgRef}
        className="w-full max-h-[calc(100%_-_100px)]"
        onClick={(e) => {
          // Close clicked tooltip when clicking on empty map area
          if (e.target === e.currentTarget && tooltip.clicked) {
            setTooltip((prev) => ({ ...prev, visible: false, clicked: false }));
          }
        }}
      ></svg>

      {data?.length > 1 && showLegend ? (
        <div className="flex flex-col items-center mt-4">
          <div className="text-xs">{legendLabel}</div>{" "}
          <svg id="legend" width={360} height={100}></svg>
        </div>
      ) : (
        <></>
      )}

      {tooltip.visible && tooltip.clicked && (
        <div
          className="fixed bg-white border border-gray-300 rounded-lg shadow-lg p-3 pointer-events-auto text-left min-w-[200px] z-50"
          style={{
            left: tooltip.coordinates.x + 10,
            top: tooltip.coordinates.y - 10,
          }}
        >
          <div className="font-semibold text-sm text-gray-800">
            {tooltip.province}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {label} <span className="text-default-blue">({tooltip.value})</span>
          </div>
          {onProvinceClick && (
            <button
              className="text-blue-600 text-xs mt-2 hover:underline cursor-pointer block"
              onClick={(e) => {
                e.stopPropagation();
                onProvinceClick(tooltip.province);
                setTooltip((prev) => ({
                  ...prev,
                  visible: false,
                  clicked: false,
                }));
              }}
            >
              Xem chi tiết &gt;&gt;
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default MapChart;
