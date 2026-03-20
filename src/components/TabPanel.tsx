import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface TabPanelProps {
  children: ReactNode;
  value: number;
  index: number;
  mt?: number | string;
}

function TabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, mt = 2 } = props;
  return ( 
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
    >
      {value === index && (
        <Box sx={{ mt }}>{children}</Box>
      )}
    </div>
   );
}

export default TabPanel;