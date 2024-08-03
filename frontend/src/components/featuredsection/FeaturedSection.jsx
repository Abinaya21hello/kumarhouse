// FeatureSection.jsx

import React from 'react';
import { Typography, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import image from '../../assets/images/footer/bgbanner.png'
const useStyles = makeStyles((theme) => ({
    featureBg: {
        // backgroundColor: '#f8f9fa',
        padding: theme.spacing(5, 0),
    },
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
    },
    featuredText: {
        textAlign: 'left',
    },
    orangeText: {
        color: '#f68b1f',
    },
    listBox: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(3),
    },
    listIcon: {
        backgroundColor: '#3BB77E',
        color: '#fff',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing(3),
    },
    content: {
        flex: 1,
    },
    featureImage: {
        maxWidth: '100%',
       
        height: '100%',
        borderRadius: '8px',
        // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
}));

const FeatureSection = () => {
    const classes = useStyles();

    return (
        <div className={classes.featureBg}>
            <div className={classes.container}>
                <div className="row">
                    <div className="col-lg-7">
                        <div className={classes.featuredText}>
                            <Typography variant="h2" className="pb-3">
                              Our  <span className={classes.orangeText}>Vission </span>
                            </Typography>
                            <div className={classes.listBox}>
                                <div className={classes.listIcon}>
                                    <i className="fas fa-shipping-fast" />
                                </div>
                                <div className={classes.content}>
                                    {/* <Typography variant="h3">Center of Excellence for Herbs</Typography> */}
                                    <Typography variant="body1">
                                       To be the Center of Excellence for herbs 
                                    </Typography>
                                </div>
                            </div>
                            <div className={classes.listBox}>
                                <div className={classes.listIcon}>
                                    <i className="fas fa-money-bill-alt" />
                                </div>
                                <div className={classes.content}>
                                    {/* <Typography variant="h3">  Innovation & Sustainability</Typography> */}
                                    <Typography variant="body1">
                                       To lead the Industry in Technological Innovations,developing Production techniques to achievve sustainable efficiency.
                                    </Typography>
                                </div>
                            </div>
                            <div className={classes.listBox}>
                                <div className={classes.listIcon}>
                                    <i className="fas fa-briefcase" />
                                </div>
                                <div className={classes.content}>
                                    {/* <Typography variant="h3">Optimized Supply Chain</Typography> */}
                                    <Typography variant="body1">
                                     to continually develop and optimise the groups vertically integrated supply chain.
                                    </Typography>
                                </div>
                            </div>
                            {/* <div className={classes.listBox}>
                                <div className={classes.listIcon}>
                                    <i className="fas fa-sync-alt" />
                                </div>
                                <div className={classes.content}>
                                    <Typography variant="h3">Quick Refund</Typography>
                                    <Typography variant="body1">
                                        sit voluptatem accusantium dolore mque laudantium, totam rem aperiam,
                                        eaque ipsa quae ab illo.
                                    </Typography>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <div className="col-lg-5">
                        {/* Image Section */}
                        <img src={image} alt="Feature Image" className={classes.featureImage} />
                    </div>
                </div>
            </div>
            <div className={classes.container}>
                <div className="row">
                
                    <div className="col-lg-5">
                        {/* Image Section */}
                        <img src={image} alt="Feature Image" className={classes.featureImage} />
                    </div>

                    <div className="col-lg-7">
                        <div className={classes.featuredText}>
                            <Typography variant="h2" className="pb-3">
                             Our <span className={classes.orangeText}>Mission</span>
                            </Typography>
                            <div className={classes.listBox}>
                                <div className={classes.listIcon}>
                                    <i className="fas fa-shipping-fast" />
                                </div>
                                <div className={classes.content}>
                                    {/* <Typography variant="h3"> Quality Seasonings for Health</Typography> */}
                                    <Typography variant="body1">
                                    We grow and sell quality,fresh seasoning products and improve the consumer healthy kife style.
                                    </Typography>
                                </div>
                            </div>
                            <div className={classes.listBox}>
                                <div className={classes.listIcon}>
                                    <i className="fas fa-money-bill-alt" />
                                </div>
                                <div className={classes.content}>
                                    {/* <Typography variant="h3"> Highest Quality Products</Typography> */}
                                    <Typography variant="body1">
                                     We grow the highest quality products in the herb and increase market value around India. 
                                    </Typography>
                                </div>
                            </div>
                            <div className={classes.listBox}>
                                <div className={classes.listIcon}>
                                    <i className="fas fa-briefcase" />
                                </div>
                                <div className={classes.content}>
                                    {/* <Typography variant="h3">    Innovative Products and Packaging</Typography> */}
                                    <Typography variant="body1">
                                   We aim to Introduce new innovative Products and packaging 
                                    </Typography>
                                </div>
                            </div>
                            {/* <div className={classes.listBox}>
                                <div className={classes.listIcon}>
                                    <i className="fas fa-sync-alt" />
                                </div>
                                <div className={classes.content}>
                                    <Typography variant="h3">Quick Refund</Typography>
                                    <Typography variant="body1">
                                        sit voluptatem accusantium dolore mque laudantium, totam rem aperiam,
                                        eaque ipsa quae ab illo.
                                    </Typography>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureSection;
