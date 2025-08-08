'use client';
import PropTypes from 'prop-types';

// @mui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Fade from '@mui/material/Fade';

// @third-party
import { motion } from 'framer-motion';

// @project
import { GraphicsCard } from '@/components/cards';
import ContainerWrapper from '@/components/ContainerWrapper';
import Typeset from '@/components/Typeset';
import Iconify from '@/components/iconify';
import { SECTION_COMMON_PY } from '@/utils/constant';
import { useState } from 'react';

/***************************  LEADERSHIP COMPONENT  ***************************/

export default function Leadership({ heading, caption, leaders = [] }) {
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = (leader) => {
    setSelectedLeader(leader);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLeader(null);
  };

  const handleLinkedInClick = (linkedinUrl) => {
    if (linkedinUrl) {
      window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
      <Stack sx={{ gap: { xs: 4, sm: 5, md: 6 } }}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.3
          }}
        >
          <Typeset
            {...{
              heading,
              caption,
              stackProps: { sx: { alignItems: 'center', textAlign: 'center' } },
              captionProps: { sx: { width: { xs: 1, sm: '80%', md: '65%' } } }
            }}
          />
        </motion.div>

        {/* Leadership Cards Grid - 3 cards per row on all screens */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
          {leaders.map((leader, index) => (
            <Grid item xs={4} sm={4} md={4} key={index}>
              {' '}
              {/* Changed to xs=4 for 3 per row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.5 + index * 0.1
                }}
              >
                <GraphicsCard
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 12
                    }
                  }}
                  onClick={() => handleCardClick(leader)}
                >
                  <Stack
                    spacing={{ xs: 1, sm: 2 }} // Reduced spacing on mobile
                    sx={{
                      p: { xs: 2, sm: 3, md: 4 }, // Reduced padding on mobile
                      alignItems: 'center',
                      textAlign: 'center',
                      minHeight: { xs: 280, sm: 320, md: 360 } // Responsive heights
                    }}
                  >
                    {/* Round Image */}
                    <Avatar
                      src={leader.image}
                      alt={leader.name}
                      sx={{
                        width: { xs: 60, sm: 80, md: 100 }, // Smaller on mobile
                        height: { xs: 60, sm: 80, md: 100 },
                        mb: { xs: 0.5, sm: 1 },
                        border: '3px solid',
                        borderColor: 'primary.main',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />

                    {/* Name */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
                      }}
                    >
                      {leader.name}
                    </Typography>

                    {/* Designation */}
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 500,
                        fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' }
                      }}
                    >
                      {leader.designation}
                    </Typography>

                    {/* Bio */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.5,
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                        display: '-webkit-box',
                        WebkitLineClamp: { xs: 2, sm: 3 }, // Fewer lines on mobile
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {leader.bio}
                    </Typography>

                    {/* LinkedIn Icon */}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLinkedInClick(leader.linkedin);
                      }}
                      sx={{
                        color: '#0077B5',
                        mt: 'auto',
                        size: { xs: 'small', sm: 'medium' },
                        '&:hover': {
                          backgroundColor: 'rgba(0, 119, 181, 0.1)',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <Iconify icon="mdi:linkedin" width={{ xs: 20, sm: 24 }} />
                    </IconButton>
                  </Stack>
                </GraphicsCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Full View Modal - unchanged */}
        <Modal open={modalOpen} onClose={handleCloseModal} closeAfterTransition sx={{ zIndex: 9999 }}>
          <Fade in={modalOpen}>
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
                bgcolor: 'rgba(0,0,0,0.8)',
                outline: 'none'
              }}
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <GraphicsCard
                  sx={{
                    maxWidth: { xs: '90vw', sm: 500, md: 600 },
                    maxHeight: '90vh',
                    overflow: 'auto',
                    position: 'relative'
                  }}
                >
                  {/* Close Button */}
                  <IconButton
                    onClick={handleCloseModal}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,1)'
                      }
                    }}
                  >
                    <Iconify icon="solar:close-circle-bold" width={24} />
                  </IconButton>

                  {selectedLeader && (
                    <Stack
                      spacing={3}
                      sx={{
                        p: { xs: 4, sm: 5, md: 6 },
                        alignItems: 'center',
                        textAlign: 'center'
                      }}
                    >
                      {/* Large Round Image */}
                      <Avatar
                        src={selectedLeader.image}
                        alt={selectedLeader.name}
                        sx={{
                          width: { xs: 120, sm: 150, md: 180 },
                          height: { xs: 120, sm: 150, md: 180 },
                          border: '6px solid',
                          borderColor: 'primary.main',
                          boxShadow: 6
                        }}
                      />

                      {/* Name */}
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary',
                          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                        }}
                      >
                        {selectedLeader.name}
                      </Typography>

                      {/* Designation */}
                      <Typography
                        variant="h4"
                        sx={{
                          color: 'primary.main',
                          fontWeight: 500,
                          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                        }}
                      >
                        {selectedLeader.designation}
                      </Typography>

                      {/* Full Bio */}
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.7,
                          fontSize: { xs: '1rem', sm: '1.125rem' },
                          maxWidth: '80%'
                        }}
                      >
                        {selectedLeader.bio}
                      </Typography>

                      {/* LinkedIn Button */}
                      <IconButton
                        onClick={() => handleLinkedInClick(selectedLeader.linkedin)}
                        sx={{
                          color: '#0077B5',
                          bgcolor: 'rgba(0, 119, 181, 0.1)',
                          p: 2,
                          '&:hover': {
                            bgcolor: 'rgba(0, 119, 181, 0.2)',
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <Iconify icon="mdi:linkedin" width={32} />
                      </IconButton>
                    </Stack>
                  )}
                </GraphicsCard>
              </motion.div>
            </Box>
          </Fade>
        </Modal>
      </Stack>
    </ContainerWrapper>
  );
}

Leadership.propTypes = {
  heading: PropTypes.any,
  caption: PropTypes.any,
  leaders: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      designation: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      bio: PropTypes.string.isRequired,
      linkedin: PropTypes.string
    })
  )
};
