import { Box, CardContent, Button, Card, Stack, Typography, Paper } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ReactHtmlParser from 'react-html-parser';
import StarIcon from '@mui/icons-material/Star';
import { useState } from 'react';

import { MusicFestivalTable } from 'src/components/tables/music-festival-table';
import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';
import { formatEventDate, formatTimeTo12Hour } from 'src/hooks/formate-time';


import { tabs, typeMap, reviews, musicFestivalTableHeaders } from './utills';



export function MusicFestival({ selectedEvent }: any) {
    const { organizer, tickets } = selectedEvent
    const [tab, setTab] = useState(0);

    const filteredReviews = reviews.filter((review) => review.type === typeMap[tab]);
    return (
        <Box>
            <Card sx={{ borderRadius: 4, boxShadow: 3, p: 1, mt: 3 }}>
                <CardContent>
                    {/* Title */}
                    <HeadingCommon title={selectedEvent?.eventName} weight={600} baseSize="30px" />

                    {/* Banner */}
                    <Box
                        component="img"
                        src={selectedEvent?.coverImage?.url}
                        alt={selectedEvent?.eventName}
                        sx={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: 300,
                            borderRadius: 2,
                            objectFit: 'cover',
                            mb: 2,
                        }}
                    />

                    {/* Date & Location */}
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        alignItems="center"
                        justifyContent="flex-start"

                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            <CalendarMonthIcon fontSize="small" />
                            <HeadingCommon title={`${formatEventDate(selectedEvent.date)}, ${formatTimeTo12Hour(selectedEvent.time)}`} weight={400} baseSize="16px" />
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center" >
                            <LocationOnIcon fontSize="small" />
                            <HeadingCommon title={selectedEvent?.location} weight={400} baseSize="16px" />

                        </Stack>
                    </Stack>
                    {/* Description */}
                    <HeadingCommon mb={2} title={ReactHtmlParser(selectedEvent?.description)} weight={400} baseSize="16px" />

                    {/* Organizer Section */}
                    {
                        Object.keys(organizer).length === 0 ? null : <Box
                            key={organizer?._id}
                            sx={{

                                backgroundColor: '#f3f3f3',
                                p: 2,
                                borderRadius: 2,
                                mb: 4,
                            }}
                        >
                            <HeadingCommon title={`Organizer: ${organizer?.name}`} weight={500} baseSize="26px" />

                            <Button variant="contained" size="small" sx={{ mb: 2, backgroundColor: '#0B2E4C' }}>
                                View More Events
                            </Button>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <EmailIcon sx={{ color: '#0B2E4C' }} fontSize="small" />
                                    <HeadingCommon title={organizer?.email} weight={400} baseSize="16px" />
                                </Stack>

                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <PhoneIcon sx={{ color: '#0B2E4C' }} fontSize="small" />
                                    <HeadingCommon title={organizer?.number} weight={400} baseSize="16px" />
                                </Stack>
                            </Stack>
                        </Box>
                    }

                    {/* User Review */}
                    <Box
                        mt={3}
                        sx={{
                            p: { xs: 2, sm: 3 },
                            backgroundColor: '#f0f0f0',
                            borderRadius: 3,
                            maxWidth: '100%',
                        }}
                    >
                        <HeadingCommon variant="h6" title="Participant Reviews & Experiences" weight={500} baseSize="26px" />

                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Overall Rating:{' '}
                            <Box component="span" sx={{ color: '#f4b400', fontWeight: 600 }}>
                                4.8/5
                            </Box>{' '}
                            (Based on 250 reviews)
                        </Typography>

                        <Box sx={{ p: { xs: 1, md: 3 } }}>
                            <Stack direction="row" spacing={2} flexWrap="wrap" mb={3}>
                                {tabs.map((label, index) => (
                                    <Button
                                        key={label}
                                        onClick={() => setTab(index)}
                                        sx={{
                                            flex: { sm: "1 1 auto", md: 'unset' },
                                            backgroundColor: tab === index ? '#0B2E4C' : '#ccc',
                                            color: tab === index ? '#fff' : '#000',
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontSize: '0.9rem',
                                            px: 2,
                                            py: 1,
                                            minWidth: 100,
                                            '&:hover': {
                                                color: 'black',
                                                backgroundColor: tab === index ? '#0B2E4C' : '#bbb',
                                            },
                                        }}
                                    >
                                        {label}
                                    </Button>
                                ))}
                            </Stack>

                            <Box mb={2}>
                                <Typography>
                                    Showing <strong>{tabs[tab]}</strong> content...
                                </Typography>
                            </Box>
                        </Box>

                        {/* Review List */}
                        <Box display="flex" flexDirection="column" gap={2}>
                            {filteredReviews.map((review, index) => (
                                <Paper
                                    key={index}
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor: '#fff',
                                    }}
                                >
                                    <HeadingCommon variant="subtitle1" title={review.name} weight={500} baseSize="16px" />

                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        sx={{ color: '#f4b400', fontSize: '14px' }}
                                    >
                                        {Array.from({ length: review.rating }).map((_, i) => (
                                            <StarIcon key={i} fontSize="small" />
                                        ))}

                                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                                            ({review.rating}/5)
                                        </Typography>
                                    </Box>
                                    <HeadingCommon variant="caption" color="#C9C9C9" title={review.date} weight={400} baseSize="14px" mt={0.5} />
                                    <HeadingCommon variant="body2" title={review.comment} weight={400} baseSize="14px" mt={0.5} />

                                </Paper>
                            ))}
                        </Box>

                        <Box mt={3} textAlign="center">
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    backgroundColor: '#0B2E4C',
                                    color: '#fff',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    mt: 2,
                                    '&:hover': {
                                        backgroundColor: '#08304c',
                                    },
                                }}
                            >
                                Leave a review
                            </Button>
                        </Box>
                    </Box>

                    {/* Schedule */}
                    <HeadingCommon variant="h6" mt={3} title="Event Schedule" weight={500} baseSize="26px" />

                    <Stack spacing={1.5}>
                        {[
                            { time: '8:00 PM', title: 'Doors Open' },
                            { time: '9:00 PM', title: 'Main Artist Performance' },
                            { time: '11:00 PM', title: 'DJ Set & After Party' },
                        ].map((item, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    backgroundColor: '#f5f5f5',
                                    p: 1.5,
                                    borderRadius: 1.5,
                                }}
                            >
                                <HeadingCommon title={item.time} weight={600} baseSize="18px" />
                                <HeadingCommon color="#B3B3B3" title={item.title} weight={400} baseSize="18px" />
                            </Box>
                        ))}
                    </Stack>

                    {
                        Object.keys(tickets).length === 0 ? null :
                            <Box sx={{ mx: 'auto', mt: 4 }}>
                                {/* Section Title */}
                                <HeadingCommon title=" Available Tickets" weight={500} baseSize="26px" />

                                {/* Responsive Table */}
                                <MusicFestivalTable headers={musicFestivalTableHeaders} data={tickets} type="1" />

                                {/* Book Now Button */}
                                <Box mt={3}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#0B2E4C',
                                            borderRadius: 2.5,
                                            px: 1,
                                            py: 1.5,
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            '&:hover': {
                                                backgroundColor: '#1565C0',
                                            },
                                        }}
                                    >
                                        Book Now
                                    </Button>
                                </Box>
                            </Box>
                    }

                </CardContent>
            </Card>
        </Box>
    )
}