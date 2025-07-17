// src/components/shared/FeaturedContent.tsx
'use client'; // Mark as a Client Component

import React from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Paper,
  Stack,
  Alert,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { PlayCircle, BookOpen, Lightbulb, Tv } from 'lucide-react';
import { Course, Series, VideoContent } from '@/types'; // Import necessary types

// Define props for the component
interface FeaturedContentProps {
  courses: Course[] | null;
  series: Series[] | null;
  videos: VideoContent[] | null;
  categories: string[];
  hasError: boolean; // Pass the error/empty state
}

export function FeaturedContent({
  courses,
  series,
  videos,
  categories,
  hasError,
}: FeaturedContentProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 4 },
        // This function is now safe inside a Client Component
        borderRadius: (theme) => theme.shape.borderRadius,
      }}
    >
      {/* Display errors/warnings */}
      {hasError && (
        <Alert severity='warning' sx={{ mb: 3 }}>
          Could not load all featured content. Data might be missing.
        </Alert>
      )}

      {/* 2. Featured Courses Section */}
      {courses && courses.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography
            variant='h4'
            component='h2'
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <BookOpen /> Featured Courses
          </Typography>
          <Grid container spacing={3}>
            {courses.map((course) => (
              // Remember: No 'item' prop here
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardMedia
                    component='img'
                    height='160'
                    image={course.thumbnailUrl || '/placeholder-image.jpg'}
                    alt={course.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant='h6'
                      component='div'
                      noWrap
                    >
                      {course.title}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        mb: 1,
                      }}
                    >
                      {course.description}
                    </Typography>
                    <Chip
                      label={course.difficultyLevel}
                      size='small'
                      variant='outlined'
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </CardContent>
                  <CardActions>
                    <Link
                      href={`/courses/${course.id}`}
                      passHref
                      legacyBehavior
                    >
                      <Button size='small' startIcon={<PlayCircle size={16} />}>
                        View Course
                      </Button>
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* 3. Featured Series Section */}
      {series && series.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography
            variant='h4'
            component='h2'
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Tv /> Popular Series
          </Typography>
          <Grid container spacing={3}>
            {series.map(
              (
                item // Renamed loop variable to avoid conflict if needed
              ) => (
                // No 'item' prop
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <CardMedia
                      component='img'
                      height='160'
                      image={item.thumbnailUrl || '/placeholder-series.jpg'}
                      alt={item.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant='h6'
                        component='div'
                        noWrap
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={
                          {
                            /* Limit lines */
                          }
                        }
                      >
                        {item.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Link href={`/series/${item.id}`} passHref legacyBehavior>
                        <Button
                          size='small'
                          startIcon={<PlayCircle size={16} />}
                        >
                          Watch Series
                        </Button>
                      </Link>
                    </CardActions>
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        </Box>
      )}

      {/* 4. Browse by Category */}
      {categories && categories.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography
            variant='h4'
            component='h2'
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Lightbulb /> Explore Topics
          </Typography>
          <Stack direction='row' spacing={1} useFlexGap flexWrap='wrap'>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                component={Link}
                href={`/browse?category=${encodeURIComponent(
                  category.toLowerCase()
                )}`}
                clickable
                variant='outlined'
                color='primary'
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* 5. Latest Videos (Vlogs, Standalone) */}
      {videos && videos.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant='h4' component='h2' gutterBottom>
            Recent Updates
          </Typography>
          <Grid container spacing={3}>
            {videos.map((video) => (
              // No 'item' prop
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={video.id}>
                <Card>
                  <CardContent>
                    <Chip
                      label={video.type}
                      size='small'
                      variant='filled'
                      color='secondary'
                      sx={{ mb: 1, textTransform: 'capitalize' }}
                    />
                    <Typography variant='h6' noWrap>
                      {video.title}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                    >{`Duration: ${Math.round(
                      video.duration / 60
                    )} min`}</Typography>
                  </CardContent>
                  <CardActions>
                    <Link href={`/watch/${video.id}`} passHref legacyBehavior>
                      <Button size='small'>Watch Now</Button>
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Paper>
  );
}
