import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

import img1 from '../../assets/img/img1.webp';
import img2 from '../../assets/img/img2.webp';
import img3 from '../../assets/img/img3.webp';
import img4 from '../../assets/img/img4.webp';
import img5 from '../../assets/img/img5.webp';
import img6 from '../../assets/img/img6.webp';
import img7 from '../../assets/img/img7.webp';
import img8 from '../../assets/img/img8.webp';
import img9 from '../../assets/img/img9.webp';

const imgMap = {
  'img1.webp': img1,
  'img2.webp': img2,
  'img3.webp': img3,
  'img4.webp': img4,
  'img5.webp': img5,
  'img6.webp': img6,
  'img7.webp': img7,
  'img8.webp': img8,
  'img9.webp': img9,
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
