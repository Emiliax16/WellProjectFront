import React from 'react';
import { Container, Typography, Box, Card, CardMedia, CardContent } from '@mui/material';
import LandingPageNavbar from "../components/landingPageNavbar";
import landingPageText from "../texts/landingPageText.json";
import Footer from "../components/Footer";
import WhatsAppFab from "../utils/landingPageData/WhatsAppFab";
import Telemetria1 from "../assets/img/telemetria1.webp";
import Telemetria2 from "../assets/img/telemetria2.webp";

function Telemetria() {
  return (
    <div>
      <LandingPageNavbar from={landingPageText.navbar.secundaryPage} />
      <div className="py-8">
        <Container>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            {landingPageText.telemetria.title}
          </Typography>
          
          <Box mb={4}>
            <Card>
              <CardMedia
                component="img"
                alt={landingPageText.telemetria.superficialTitle}
                image={Telemetria2}
                title={landingPageText.telemetria.superficialTitle}
              />
              <CardContent>
                <Typography variant="h5" component="h2">
                  {landingPageText.telemetria.superficialTitle}
                </Typography>
                <Typography variant="body1" component="p">
                  {landingPageText.telemetria.superficialDescription}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box mb={4}>
            <Card>
              <CardMedia
                component="img"
                alt={landingPageText.telemetria.deepTitle}
                image={Telemetria1}
                title={landingPageText.telemetria.deepTitle}
              />
              <CardContent>
                <Typography variant="h5" component="h2">
                  {landingPageText.telemetria.deepTitle}
                </Typography>
                <Typography variant="body1" component="p">
                  {landingPageText.telemetria.deepDescription}
                </Typography>
              </CardContent>
            </Card>
          </Box>

        </Container>
      </div>
      <div className="bg-white">
        <Footer />
      </div>
      <WhatsAppFab />
    </div>
  );
}

export default Telemetria;
