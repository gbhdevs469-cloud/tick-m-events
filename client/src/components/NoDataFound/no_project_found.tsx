import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  SvgIcon
} from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

export function NoDataFound({ message = "No projects found", actionText, onAction }: { 
  message?: string, 
  actionText?: string, 
  onAction?: () => void 
})  {
  return (
    <Paper 
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        textAlign: 'center',
        backgroundColor: 'transparent'
      }}
    >
      <SvgIcon 
        color="disabled" 
        sx={{ 
          fontSize: 64,
          mb: 2 
        }}
      >
        <SentimentDissatisfiedIcon fontSize="inherit" />
      </SvgIcon>
      
      <Typography 
        variant="h6" 
        color="text.secondary"
        gutterBottom
      >
        {message}
      </Typography>
      
      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        There are currently no projects to display.
      </Typography>
      
      {actionText && (
        <Button 
          variant="outlined" 
          onClick={onAction}
          sx={{ mt: 2 }}
        >
          {actionText}
        </Button>
      )}
    </Paper>
  );
};