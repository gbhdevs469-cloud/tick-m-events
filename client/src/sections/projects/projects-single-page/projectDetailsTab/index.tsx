import { Typography, Stack, Chip, Divider } from "@mui/material";

export function ProjectDetailsTab({ _project }: any) {
    return (
        <>
            {/* Project Details */}
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Project Details
            </Typography>
            <Typography variant="body2" color="gray" mb={2}>
                {_project?.orgBudget} XAF
            </Typography>
            <Typography variant="body2" mb={2}
                dangerouslySetInnerHTML={{ __html: _project?.orgRequirement }}
            />
            {/* {}
            </Typography> */}
            <Typography variant="body2" mb={2}>
                {_project?.orgAdditionalRequirement}
            </Typography>

            <Divider sx={{ my: 2, borderColor: "#334155" }} />

            {/* Skills */}
            <Typography fontWeight="bold" mb={1}>
                Categories Required
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
                <Chip key={_project?.subcategoryName} label={_project?.subcategoryName} variant="outlined" sx={{ borderColor: "#475569" }} />
                <Chip key={_project?.categoryId?.name} label={_project?.categoryId?.name} variant="outlined" sx={{ borderColor: "#475569" }} />
            </Stack>
        </>
    )
}