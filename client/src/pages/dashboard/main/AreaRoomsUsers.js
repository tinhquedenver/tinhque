import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useValue } from '../../../context/ContextProvider';

const months = 6;
const today = new Date();
const tempData = [];
for (let i = 0; i < months; i++) {
  const date = new Date(
    today.getFullYear(),
    today.getMonth() - (months - (i + 1))
  );
  tempData.push({
    date,
    name: moment(date).format('MMM YYYY'),
    funds: 0,
    expenses: 0,
  });
}

export default function AreaRoomsUsers() {
  const {
    state: { rooms, funds },
  } = useValue(); 
  const [data, setData] = useState([]);

  useEffect(() => {
    for (let i = 0; i < months; i++) {
      tempData[i].expenses = 0;
    }
    rooms.forEach((room) => {
      for (let i = 0; i < months; i++) {
        if (moment(tempData[i].date).isSame(room?.createdAt, 'month'))
          return tempData[i].expenses++;
      }
    });
    setData([...tempData]);
  }, [rooms]);


  useEffect(() => {
    for (let i = 0; i < months; i++) {
      tempData[i].funds = 0;
    }
    funds.forEach((fund) => {
      for (let i = 0; i < months; i++) {
        if (moment(tempData[i].date).isSame(fund?.createdAt, 'month'))
          return tempData[i].funds++;
      }
    });
    setData([...tempData]);
  }, [funds]);
  return (
    <div style={{ width: '100%', height: 300, minWidth: 250 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="expenses"
            stackId="1"
            stroke="#FF8042"
            fill="#FF8042"
          />
          <Area
            type="monotone"
            dataKey="funds"
            stackId="1"
            stroke="#00C49F"
            fill="#00C49F"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
