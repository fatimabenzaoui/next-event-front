import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, BarElement } from 'chart.js';
import { getEventsByMonth } from '../../services/EventService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, BarElement);

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
      }, 
      color: 'rgb(117, 29, 136)'
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
        borderColor: 'rgb(156, 39, 176)',
        fill: true,
        borderWidth: 1.5
      }
    }
  }
}

export const getMainChartData = async () => {
  const data = await getEventsByMonth();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const counts = new Array(12).fill(0);

  // Vérifier que data est bien un tableau
  if (Array.isArray(data)) {
    data.forEach(item => {
      const monthIndex = months.indexOf(item.month);
      if (monthIndex !== -1) {
        counts[monthIndex] = item.count;
      }
    });
  }

  return {
    labels: months,
    datasets: [
      {
        label: 'Events',
        data: counts,
        fill: false,
        backgroundColor: 'rgb(156, 39, 176)',
        borderColor: 'rgba(156, 39, 176, 0.2)',
      },
    ],
  };
};