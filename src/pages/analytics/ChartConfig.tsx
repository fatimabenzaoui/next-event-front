import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
} from 'chart.js';
import { getEventsByMonth } from '../../services/EventService';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
);

export const mainChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Number of Events per Month',
      font: {
        size: 28
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        position: 'right',
        ticks: {
          maxTicksLimit: 6
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 3,
          align: 'inner'
        }
      }
    },
    point: false,
    elements: {
      point: {
        pointStyle: false,
      },
      line: {
        borderColor: 'rgb(95, 158, 199)',
        fill: true,
        borderWidth: 1.5
      }
    }
  }
}

export const getMainChartData = async () => {
  const data = await getEventsByMonth();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const counts = new Array(12).fill(0); // Initialise à 0 pour tous les mois

  data.forEach(item => {
    const monthIndex = months.indexOf(item.month);
    if (monthIndex !== -1) {
      counts[monthIndex] = item.count;
    }
  });

  return {
    labels: months, // Toujours défini
    datasets: [
      {
        label: 'Events',
        data: counts, // Toujours défini
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };
};