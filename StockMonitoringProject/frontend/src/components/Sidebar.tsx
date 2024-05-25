import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 200,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 200,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },
      }}
    >
      <List>
        <ListItem
          button
          component={Link}
          to="/dashboard"
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.primary.light,
            },
          }}
        >
          <ListItemIcon>
            <HomeIcon htmlColor={theme.palette.primary.contrastText} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem
          button
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.primary.light,
            },
          }}
        >
          <ListItemIcon>
            <SettingsIcon htmlColor={theme.palette.primary.contrastText} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;