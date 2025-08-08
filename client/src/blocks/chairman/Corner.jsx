'use client';
import PropTypes from 'prop-types';

// @mui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

// @third-party
import { motion } from 'framer-motion';

// @project
import { GraphicsCard } from '@/components/cards';
import ContainerWrapper from '@/components/ContainerWrapper';
import Typeset from '@/components/Typeset';
import { SECTION_COMMON_PY } from '@/utils/constant';

/***************************  CORNER CARD COMPONENT  ***************************/

export default function Corner({ heading, caption, image, title, message, name, designation }) {
  return (
    <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
      <Stack sx={{ gap: { xs: 3, sm: 4, md: 5 } }}>
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

        {/* Card Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.5
          }}
        >
          <GraphicsCard
            sx={{
              overflow: 'hidden',
              borderRadius: 3,
              boxShadow: 6,
              height: { xs: 'auto', md: 400 },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 12,
                '& .card-image': {
                  transform: 'scale(1.05)'
                },
                '& .message-content': {
                  '& .title': {
                    color: 'primary.dark'
                  },
                  '& .message-text': {
                    color: 'primary.dark'
                  }
                }
              }
            }}
          >
            {/* Left Half - Message Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.7
              }}
              style={{ flex: '1', display: 'flex' }}
            >
              <Box
                className="message-content"
                sx={{
                  flex: 1,
                  //   backgroundColor: 'grey.800',
                  //   color: 'common.white',
                  p: { xs: 3, sm: 4, md: 5 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-evenly', // Even spacing
                  gap: { xs: 2, sm: 2.5, md: 3 }
                }}
              >
                {/* Title */}
                {title && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 1.1
                    }}
                  >
                    <Typography
                      className="title"
                      variant="h4"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {title}
                    </Typography>
                  </motion.div>
                )}

                {/* Message with quotes and italic */}
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 1.3
                    }}
                  >
                    <Typography
                      className="message-text"
                      variant="body1"
                      sx={{
                        fontStyle: 'italic',
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.125rem' },
                        lineHeight: 1.7,
                        transition: 'color 0.3s ease',
                        my: 2
                      }}
                    >
                      "{message}"
                    </Typography>
                  </motion.div>
                )}

                {/* Name and Designation */}
                <Stack spacing={1} sx={{ mt: 'auto' }}>
                  {name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: 1.5
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.25rem' }
                        }}
                      >
                        {name}
                      </Typography>
                    </motion.div>
                  )}

                  {designation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: 1.7
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'primary.dark',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontWeight: 500
                        }}
                      >
                        {designation}
                      </Typography>
                    </motion.div>
                  )}
                </Stack>
              </Box>
            </motion.div>

            {/* Right Half - Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.9
              }}
              style={{ flex: '1', display: 'flex' }}
            >
              <Box
                sx={{
                  flex: 1,
                  position: 'relative',
                  minHeight: { xs: 250, md: 400 },
                  overflow: 'hidden'
                }}
              >
                <Box
                  className="card-image"
                  component="img"
                  src={image}
                  alt={title || 'Card image'}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              </Box>
            </motion.div>
          </GraphicsCard>
          {/* <Card
            sx={{
              overflow: 'hidden',
              borderRadius: 3,
              boxShadow: 6,
              height: { xs: 'auto', md: 400 },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 12,
                '& .card-image': {
                  transform: 'scale(1.05)'
                },
                '& .message-content': {
                  '& .title': {
                    color: 'primary.light'
                  },
                  '& .message-text': {
                    color: 'common.white'
                  }
                }
              }
            }}
          >

          </Card> */}
        </motion.div>
      </Stack>
    </ContainerWrapper>
  );
}

Corner.propTypes = {
  heading: PropTypes.any,
  caption: PropTypes.any,
  image: PropTypes.string.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  name: PropTypes.string,
  designation: PropTypes.string
};
