import { Box, Typography, Grid } from '@mui/material';
import Icon from "@mui/material/Icon";
import backgroundImage from '../assets/next-event.png';
import { useEffect, useState } from 'react';
import { getEventsCount } from '../services/EventService';
import { getSchoolsCount } from '../services/SchoolService';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));


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
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="center">
        {/* EVENTS */}
        <Item sx={{ width: { xs: '100%', sm: '50%', md: '30%'}, p: 1 }}>
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
        </Item>

        {/* USERS */}
        <Item sx={{ width: { xs: '100%', sm: '50%', md: '30%' }, p: 1 }}>
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
        </Item>

        {/* SCHOOLS */}
        <Item sx={{ width: { xs: '100%', sm: '50%', md: '30%' }, p: 1 }}>
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
        </Item>

        {/* ASSOCIATIONS */}
        <Item sx={{ width: { xs: '100%', sm: '50%', md: '30%' }, p: 1 }}>
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
        </Item>

        {/* ETUDIANTS */}
        <Item sx={{ width: { xs: '100%', sm: '50%', md: '30%' }, p: 1 }}>
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
        </Item>
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