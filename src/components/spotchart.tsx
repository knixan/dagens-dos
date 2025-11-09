"use client";

import { Se1, Se2, Se3, Se4 } from "@/types/el-price";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SpotChart({
  data,
  title,
}: {
  data: Se1[] | Se2[] | Se3[] | Se4[];
  title: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg text-primary font-semibold text-center mb-4">
        {title}
      </h3>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price_sek"
              stroke="#004d99"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
