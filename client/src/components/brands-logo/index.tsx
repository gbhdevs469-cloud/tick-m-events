import {
    Box,
    Typography,
    Paper,
} from '@mui/material';

export function PromotionLogoBar({ brands, mainHead, subHead }: any) {
    return (
        brands.length > 0 && (
            <Box>
                {/* BRANDS SECTION */}
                <Box textAlign="center" mt={8}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {mainHead}
                    </Typography>
                    {/* <Typography color="textSecondary" gutterBottom>
                        {subHead}
                    </Typography> */}

                    {/* Marquee Container */}
                    <Box
                        sx={{
                            position: 'relative',
                            overflow: 'hidden',
                            width: '100%',
                            py: 3,
                            '&::before, &::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                width: '100px',
                                height: '100%',
                                zIndex: 2,
                            },
                            '&::before': {
                                left: 0,
                                background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
                            },
                            '&::after': {
                                right: 0,
                                background: 'linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
                            }
                        }}
                    >
                        {/* Marquee Content */}
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 3,
                                animation: 'marquee 20s linear infinite',
                                '&:hover': {
                                    animationPlayState: 'paused',
                                },
                                '@keyframes marquee': {
                                    '0%': {
                                        transform: 'translateX(100%)', // Start from right (off-screen)
                                    },
                                    '100%': {
                                        transform: 'translateX(-100%)', // Move to left (off-screen)
                                    }
                                }
                            }}
                        >
                            {/* First set of logos */}
                            {brands?.map((item: any, index: number) => (
                                <Paper
                                    key={`first-${item._id || item.name || index}`}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        minWidth: 120,
                                        flexShrink: 0,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                        }
                                    }}
                                >
                                    <Box
                                        component={item.link ? 'a' : 'div'}
                                        href={item.link || undefined}
                                        target={item.link ? '_blank' : undefined}
                                        rel={item.link ? 'noopener noreferrer' : undefined}
                                        sx={{
                                            display: 'block',
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            '&:hover': {
                                                textDecoration: 'none',
                                            }
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={item.image?.url || item.img}
                                            alt={item.name}
                                            sx={{
                                                width: 100,
                                                height: 60,
                                                objectFit: 'contain',
                                                mb: 1
                                            }}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                        <Typography
                                            variant="caption"
                                            component="div"
                                            sx={{
                                                fontWeight: 'medium',
                                                textAlign: 'center',
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {item.name}
                                        </Typography>
                                    </Box>
                                </Paper>
                            ))}

                            {/* Second set of logos (duplicate for seamless loop) */}
                            {/* {brands?.map((item: any, index: number) => (
                                <Paper
                                    key={`second-${item._id || item.name || index}`}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        minWidth: 120,
                                        flexShrink: 0,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                        }
                                    }}
                                >
                                    <Box
                                        component={item.link ? 'a' : 'div'}
                                        href={item.link || undefined}
                                        target={item.link ? '_blank' : undefined}
                                        rel={item.link ? 'noopener noreferrer' : undefined}
                                        sx={{
                                            display: 'block',
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            '&:hover': {
                                                textDecoration: 'none',
                                            }
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={item.image?.url || item.img}
                                            alt={item.name}
                                            sx={{
                                                width: 100,
                                                height: 60,
                                                objectFit: 'contain',
                                                mb: 1
                                            }}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                        <Typography
                                            variant="caption"
                                            component="div"
                                            sx={{
                                                fontWeight: 'medium',
                                                textAlign: 'center',
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {item.name}
                                        </Typography>
                                    </Box>
                                </Paper>
                            ))} */}
                        </Box>
                    </Box>
                </Box>
            </Box>
        )
    )
}