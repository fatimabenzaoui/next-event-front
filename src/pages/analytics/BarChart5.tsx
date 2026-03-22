import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, Box, CircularProgress, Alert } from '@mui/material';
import { getEventsByAssociation } from '../../services/EventService';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Interface pour les données du graphique
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

const BarChart5 = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEventsByAssociation();

        if (!Array.isArray(data)) {
          throw new TypeError("Les données reçues ne sont pas un tableau.");
        }

        const labels = data.map((item) => item.name);
        const counts = data.map((item) => item.event_count);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Number of Events',
              data: counts,
              backgroundColor: [
                '#9C27B0', '#f28e2b', '#e15759', '#76b7b2',
                '#59a14f', '#edc948', '#b07aa1', '#ff9da7',
                '#9c755f', '#bab0ac'
              ],
              borderColor: [
                '#2c3e50', '#d35400', '#c0392b', '#16a085',
                '#27ae60', '#f39c12', '#8e44ad', '#e74c3c',
                '#6b4c3a', '#7f8c8d'
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError("Impossible de charger les données. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!chartData) {
    return <Box sx={{ p: 3 }}>Aucune donnée disponible.</Box>;
  }

  return (
    <Box sx={{ mt:5, mb:5 }}>
      <Card>
        <CardContent>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Number of Events per Association', font: { size: 28 }, color: 'rgb(117, 29, 136)' },
              },
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default BarChart5;
