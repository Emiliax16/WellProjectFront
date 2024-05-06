import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

import tech1 from "../../assets/img/tech1.jpg"
import tech2 from "../../assets/img/tech2.jpg"
import tech3 from "../../assets/img/tech3.jpg"
import tech4 from "../../assets/img/tech4.jpg"
import temporalImg from '../../assets/img/teamwork.png';

const imgMap = {
  'tech1.jpg': tech1,
  'tech2.jpg': tech2,
  'tech3.jpg': tech3,
  'tech4.jpg': tech4,
  'teamwork.png': temporalImg,
}

export default function ActionAreaCard({ title, description, path }) {
  const imgAvatar = imgMap[path]

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={imgAvatar}
          alt={title}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
