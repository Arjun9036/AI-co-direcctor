import React from 'react';
import { Button, Typography, Container, Box, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      {/* Navbar */}
      <Box
        component="nav"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 3, sm: 8 },
          py: 2,
          backgroundColor: 'orange', // 🎨 Solid orange color (matching heading)
          color: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          zIndex: 1000,
        }}
      >
        {/* Brand Name */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            letterSpacing: 1,
            color: 'white',
          }}
        >
          STORYFLOW
        </Typography>

        {/* Sign Out Button */}
        <Box sx={{ mr: '100px' }}> {/* 👈 Moves 100px from the right edge */}
          <Button
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'white',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: 'white', color: 'black' },
            }}
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </Box>
      </Box>

      {/* Hero Section */}
      {/* Hero Section with Video Background */}
<Box
  sx={{
    height: "100vh",
    position: "relative",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    overflow: "hidden",
  }}
>

  {/* Background Video */}
  <video
    autoPlay
    loop
    muted
    playsInline
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      minWidth: "100%",
      minHeight: "100%",
      width: "auto",
      height: "auto",
      zIndex: 1,
      transform: "translate(-50%, -50%)",
      objectFit: "cover",
      filter: "brightness(40%)", // ✅ Darkens video behind text
    }}
  >
    <source src="/background.mp4" type="video/mp4" />
  </video>

  {/* Content Above Video */}
  <Box sx={{ maxWidth: "800px", zIndex: 2, px: 2 }}>
    <Typography
      variant="h3"
      fontWeight="bold"
      gutterBottom
      sx={{ fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } }}
    >
      Transform your great idea into a <br /> production-ready script
    </Typography>

    <Typography
      variant="h6"
      color="gray"
      gutterBottom
      sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
    >
      Screenwriting, story development, and production tools for film & TV, and interactive media.
    </Typography>
  </Box>
</Box>


      {/* Features Section */}
      <Container sx={{ py: 10 }}>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.2rem' },
            mb: 6,
            color: 'orange',
          }}
        >
          Smart AI Features for Every Creator
        </Typography>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
        >
          {[
            {
              title: '📄 Script Transformer',
              desc: 'Upload your Word or PDF script, select your desired genre (Drama, Thriller, Comedy, etc.), and our AI automatically rewrites and transforms it to match the chosen storytelling tone, emotion, and pacing.',
              route: '/script-transformer',
            },
            {
              title: '🎥 Video Analyzer',
              desc: 'Upload your acting or film performance video — our AI models analyze accuracy, expressions, and overall performance. Receive actionable feedback and personalized improvement suggestions instantly.',
              route: '/video-analyzer',
            },
          ].map((feature, index) => (
            <Grid
              item
              xs={12}
              md={6}
              key={index}
              onClick={() => navigate(feature.route)}
            >
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 4, sm: 6 },
                  borderRadius: 4,
                  height: '100%',
                  background: 'linear-gradient(135deg, #f9fafb, #e5e7eb)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 12px 25px rgba(0,0,0,0.25)',
                    background: 'linear-gradient(135deg, #fff, #ffedd5)',
                  },
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    color: 'orange',
                    fontSize: { xs: '1.4rem', sm: '1.6rem' },
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  sx={{
                    color: '#333',
                    fontSize: { xs: '0.95rem', sm: '1.05rem' },
                    mt: 2,
                    lineHeight: 1.6,
                  }}
                >
                  {feature.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Home;




/*
import React from 'react';
import { Typography, Container, Box, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box
        component="nav"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between', // Keeps title on the left
          alignItems: 'center',
          px: { xs: 3, sm: 8 },
          py: 2,
          backgroundColor: 'orange',
          color: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          zIndex: 1000,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            letterSpacing: 1,
            color: 'white',
          }}
        >
          STORYFLOW
        </Typography>
        
      </Box>

      <Box
        sx={{
          height: "100vh",
          position: "relative",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            minWidth: "100%",
            minHeight: "100%",
            width: "auto",
            height: "auto",
            zIndex: 1,
            transform: "translate(-50%, -50%)",
            objectFit: "cover",
            filter: "brightness(40%)",
          }}
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>

        <Box sx={{ maxWidth: "800px", zIndex: 2, px: 2 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{ fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } }}
          >
            Transform your great idea into a <br /> production-ready script
          </Typography>

          <Typography
            variant="h6"
            color="gray"
            gutterBottom
            sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
          >
            Screenwriting, story development, and production tools for film & TV, and interactive media.
          </Typography>
        </Box>
      </Box>

      <Container sx={{ py: 10 }}>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.2rem' },
            mb: 6,
            color: 'orange',
          }}
        >
          Smart AI Features for Every Creator
        </Typography>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
        >
          {[
            {
              title: '📄 Script Transformer',
              desc: 'Upload your Word or PDF script, select your desired genre (Drama, Thriller, Comedy, etc.), and our AI automatically rewrites and transforms it to match the chosen storytelling tone, emotion, and pacing.',
              route: '/script-transformer',
            },
            {
              title: '🎥 Video Analyzer',
              desc: 'Upload your acting or film performance video — our AI models analyze accuracy, expressions, and overall performance. Receive actionable feedback and personalized improvement suggestions instantly.',
              route: '/video-analyzer',
            },
          ].map((feature, index) => (
            <Grid
              item
              xs={12}
              md={6}
              key={index}
              onClick={() => navigate(feature.route)}
            >
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 4, sm: 6 },
                  borderRadius: 4,
                  height: '100%',
                  background: 'linear-gradient(135deg, #f9fafb, #e5e7eb)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 12px 25px rgba(0,0,0,0.25)',
                    background: 'linear-gradient(135deg, #fff, #ffedd5)',
                  },
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    color: 'orange',
                    fontSize: { xs: '1.4rem', sm: '1.6rem' },
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  sx={{
                    color: '#333',
                    fontSize: { xs: '0.95rem', sm: '1.05rem' },
                    mt: 2,
                    lineHeight: 1.6,
                  }}
                >
                  {feature.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Home;

*/