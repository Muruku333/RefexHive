'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Modal, IconButton, Fade, Stack, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import Iconify from '@/components/iconify';
import ContainerWrapper from '@/components/ContainerWrapper';
import Typeset from '@/components/Typeset';
import { SECTION_COMMON_PY } from '@/utils/constant';

const Carousel = ({ heading, caption, images = [], autoPlayInterval = 5000 }) => {
  const [active, setActive] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [loadedImages, setLoadedImages] = useState([]);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState('left');

  const containerRef = useRef(null);
  const startXRef = useRef(null);
  const autoPlayRef = useRef(null);
  const dragStartRef = useRef(null);

  // Preload and track image load status
  useEffect(() => {
    const preload = async () => {
      const loaded = await Promise.all(
        images.map(
          (src) =>
            new Promise((resolve) => {
              const img = new Image();
              img.src = src;
              img.onload = () => resolve(src);
              img.onerror = () => resolve(null);
            })
        )
      );
      setLoadedImages(loaded.filter(Boolean));
    };
    preload();
  }, [images]);

  // Auto-play functionality with smooth animation
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    if (!isAutoPlayPaused && loadedImages.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setIsTransitioning(true);
        setTransitionDirection('left'); // Auto-play always goes right to left

        setTimeout(() => {
          setActive((prev) => (prev + 1) % loadedImages.length);
          setIsTransitioning(false);
        }, 150); // Half of transition duration
      }, autoPlayInterval);
    }
  }, [autoPlayInterval, loadedImages.length, isAutoPlayPaused]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  // Initialize auto-play when component mounts and images are loaded
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  // Restart auto-play when active slide changes manually or when auto-play is unpaused
  useEffect(() => {
    if (!fullscreen && !isDragging && !isTransitioning) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [active, fullscreen, isDragging, isTransitioning, startAutoPlay, stopAutoPlay]);

  // Get circular index for infinite scrolling
  const getCircularIndex = useCallback(
    (index) => {
      if (loadedImages.length === 0) return 0;
      return ((index % loadedImages.length) + loadedImages.length) % loadedImages.length;
    },
    [loadedImages.length]
  );

  // Get previous, current, and next image indices
  const getPrevIndex = () => getCircularIndex(active - 1);
  const getCurrentIndex = () => getCircularIndex(active);
  const getNextIndex = () => getCircularIndex(active + 1);

  const onPointerDown = (e) => {
    // Don't start dragging if clicking on an image (for fullscreen functionality)
    if (e.target.tagName === 'IMG') return;

    stopAutoPlay();
    setIsDragging(true);
    startXRef.current = e.clientX;
    dragStartRef.current = e.clientX;
    setDragOffset(0);
    containerRef.current?.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!isDragging || startXRef.current === null) return;

    const dx = e.clientX - dragStartRef.current;
    setDragOffset(dx);

    // If dragged far enough, change slide with animation
    if (Math.abs(dx) > 120) {
      const direction = dx < 0 ? 1 : -1;
      setIsTransitioning(true);
      setTransitionDirection(dx < 0 ? 'left' : 'right');

      setTimeout(() => {
        setActive((prev) => getCircularIndex(prev + direction));
        setIsTransitioning(false);
        setDragOffset(0);
      }, 150);

      dragStartRef.current = e.clientX;
    }
  };

  const onPointerUp = () => {
    setIsDragging(false);
    setDragOffset(0);
    startXRef.current = null;
    dragStartRef.current = null;
  };

  const openFullscreen = (idx) => {
    console.log('Opening fullscreen for index:', idx);
    stopAutoPlay();
    setIsAutoPlayPaused(true);
    setFullscreenImageIndex(idx);
    setFullscreen(true);
  };

  const closeFullscreen = () => {
    console.log('Closing fullscreen');
    setFullscreen(false);
    setIsAutoPlayPaused(false);
  };

  const goToSlide = (index) => {
    if (index === active) return;

    stopAutoPlay();
    setIsTransitioning(true);
    setTransitionDirection(index > active ? 'left' : 'right');

    setTimeout(() => {
      setActive(index);
      setIsTransitioning(false);
    }, 150);
  };

  // Handle manual navigation with animation
  const navigateToSlide = (newIndex, direction) => {
    if (newIndex === active) return;

    stopAutoPlay();
    setIsTransitioning(true);
    setTransitionDirection(direction);

    setTimeout(() => {
      setActive(newIndex);
      setIsTransitioning(false);
    }, 150);
  };

  // Show loading with circular progress
  if (images.length > 0 && loadedImages.length === 0) {
    return (
      <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: { xs: 250, sm: 350, md: 450 },
            flexDirection: 'column',
            gap: 2
          }}
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      </ContainerWrapper>
    );
  }

  if (loadedImages.length === 0) {
    return null;
  }

  return (
    <ContainerWrapper sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
      <Stack spacing={{ xs: 3, sm: 4, md: 5 }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
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

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.4
          }}
        >
          <Box
            sx={{
              width: '100%',
              position: 'relative',
              overflow: { xs: 'hidden', sm: 'visible' }
            }}
          >
            <Box
              ref={containerRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              sx={{
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                height: { xs: 250, sm: 350, md: 450 },
                minHeight: { xs: 200, sm: 300, md: 400 },
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: { xs: 'hidden', sm: 'visible' },
                px: { xs: 0, sm: 2, md: 4 }
              }}
            >
              {/* Three images layout with smooth animations */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `translateX(${dragOffset}px)`,
                  transition: isDragging ? 'none' : isTransitioning ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'transform 0.3s ease'
                }}
              >
                {/* Previous Image - Hidden on mobile */}
                {loadedImages.length > 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: { xs: '-100vw', sm: -80, md: -120 }, // Hide on mobile
                      top: '50%',
                      transform: 'translateY(-50%) scale(0.7)',
                      zIndex: 1,
                      opacity: { xs: 0, sm: 0.6 }, // Hide on mobile
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      display: { xs: 'none', sm: 'block' }, // Hide on mobile
                      '&:hover': {
                        opacity: 0.8,
                        transform: 'translateY(-50%) scale(0.75)'
                      }
                    }}
                    onClick={() => navigateToSlide(getPrevIndex(), 'right')}
                  >
                    <Box
                      component="img"
                      src={loadedImages[getPrevIndex()]}
                      alt={`slide-${getPrevIndex()}`}
                      draggable={false}
                      sx={{
                        width: { sm: 200, md: 280 },
                        height: { sm: 150, md: 210 },
                        maxWidth: '100%',
                        objectFit: 'cover',
                        borderRadius: 2,
                        boxShadow: 3,
                        backgroundColor: 'background.paper'
                      }}
                    />
                  </Box>
                )}

                {/* Current Image (Center) - Responsive sizing */}
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 3,
                    transform: 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    width: '100%',
                    maxWidth: { xs: '100%', sm: 460, md: 580 },
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Box
                    component="img"
                    src={loadedImages[getCurrentIndex()]}
                    alt={`slide-${getCurrentIndex()}`}
                    onClick={() => openFullscreen(getCurrentIndex())}
                    draggable={false}
                    sx={{
                      width: { xs: '95%', sm: 460, md: 580 },
                      maxWidth: '100%',
                      height: { xs: 200, sm: 300, md: 380 },
                      objectFit: 'cover',
                      borderRadius: { xs: 2, sm: 3 },
                      boxShadow: { xs: 4, sm: 6, md: 8 },
                      cursor: 'pointer',
                      backgroundColor: 'background.paper',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: { xs: 'none', sm: 'scale(1.02)' }
                      }
                    }}
                  />
                </Box>

                {/* Next Image - Hidden on mobile */}
                {loadedImages.length > 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      right: { xs: '-100vw', sm: -80, md: -120 }, // Hide on mobile
                      top: '50%',
                      transform: 'translateY(-50%) scale(0.7)',
                      zIndex: 1,
                      opacity: { xs: 0, sm: 0.6 }, // Hide on mobile
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      display: { xs: 'none', sm: 'block' }, // Hide on mobile
                      '&:hover': {
                        opacity: 0.8,
                        transform: 'translateY(-50%) scale(0.75)'
                      }
                    }}
                    onClick={() => navigateToSlide(getNextIndex(), 'left')}
                  >
                    <Box
                      component="img"
                      src={loadedImages[getNextIndex()]}
                      alt={`slide-${getNextIndex()}`}
                      draggable={false}
                      sx={{
                        width: { sm: 200, md: 280 },
                        height: { sm: 150, md: 210 },
                        maxWidth: '100%',
                        objectFit: 'cover',
                        borderRadius: 2,
                        boxShadow: 3,
                        backgroundColor: 'background.paper'
                      }}
                    />
                  </Box>
                )}
              </Box>

              {/* Mobile Navigation Arrows - Only show on mobile when side images are hidden */}
              {loadedImages.length > 1 && (
                <>
                  <IconButton
                    onClick={() => navigateToSlide(getPrevIndex(), 'right')}
                    sx={{
                      position: 'absolute',
                      left: { xs: 8, sm: -40, md: -60 },
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(0,0,0,0.3)',
                      color: 'white',
                      zIndex: 4,
                      display: { xs: 'flex', sm: 'none' }, // Only show on mobile
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.5)'
                      }
                    }}
                    size="small"
                  >
                    <Iconify icon="solar:arrow-left-bold" width={20} />
                  </IconButton>

                  <IconButton
                    onClick={() => navigateToSlide(getNextIndex(), 'left')}
                    sx={{
                      position: 'absolute',
                      right: { xs: 8, sm: -40, md: -60 },
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(0,0,0,0.3)',
                      color: 'white',
                      zIndex: 4,
                      display: { xs: 'flex', sm: 'none' }, // Only show on mobile
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.5)'
                      }
                    }}
                    size="small"
                  >
                    <Iconify icon="solar:arrow-right-bold" width={20} />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Dot indicators - Responsive sizing */}
            <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} justifyContent="center" sx={{ mt: { xs: 2, sm: 3 } }}>
              {loadedImages.map((_, idx) => (
                <Box
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  sx={{
                    width: { xs: 10, sm: 12, md: 14 },
                    height: { xs: 10, sm: 12, md: 14 },
                    borderRadius: '50%',
                    bgcolor: active === idx ? 'primary.main' : 'grey.400',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: active === idx ? 'primary.dark' : 'grey.500',
                      transform: { xs: 'scale(1.2)', sm: 'scale(1.3)' }
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* Fullscreen viewer - Responsive */}
        <Modal
          open={fullscreen}
          onClose={closeFullscreen}
          closeAfterTransition
          disableScrollLock
          disableEnforceFocus
          disableAutoFocus
          sx={{
            zIndex: 9999,
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0,0,0,0.95)'
            }
          }}
        >
          <Fade in={fullscreen}>
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
                p: { xs: 1, sm: 2 },
                outline: 'none',
                zIndex: 9999
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  closeFullscreen();
                }
              }}
            >
              {/* Close button - Responsive positioning */}
              <IconButton
                onClick={closeFullscreen}
                sx={{
                  position: 'absolute',
                  top: { xs: 16, sm: 24 },
                  right: { xs: 16, sm: 24 },
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'common.white',
                  zIndex: 10000,
                  size: { xs: 'medium', sm: 'large' },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)'
                  }
                }}
                aria-label="close fullscreen"
              >
                <Iconify icon="solar:close-circle-bold" width={{ xs: 24, sm: 32 }} />
              </IconButton>

              {/* Fullscreen image - Responsive sizing */}
              {loadedImages[fullscreenImageIndex] && (
                <Box
                  component="img"
                  src={loadedImages[fullscreenImageIndex]}
                  alt={`fullscreen-${fullscreenImageIndex}`}
                  draggable={false}
                  sx={{
                    maxWidth: { xs: '95%', sm: '90%', md: '85%' },
                    maxHeight: { xs: '85%', sm: '90%' },
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: 1,
                    boxShadow: 6
                  }}
                />
              )}

              {/* Navigation arrows in fullscreen - Responsive */}
              {loadedImages.length > 1 && (
                <>
                  <IconButton
                    onClick={() => {
                      setFullscreenImageIndex(getCircularIndex(fullscreenImageIndex - 1));
                    }}
                    sx={{
                      position: 'absolute',
                      left: { xs: 16, sm: 24 },
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'common.white',
                      zIndex: 10000,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.2)'
                      }
                    }}
                    aria-label="previous image"
                  >
                    <Iconify icon="solar:arrow-left-bold" width={{ xs: 20, sm: 24 }} />
                  </IconButton>

                  <IconButton
                    onClick={() => {
                      setFullscreenImageIndex(getCircularIndex(fullscreenImageIndex + 1));
                    }}
                    sx={{
                      position: 'absolute',
                      right: { xs: 16, sm: 24 },
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'common.white',
                      zIndex: 10000,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.2)'
                      }
                    }}
                    aria-label="next image"
                  >
                    <Iconify icon="solar:arrow-right-bold" width={{ xs: 20, sm: 24 }} />
                  </IconButton>
                </>
              )}

              {/* Image counter - Responsive positioning and sizing */}
              {loadedImages.length > 1 && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: { xs: 16, sm: 24 },
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'common.white',
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.5, sm: 1 },
                    borderRadius: 1,
                    typography: { xs: 'caption', sm: 'body2' },
                    zIndex: 10000,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  {fullscreenImageIndex + 1} / {loadedImages.length}
                </Box>
              )}
            </Box>
          </Fade>
        </Modal>
      </Stack>
    </ContainerWrapper>
  );
};

Carousel.propTypes = {
  heading: PropTypes.string.isRequired,
  caption: PropTypes.any,
  images: PropTypes.arrayOf(PropTypes.string),
  autoPlayInterval: PropTypes.number
};

export default Carousel;
