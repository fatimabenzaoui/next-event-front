import { Box, Typography, Grid } from '@mui/material';
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import backgroundImage from '../assets/next-event.png';
import { useEffect, useState } from 'react';
import { getEventsCount } from '../services/EventService';
import { getSchoolsCount } from '../services/SchoolService';

function Dashboard() {
  const [eventsCount, setEventsCount] = useState<number>(0);
  const [schoolsCount, setSchoolsCount] = useState<number>(0);

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

  useEffect(() => {
    const fetchSchoolsCount = async () => {
      try {
        const count = await getSchoolsCount();
        setSchoolsCount(count);
      } catch (error) {
        console.error("Failed to fetch schools count:", error);
      }
    };
    fetchSchoolsCount();
  }, []);

  return (
    <Box sx={dashboardContainer}>
      <Grid container spacing={2} justifyContent="space-between"
    sx={{ width: "100%" }}>
        {/* EVENTS */}
        <Grid item xs={12} sm={6} md={4} lg={2.4} sx={{ flexGrow: 1, display: "flex" }}>
          <Card sx={cardStyle}>
            <Box pt={3} px={3}>
              <Typography variant="h6" fontWeight="medium">
                Events overview
              </Typography>
              <Box mt={0} mb={2}>
                <Typography variant="button" color="text" fontWeight="regular">
                  <Box display="inline" sx={{ verticalAlign: "middle" }}>
                    <Icon>arrow_upward</Icon>
                  </Box>
                  &nbsp;
                  <Typography variant="button" color="text" fontWeight="medium">
                    TOTAL : {eventsCount.toString()}
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* USERS */}
        <Grid item xs={12} sm={6} md={4} lg={2.4} sx={{ flexGrow: 1, display: "flex" }}>
          <Card sx={cardStyle}>
            <Box pt={3} px={3}>
              <Typography variant="h6" fontWeight="medium">
                Users overview
              </Typography>
              <Box mt={0} mb={2}>
                <Typography variant="button" color="text" fontWeight="regular">
                  <Box display="inline" sx={{ verticalAlign: "middle" }}>
                    <Icon>arrow_upward</Icon>
                  </Box>
                  &nbsp;
                  <Typography variant="button" color="text" fontWeight="medium">
                    24%
                  </Typography>{" "}
                  this month
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* SCHOOLS */}
        <Grid item xs={12} sm={6} md={4} lg={2.4} sx={{ flexGrow: 1, display: "flex" }}>
          <Card sx={cardStyle}>
            <Box pt={3} px={3}>
              <Typography variant="h6" fontWeight="medium">
                Schools overview
              </Typography>
              <Box mt={0} mb={2}>
                <Typography variant="button" color="text" fontWeight="regular">
                  <Box display="inline" sx={{ verticalAlign: "middle" }}>
                    <Icon>arrow_upward</Icon>
                  </Box>
                  &nbsp;
                  <Typography variant="button" color="text" fontWeight="medium">
                    TOTAL : {schoolsCount.toString()}
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* ASSOCIATIONS */}
        <Grid item xs={12} sm={6} md={4} lg={2.4} sx={{ flexGrow: 1, display: "flex" }}>
          <Card sx={cardStyle}>
            <Box pt={3} px={3}>
              <Typography variant="h6" fontWeight="medium">
                Associations overview
              </Typography>
              <Box mt={0} mb={2}>
                <Typography variant="button" color="text" fontWeight="regular">
                  <Box display="inline" sx={{ verticalAlign: "middle" }}>
                    <Icon>arrow_upward</Icon>
                  </Box>
                  &nbsp;
                  <Typography variant="button" color="text" fontWeight="medium">
                    24%
                  </Typography>{" "}
                  this month
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* ETUDIANTS */}
        <Grid item xs={12} sm={6} md={4} lg={2.4} sx={{ flexGrow: 1, display: "flex" }}>
          <Card sx={cardStyle}>
            <Box pt={3} px={3}>
              <Typography variant="h6" fontWeight="medium">
                Students overview
              </Typography>
              <Box mt={0} mb={2}>
                <Typography variant="button" color="text" fontWeight="regular">
                  <Box display="inline" sx={{ verticalAlign: "middle" }}>
                    <Icon>arrow_upward</Icon>
                  </Box>
                  &nbsp;
                  <Typography variant="button" color="text" fontWeight="medium">
                    24%
                  </Typography>{" "}
                  this month
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;

/** @type {import("@mui/material").SxProps} */
const dashboardContainer = {
  width: "100%",
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '100vh',
  padding: 2,
};

const cardStyle = {
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  minWidth: 0, // Permet de forcer le respect de la largeur du parent
};
