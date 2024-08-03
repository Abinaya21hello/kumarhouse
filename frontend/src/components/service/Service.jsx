import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import TrustedIcon from '@mui/icons-material/Verified';
import PriceIcon from '@mui/icons-material/AttachMoney';
import DistributionIcon from '@mui/icons-material/LocalShipping';
import SupportIcon from '@mui/icons-material/SupportAgent';
import './service.css';

export default function Service() {
  return (
    <div>
      <div className="container-fluid feature py-4 container-fluid-feature">
        <div className="container py-5">
          <div className="section-title mb-3 wow fadeInUp" data-wow-delay="0.1s">
            <div className="sub-style">
              {/* <h4 className="sub-title px-3 mb-0">Why Choose Us</h4> */}
            </div>
            <h1 className="display-3 mb-4" style={{textAlign:'center'}}>Why Choose Us?</h1>
            {/* <p className="mb-0">Nourish Your Body, Mind & Spirit: <b>Kumar Herbals</b></p> */}
          </div>

          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <Card style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: '#FFF9BB', color: 'black' }}>
                      <CardContent className="flip-card-content">
                        <TrustedIcon fontSize="large" style={{ marginBottom: '10px' }} />
                        <Typography variant="h5" component="div" style={{fontWeight:'500',fontSize:'30px'}}>
                          Trusted and Reliable Vendor Base
                        </Typography>
                        <Typography variant="body2">
                          Wide range of high-quality products with various varieties.
                        </Typography>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flip-card-back">
                    <Card style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: '#3BB77E', color: 'white' }}>
                      <CardContent className="flip-card-content">
                        <TrustedIcon fontSize="large" style={{ marginBottom: '10px' }} />
                        <Typography variant="h5" component="div" style={{fontWeight:'500',fontSize:'40px'}}>
                          Benefits
                        </Typography>
                        <Typography variant="body2" style={{color:'white'}}>
                          Our products are made from the finest ingredients to support your health.
                        </Typography>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <Card style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: '#FFF9BB', color: 'black' }}>
                      <CardContent className="flip-card-content">
                        <PriceIcon fontSize="large" style={{ marginBottom: '10px' }} />
                        <Typography variant="h5" component="div" style={{fontWeight:'500',fontSize:'30px'}}>
                          Competitive Prices
                        </Typography>
                        <Typography variant="body2" >
                          Excellent warehousing facilities with sophisticated infrastructure.
                        </Typography>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flip-card-back">
                    <Card style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: '#3BB77E', color: 'white' }}>
                      <CardContent className="flip-card-content">
                        <PriceIcon fontSize="large" style={{ marginBottom: '10px' }} />
                        <Typography variant="h5" component="div" style={{fontWeight:'500',fontSize:'40px'}}>
                          Savings
                        </Typography>
                        <Typography variant="body2" style={{color:'white'}}>
                          Enjoy great savings on high-quality herbal products.
                        </Typography>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <Card style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: '#FFF9BB', color: 'black' }}>
                      <CardContent className="flip-card-content">
                        <DistributionIcon fontSize="large" style={{ marginBottom: '10px' }} />
                        <Typography variant="h5" component="div" style={{fontWeight:'500',fontSize:'30px'}}>
                          Wide Distribution Network
                        </Typography>
                        <Typography variant="body2">
                          Easy payment modes: Cash, Cheque, Credit card, DD, Escrow, Invoice, LC, Online payment, Pay order, Wire transfer.
                        </Typography>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flip-card-back">
                    <Card style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: '#3BB77E', color: 'white' }}>
                      <CardContent className="flip-card-content">
                        <SupportIcon fontSize="large" style={{ marginBottom: '10px' }} />
                        <Typography variant="h5" component="div" style={{fontWeight:'500',fontSize:'40px'}}>
                          Support
                        </Typography>
                        <Typography variant="body2" style={{color:'white'}}>
                          Our customer support team is here to help you with any questions.
                        </Typography>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}
