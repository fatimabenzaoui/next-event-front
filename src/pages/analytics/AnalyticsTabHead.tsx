import { Box, Button, Typography } from "@mui/material";

function AnalyticsTabHead({title, value, icon, subtitle, children, onClick}: {title: string; value: string | number; icon?: React.ReactNode; subtitle?: string; children?: React.ReactNode; onClick?: () => void}) {
  return ( 
    <Button onClick={onClick} sx={styles.container}>
      <Typography sx={styles.tabTitle}>{title}</Typography>
      <Box sx={styles.tabValueRow}>
        <Typography sx={styles.tabValue}>{value}</Typography>
        {icon}
      </Box>
      <Typography sx={styles.tabSubTitle}>{subtitle}</Typography>
      {children}
    </Button>
   );
}

/** @type {import("@mui/material").SxProps} */
const styles = {
  container: {
    display: 'flex',
    alignSelf: 'center',
    flexDirection: 'column',
    color: '#555',
    textTransforme: 'capitalize',
    py: 2,
    border: 1,
    borderColor: '#ddd',
    flexGrow: 1,
  },
  tabTitle: {
    fontSize: '0.8rem',
    fontWeight: 500,
  },
  tabValueRow: {
    display: 'flex',
    alignItems: 'center'
  },
  tabValue: {
    fontSize: {xs: '1rem', md: '1.5rem'},
    color: '#333',
    mr: 1
  },
  tabSubTitle: {
    fontSize: '0.6rem',
    fontStyle: 'italic',
    textTransform: 'lowercase',
    display: {xs: 'none', md: 'inline'}, 
    mr: 1
  },
}
export default AnalyticsTabHead;