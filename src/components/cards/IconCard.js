import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Icon from "../Icon";

export default function IconCard({ color, icon, title, description}) {
  return (
    <Card sx={{ maxWidth: 345, boxShadow: 3, textAlign: 'center' }}>
      <Icon icon={icon} classNameIcon={`${color} rounded-full lg mt-3`} />
      <CardContent>
        <Typography gutterBottom variant="h6">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
