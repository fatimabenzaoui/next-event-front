import { Box, Typography } from "@mui/material";
import { forwardRef } from "react";

interface AnalyticsTabHeadProps {
  title: string;
  value: string;
  subtitle: string;
  icon?: React.ReactNode;
}

const AnalyticsTabHead = forwardRef<HTMLDivElement, AnalyticsTabHeadProps>(
  ({ title, value, subtitle, icon }, ref) => (
    <Box ref={ref} style={{ textAlign: 'center', padding: '12px 0' }}>
      <Typography variant="body2">{title}</Typography>
      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
        <Typography variant="h6">{value}</Typography>
        {icon}
      </Box>
      <Typography variant="caption" color="textSecondary">{subtitle}</Typography>
    </Box>
  )
);

export default AnalyticsTabHead;