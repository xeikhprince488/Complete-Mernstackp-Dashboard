import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, useTheme, Typography } from "@mui/material";
import { useGetSalesQuery } from "../state/api";

function BreakdownChart({ isDashboard = false }) {
  const { data, isLoading } = useGetSalesQuery();
  const theme = useTheme();

  if (!data || isLoading) return "Loading...";

  const colors = [
    theme.palette.secondary[500],
    theme.palette.secondary[300],
    theme.palette.secondary[300],
    theme.palette.secondary[500],
  ];

  const formattedData = Object.entries(data.salesByCategory).map(
    ([category, sales], i) => ({
      id: category,
      label: category,
      value: sales,
      color: colors[i % colors.length], // Ensure there is no index out of range issue
    })
  );

  return (
    <Box
      height={isDashboard ? "600px" : "100%"}
      width="100%"
      maxWidth={isDashboard ? "900px" : "100%"}
      mx="auto"
      minHeight={isDashboard ? "500px" : undefined}
      position="relative"
      overflow="hidden"
    >
      <ResponsivePie
        data={formattedData}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: theme.palette.secondary[200],
              },
            },
          },
          legends: {
            text: {
              fill: theme.palette.secondary[200],
              fontSize: 16,
            },
          },
          tooltip: {
            container: {
              color: theme.palette.primary.main,
              fontSize: 16,
            },
          },
        }}
        colors={formattedData.map(d => d.color)} // Set colors array directly
        margin={
          isDashboard
            ? { top: 40, right: 40, bottom: 80, left: 40 }
            : { top: 40, right: 80, bottom: 80, left: 80 }
        }
        sortByValue={true}
        innerRadius={0.45}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        enableArcLinkLabels={!isDashboard}
        arcLinkLabelsTextColor={theme.palette.secondary[200]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 35,
            translateY: isDashboard ? 50 : 56,
            itemsSpacing: 0,
            itemWidth: 120,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: theme.palette.primary[500],
                },
              },
            ],
          },
        ]}
        // Responsive legend styling
        responsiveLegends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 35,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 300, // Adjust itemWidth to fit more items in the row
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "top-bottom",
            itemOpacity: 1,
            symbolSize: 16, // Adjust symbolSize for better fit
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: theme.palette.primary[500],
                },
              },
            ],
          },
        ]}
      />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        color={theme.palette.secondary[400]}
        textAlign="center"
        pointerEvents="none"
        sx={{
          transform: isDashboard
            ? "translate(-50%, -170%)"
            : "translate(-50%, -100%)",
        }}
      >
        <Typography variant="h4">
          {!isDashboard && "Total:"} ${data.yearlySalesTotal}
        </Typography>
      </Box>
    </Box>
  );
}

export default BreakdownChart;
