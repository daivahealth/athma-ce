'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { QueryResult, ResultColumn } from '@/modules/reporting/types';

export type ChartType = 'bar' | 'line' | 'pie' | 'area';

interface ReportChartProps {
  result: QueryResult | null;
  chartType: ChartType;
  className?: string;
}

// Color palette for charts
const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2, 173 58% 39%))',
  'hsl(var(--chart-3, 197 37% 24%))',
  'hsl(var(--chart-4, 43 74% 66%))',
  'hsl(var(--chart-5, 27 87% 67%))',
  'hsl(221 83% 53%)',
  'hsl(142 76% 36%)',
  'hsl(262 83% 58%)',
  'hsl(0 84% 60%)',
  'hsl(45 93% 47%)',
];

/**
 * Determines if a query result is suitable for chart visualization
 */
export function isChartable(result: QueryResult | null): boolean {
  if (!result || result.rows.length === 0) return false;
  if (result.rows.length > 50) return false; // Too many data points

  const numericCols = result.columns.filter(
    (c) => c.dataType === 'decimal' || c.dataType === 'integer' || c.dataType === 'number'
  );
  const dimensionCols = result.columns.filter(
    (c) => c.dataType === 'string' || c.dataType === 'date' || c.dataType === 'datetime'
  );

  // Need at least one numeric column and one dimension column
  return numericCols.length >= 1 && dimensionCols.length >= 1;
}

/**
 * Suggests the best chart type based on data characteristics
 */
export function suggestChartType(result: QueryResult | null): ChartType {
  if (!result || result.rows.length === 0) return 'bar';

  const hasDateDimension = result.columns.some(
    (c) => c.dataType === 'date' || c.dataType === 'datetime'
  );

  const numericCols = result.columns.filter(
    (c) => c.dataType === 'decimal' || c.dataType === 'integer' || c.dataType === 'number'
  );

  // Date dimension suggests time series - use line chart
  if (hasDateDimension) return 'line';

  // Few rows with single metric - pie chart works well
  if (result.rows.length <= 8 && numericCols.length === 1) return 'pie';

  // Default to bar chart
  return 'bar';
}

/**
 * Get dimension and metric columns from result
 */
function getChartColumns(result: QueryResult): {
  dimensionCol: ResultColumn | null;
  metricCols: ResultColumn[];
} {
  const dimensionCol = result.columns.find(
    (c) => c.dataType === 'string' || c.dataType === 'date' || c.dataType === 'datetime'
  ) || null;

  const metricCols = result.columns.filter(
    (c) => c.dataType === 'decimal' || c.dataType === 'integer' || c.dataType === 'number'
  );

  return { dimensionCol, metricCols };
}

/**
 * Format value for tooltip display
 */
function formatValue(value: unknown, column: ResultColumn): string {
  if (value === null || value === undefined) return '-';

  const numValue = typeof value === 'number' ? value : parseFloat(String(value));

  switch (column.format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(numValue);
    case 'percentage':
      return `${numValue.toFixed(1)}%`;
    case 'number':
      return numValue.toLocaleString();
    default:
      if (!isNaN(numValue)) {
        return numValue.toLocaleString();
      }
      return String(value);
  }
}

/**
 * Tooltip payload entry from Recharts
 */
interface TooltipPayloadEntry {
  dataKey: string;
  value: unknown;
  color: string;
  name?: string;
}

/**
 * Custom tooltip component for charts
 */
function CustomTooltip({
  active,
  payload,
  label,
  columns,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
  columns: ResultColumn[];
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium mb-2">{label}</p>
      {payload.map((entry, index) => {
        const column = columns.find((c) => c.name === entry.dataKey);
        return (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">
              {column?.displayName || entry.dataKey}:
            </span>
            <span className="font-medium">
              {column ? formatValue(entry.value, column) : entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ReportChart({ result, chartType, className = '' }: ReportChartProps) {
  const { dimensionCol, metricCols } = useMemo(() => {
    if (!result) return { dimensionCol: null, metricCols: [] };
    return getChartColumns(result);
  }, [result]);

  if (!result || result.rows.length === 0 || !dimensionCol || metricCols.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 text-muted-foreground ${className}`}>
        No data available for chart visualization
      </div>
    );
  }

  const chartData = result.rows;
  const dimensionKey = dimensionCol.name;

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        // Pie chart only uses the first metric
        const pieMetric = metricCols[0];
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey={pieMetric.name}
                nameKey={dimensionKey}
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, percent }) =>
                  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                labelLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={
                  <CustomTooltip columns={result.columns} />
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey={dimensionKey}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                content={
                  <CustomTooltip columns={result.columns} />
                }
              />
              <Legend />
              {metricCols.map((metric, index) => (
                <Line
                  key={metric.name}
                  type="monotone"
                  dataKey={metric.name}
                  name={metric.displayName}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey={dimensionKey}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                content={
                  <CustomTooltip columns={result.columns} />
                }
              />
              <Legend />
              {metricCols.map((metric, index) => (
                <Area
                  key={metric.name}
                  type="monotone"
                  dataKey={metric.name}
                  name={metric.displayName}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey={dimensionKey}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                content={
                  <CustomTooltip columns={result.columns} />
                }
              />
              <Legend />
              {metricCols.map((metric, index) => (
                <Bar
                  key={metric.name}
                  dataKey={metric.name}
                  name={metric.displayName}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return <div className={className}>{renderChart()}</div>;
}
