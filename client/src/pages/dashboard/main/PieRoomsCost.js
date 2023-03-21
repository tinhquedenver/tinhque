import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useValue } from "../../../context/ContextProvider";
import { currencyFormat } from "../utils/Currency";

const COLORS = ["#FF8042", "#00C49F"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
export default function PieRoomsCost() {
  const {
    state: { rooms, funds, },
  } = useValue(); 
  const [costGroups, setCostGroups] = useState([]);
  const [balance, setBalance] = useState(0);
  
  useEffect(() => {
    let expense = 0,
      fund = 0;
    expense = rooms.reduce((a, v) => (a = a + v.price), 0);
    fund = funds.reduce((a, v) => (a = a + v.amount), 0);

    setBalance(fund - expense);
    setCostGroups([
      { name: `Expenses: ${currencyFormat(expense)}`, qty: expense },
      { name: `Funds: ${currencyFormat(fund)}`, qty: fund },
    ]);
  }, [rooms, funds]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        flexWrap: "wrap",
      }}
    >
      <PieChart width={200} height={200}>
        <Pie
          data={costGroups}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="qty"
        >
          {costGroups.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <Stack gap={2}>
        <Typography variant="h4">Total Report</Typography>
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {COLORS.map((color, i) => (
            <Stack key={color} alignItems="center" spacing={1}>
              <Box sx={{ width: 20, height: 20, background: color }} />
              <Typography variant="body" >
                {costGroups[i]?.name}
              </Typography>
            </Stack>
          ))}
          <Stack alignItems="center" spacing={1}>
            <Box sx={{ width: 20, height: 20, background: "#FC7789" }} />
            <Typography variant="body" >
              Balance: {currencyFormat(balance)}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
