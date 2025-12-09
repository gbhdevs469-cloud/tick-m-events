import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
    Box,
    Button,
    Grid,
    Typography,
    TextField,
    Stack,
    Switch,
    Checkbox,
} from '@mui/material';
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { days } from './utills';
import axios from '../../redux/helper/axios'

export function ProviderAvailability() {
    const [availabilityEnabled, setAvailabilityEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [daysAvailability, setDaysAvailability] = useState(
        days.map(day => ({
            name: day,
            available: false,
            allDay: false,
            startTime: '09:00',
            endTime: '17:00'
        }))
    );

    // Fetch availability data when component mounts
    useEffect(() => {
        fetchAvailability();
    }, []);

    // Fetch availability data when toggle is switched on
    useEffect(() => {
        if (availabilityEnabled) {
            fetchAvailability();
        }
    }, [availabilityEnabled]);

    const fetchAvailability = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/availability');
            if (response.status === 200) {
                const data = response.data;

                // Create a map of saved days for quick lookup
                const savedDaysMap = new Map();
                data.days?.forEach((day: any) => {
                    savedDaysMap.set(day.name, day);
                });

                // Update days availability while maintaining order
                const updatedDays = days.map(dayName => {
                    const savedDay = savedDaysMap.get(dayName) || {};
                    return {
                        name: dayName,
                        available: savedDay.available ?? false,
                        allDay: savedDay.allDay ?? false,
                        startTime: savedDay.startTime || '09:00',
                        endTime: savedDay.endTime || '17:00'
                    };
                });

                setDaysAvailability(updatedDays);
            }
        } catch (error) {
            console.error('Error fetching availability:', error);
            toast.error('Failed to load availability settings');
        } finally {
            setLoading(false);
        }
    };

    const handleAvailabilityToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAvailabilityEnabled(event.target.checked);
    };

    const handleDayAvailabilityChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setDaysAvailability(prevDays => {
            const updatedDays = [...prevDays];
            updatedDays[index] = {
                ...updatedDays[index],
                available: event.target.checked,
                // If day is being marked unavailable, also uncheck 24h
                allDay: event.target.checked ? updatedDays[index].allDay : false
            };
            return updatedDays;
        });
    };

    const handleAllDayChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setDaysAvailability(prevDays => {
            const updatedDays = [...prevDays];
            updatedDays[index] = {
                ...updatedDays[index],
                allDay: event.target.checked,
                // Reset times when switching to all day
                startTime: event.target.checked ? '00:00' : updatedDays[index].startTime,
                endTime: event.target.checked ? '23:59' : updatedDays[index].endTime
            };
            return updatedDays;
        });
    };

    const handleTimeChange = (index: number, field: 'startTime' | 'endTime') => (event: React.ChangeEvent<HTMLInputElement>) => {
        setDaysAvailability(prevDays => {
            const updatedDays = [...prevDays];
            updatedDays[index] = {
                ...updatedDays[index],
                [field]: event.target.value || '00:00' // Default value if empty
            };

            // Validate time range
            if (field === 'startTime' && updatedDays[index].endTime < event.target.value) {
                updatedDays[index].endTime = event.target.value;
            } else if (field === 'endTime' && updatedDays[index].startTime > event.target.value) {
                updatedDays[index].startTime = event.target.value;
            }

            return updatedDays;
        });
    };

    const handleSubmit = async () => {
        const body = JSON.stringify({
            availabilityEnabled,
            days: daysAvailability
        })
        try {
            const response = await axios.post('/availability', body);
            if (response.status === 200) {
                toast.success(response.data.message);
                setAvailabilityEnabled(false)
                // Show success message
            } else {
                toast.error('Error saving availability');
                // Show error message
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Box
            mt={3}
            sx={{
                borderRadius: '20px',
                border: '1px solid #00000066',
                background: '#FFFFFF',
                p: 3,
            }}
        >
            {/* Availability Settings Header */}
            <Box
                sx={{
                    borderRadius: '20px',
                    border: '1px solid #00000066',
                    backgroundColor: '#FFFFFF',
                    p: 2,
                    mb: 3,
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 0 }}>
                            Availability Settings
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    backgroundColor: availabilityEnabled ? 'green' : 'red',
                                }}
                            />
                            <Typography variant="body2">
                                {availabilityEnabled ? 'Available' : 'Unavailable'}
                            </Typography>
                        </Stack>
                    </Box>

                    <Switch
                        checked={availabilityEnabled}
                        onChange={handleAvailabilityToggle}
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#0B2E4C',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#0B2E4C',
                            },
                        }}
                    />
                </Stack>
            </Box>

            {/* Manage Availability - Only shown when toggle is on */}
            {availabilityEnabled && (
                <Box
                    sx={{
                        borderRadius: '20px',
                        border: '1px solid #00000066',
                        backgroundColor: '#FFFFFF',
                        p: { xs: 2, sm: 3 },
                        mb: 3,
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                        Manage Your Availability
                    </Typography>

                    <Typography variant="body2" color="#D9D9D9" sx={{ mb: 3 }}>
                        Click on dates to mark as unavailable.
                    </Typography>

                    <Grid container spacing={0}>
                        {daysAvailability.map((day, index) => (
                            <Grid item xs={12} key={index}>
                                <Box
                                    sx={{
                                        backgroundColor: '#EEEEEE',
                                        borderRadius: 1.5,
                                        px: 2,
                                        py: 1,
                                        mb: 2,
                                        width: '100%',
                                        ml: { xs: 0, md: 0 },
                                    }}
                                >
                                    <Grid
                                        container
                                        alignItems="center"
                                        spacing={1}
                                        sx={{
                                            flexWrap: { xs: 'wrap', md: 'nowrap' },
                                        }}
                                    >
                                        <Grid item>
                                            <Checkbox
                                                checked={day.available}
                                                onChange={handleDayAvailabilityChange(index)}
                                                sx={{
                                                    mx: 0.5,
                                                    color: 'black',
                                                    '&.Mui-checked': {
                                                        color: 'black',
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3} md={2}>
                                            <Typography sx={{ fontSize: 14 }}>{day.name}</Typography>
                                        </Grid>

                                        <Grid item>
                                            <Checkbox
                                                checked={day.allDay}
                                                onChange={handleAllDayChange(index)}
                                                disabled={!day.available}
                                                sx={{
                                                    mx: 1,
                                                    color: 'black',
                                                    '&.Mui-checked': {
                                                        color: 'black',
                                                    },
                                                }}
                                            />
                                        </Grid>

                                        <Grid item>
                                            <Typography sx={{ fontSize: 14, minWidth: 30 }}>24H</Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={5} md={3}>
                                            <TextField
                                                type="time"
                                                size="small"
                                                fullWidth
                                                value={day.startTime}
                                                onChange={handleTimeChange(index, 'startTime')}
                                                disabled={!day.available || day.allDay}
                                                sx={{
                                                    '& input[type="time"]::-webkit-calendar-picker-indicator': {
                                                        display: 'none',
                                                        WebkitAppearance: 'none',
                                                    },
                                                    '& input[type="time"]': {
                                                        appearance: 'textfield',
                                                        MozAppearance: 'textfield',
                                                    },
                                                    '& .MuiInputBase-root': {
                                                        height: 30,
                                                        backgroundColor: '#fff',
                                                        borderRadius: '6px',
                                                        border: '1px solid #C4C4C4',
                                                        px: 1,
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        border: 'none',
                                                    },
                                                }}
                                                InputLabelProps={{ shrink: true }}
                                                inputProps={{
                                                    style: { padding: '8px 0' },
                                                }}
                                            />
                                        </Grid>

                                        <Grid item>
                                            <Typography sx={{ mx: 1, fontSize: 14 }}>to</Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={5} md={3}>
                                            <TextField
                                                type="time"
                                                size="small"
                                                fullWidth
                                                value={day.endTime}
                                                onChange={handleTimeChange(index, 'endTime')}
                                                disabled={!day.available || day.allDay}
                                                sx={{
                                                    '& input[type="time"]::-webkit-calendar-picker-indicator': {
                                                        display: 'none',
                                                        WebkitAppearance: 'none',
                                                    },
                                                    '& input[type="time"]': {
                                                        appearance: 'textfield',
                                                        MozAppearance: 'textfield',
                                                    },
                                                    '& .MuiInputBase-root': {
                                                        height: 30,
                                                        backgroundColor: '#fff',
                                                        borderRadius: '6px',
                                                        border: '1px solid #C4C4C4',
                                                        px: 1,
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        border: 'none',
                                                    },
                                                }}
                                                InputLabelProps={{ shrink: true }}
                                                inputProps={{
                                                    style: { padding: '8px 0' },
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <Box textAlign="center" mt={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{
                                backgroundColor: '#0B2E4C',
                                textTransform: 'none',
                                fontWeight: 'bold',
                                borderRadius: '14px',
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor: '#0B2E4C',
                                },
                            }}
                        >
                            Save Availability
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    )
}