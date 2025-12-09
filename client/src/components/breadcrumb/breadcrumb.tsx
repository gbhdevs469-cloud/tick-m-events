import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { formatEventDate, formatTimeTo12Hour } from "src/hooks/formate-time";
import { HeadingCommon } from '../multiple-responsive-heading/heading';

export function Breadcrumb({ eventName, date, time }: any) {
    return (
        <Box sx={{ m: 1 }}>
            {/* Breadcrumb line */}
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/">
                    Home
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    href="/material-ui/getting-started/installation/"
                >
                    Our Events
                </Link>
                <HeadingCommon
                    title={eventName}
                    color="#0C2E4E"
                    weight={700}
                    baseSize="15px"
                    mb={0}
                />
            </Breadcrumbs>

            {/* Date below breadcrumb */}
            <HeadingCommon
                color="#0C2E4E"
                title={`${formatEventDate(date)} | ${formatTimeTo12Hour(time)}`}
                weight={400}
                baseSize="16px"
                mt={1}
            />
        </Box>
    );
}