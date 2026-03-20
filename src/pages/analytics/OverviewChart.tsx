import { Box, Tab, Tabs, Typography } from "@mui/material";
import { forwardRef, useEffect, useState, type SyntheticEvent } from "react";
import AnalyticsTabHead from "./AnalyticsTabHead";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TabPanel from "../../components/TabPanel";
import { Line } from "react-chartjs-2";
import { getMainChartData, mainChartOptions } from "./ChartConfig";
import { getEventsCount } from "../../services/EventService";
import BarChart from "./BarChart";
import BarChart2 from "./BarChart2";
import BarChart3 from "./BarChart3";
import BarChart4 from "./BarChart4";
import BarChart5 from "./BarChart5";

function OverviewChart() {
  // état pour gérer l'onglet actif
  const [value, setValue] = useState(0);
  // gère le changement d'onglet
  const handleChange = (_e: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [eventsCount, setEventsCount] = useState<number>(0);

  const EventsTabHead = forwardRef((props, ref) => <AnalyticsTabHead {...props} 
  title="Events"
  icon={<CheckCircleIcon color='success' />}
  value={eventsCount.toString()}
  subtitle={'Total events count'}
/>);

const UsersTabHead = forwardRef<HTMLDivElement>((props, ref) => <AnalyticsTabHead {...props} 
  title="Users"
  icon={<CheckCircleIcon color='success' />}
  value='21.4K'
  subtitle={'700 less than usual'}
/>);

const AssociationsTabHead = forwardRef((props, ref) => <AnalyticsTabHead {...props} 
  title="Associations"
  icon={<CheckCircleIcon color='success' />}
  value='21.4K'
  subtitle={'700 less than usual'}
/>);

const StudentsTabHead = forwardRef<HTMLDivElement>((props, ref) => <AnalyticsTabHead {...props} 
  title="Students"
  icon={<CheckCircleIcon color='success' />}
  value='21.4K'
  subtitle={'700 less than usual'}
/>);

  useEffect(() => {
    const fetchEventsCount = async () => {
      try {
        const count = await getEventsCount();
        setEventsCount(count);
      } catch (error) {
        console.error("Failed to fetch events count:", error);
      }
    };

    fetchEventsCount();
  }, []);


  const [chartData, setChartData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: 'Events',
        data: new Array(12).fill(0),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await getMainChartData();
        setChartData(data);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, []);

  return (
    <Box sx={styles.chartContainer}>
      <Tabs value={value} onChange={handleChange} aria-label="analytics tabs">
        <Tab component={EventsTabHead} id="tab-0" aria-controls="tabpanel-0" />
        <Tab component={UsersTabHead} id="tab-1" aria-controls="tabpanel-1" />
        <Tab component={AssociationsTabHead} id="tab-2" aria-controls="tabpanel-2" />
        <Tab component={StudentsTabHead} id="tab-3" aria-controls="tabpanel-3" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Box sx={styles.mainChart}>
          <Line options={mainChartOptions as any} data={chartData} />
        </Box>
        <Box>
          <BarChart2 />
        </Box>
        <Box>
          <BarChart3 />
        </Box>
        <Box>
          <BarChart4 />
        </Box>
        <Box>
          <BarChart5 />
        </Box>
        <Box>
          <BarChart />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography>Users content goes here</Typography>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography>Associations content goes here</Typography>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Typography>Students content goes here</Typography>
      </TabPanel>
    </Box>
  );
}

export default OverviewChart;


/** @type {import("@mui/material").SxProps} */
const styles = {
  chartContainer: {
    mt: 4,
    width: '100%'
  },
  mainChart: {
    height: 350,
    border: 1,
    borderColor: '#ddd',
    borderTop: 'none',
    borderRadius: 1
  },
}