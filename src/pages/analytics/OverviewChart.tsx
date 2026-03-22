import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState, useCallback, type SyntheticEvent } from "react";
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

// Données statiques pour les onglets
const tabs = [
  { id: "tab-0", label: "Events", value: "0", subtitle: "Total events count" },
  { id: "tab-1", label: "Users", value: "21.4K", subtitle: "700 less than usual" },
  { id: "tab-2", label: "Associations", value: "21.4K", subtitle: "700 less than usual" },
  { id: "tab-3", label: "Students", value: "21.4K", subtitle: "700 less than usual" },
];

const styles = {
  chartContainer: {
    mt: 4,
    width: '100%'
  },
  mainChart: {
    height: 350,
    border: 1,
    borderColor: '#ddd',
    borderRadius: 1,
    width: "100%",
    marginTop: '35px'
  },
  tabs: {
    width: '100%',
    '.MuiTabs-flexContainer': {
      display: 'flex',
      justifyContent: 'space-between',
    },
    '& .MuiTabs-indicator': {
      backgroundColor: 'rgb(156, 39, 176)',
      height: 3,
    },
    '& .Mui-selected': {
      color: 'rgb(156, 39, 176) !important',
    },
  },
  tab: {
    width: '100%',
  },
}

export default function OverviewChart() {
  // États
  const [value, setValue] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [chartData, setChartData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{ label: 'Events', data: new Array(12).fill(0), fill: false, backgroundColor: 'rgb(156, 39, 176)', borderColor: 'rgba(156, 39, 176, 0.2)' }],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Gestion du changement d'onglet
  const handleChange = useCallback((_e: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  }, []);

  // Récupération des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [count, data] = await Promise.all([
          getEventsCount(),
          getMainChartData(),
        ]);
        setEventsCount(count);
        setChartData(data);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mise à jour dynamique du value pour l'onglet Events
  const updatedTabs = tabs.map(tab =>
    tab.id === "tab-0" ? { ...tab, value: eventsCount.toString() } : tab
  );

  return (
    <Box sx={styles.chartContainer}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="analytics tabs"
        sx={styles.tabs}
      >
        {updatedTabs.map((tab) => (
          <Tab
            key={tab.id}
            sx={styles.tab}
            disableRipple
            label={
              <AnalyticsTabHead
                title={tab.label}
                value={tab.value}
                subtitle={tab.subtitle}
                icon={<CheckCircleIcon color="success" />}
              />
            }
            id={tab.id}
            aria-controls={`tabpanel-${tab.id.split('-')[1]}`}
          />
        ))}
      </Tabs>

      {/* Contenu des onglets */}
      <TabPanel value={value} index={0}>
        <Box sx={styles.mainChart}>
          {isLoading ? <Typography>Chargement...</Typography> : <Line options={mainChartOptions} data={chartData} />}
        </Box>
        <Box><BarChart2 /></Box>
        <Box><BarChart3 /></Box>
        <Box><BarChart4 /></Box>
        <Box><BarChart5 /></Box>
        <Box><BarChart /></Box>
      </TabPanel>
      <TabPanel value={value} index={1}><Typography>Users content goes here</Typography></TabPanel>
      <TabPanel value={value} index={2}><Typography>Associations content goes here</Typography></TabPanel>
      <TabPanel value={value} index={3}><Typography>Students content goes here</Typography></TabPanel>
    </Box>
  );
}

