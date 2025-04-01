
import React from 'react';
import { Line, Bar, Pie } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartData } from '@/types';

interface ChartContainerProps {
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: ChartData;
  className?: string;
}

const CustomizedLabel = ({ x, y, value }: any) => (
  <text x={x} y={y} dy={-4} fontSize={12} textAnchor="middle">
    {value}
  </text>
);

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  type,
  data,
  className = '',
}) => {
  // Format data for recharts
  const formattedData = data.labels.map((label, index) => ({
    name: label,
    value: data.datasets[0].data[index],
    color: data.datasets[0].backgroundColor[index],
  }));

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <div className="h-[300px] w-full flex items-center justify-center">
            <Pie
              data={formattedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </div>
        );
      case 'bar':
        return (
          <div className="h-[300px] w-full">
            <Bar
              data={formattedData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" label={<CustomizedLabel />}>
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </Bar>
          </div>
        );
      case 'line':
        return (
          <div className="h-[300px] w-full">
            <Line data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </Line>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{renderChart()}</CardContent>
    </Card>
  );
};

export default ChartContainer;
