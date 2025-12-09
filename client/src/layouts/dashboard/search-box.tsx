import { useState, useEffect, useCallback, memo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { InputBase, Box, IconButton, ListItemText, ListItem, List, Paper, Avatar } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { RootState } from 'src/redux/store';
import { useDebounce } from 'src/hooks/debouning';

interface Event {
  _id: string;
  eventName: string;
  description: string;
  location: string;
  date: string;
  coverImage?: {
    url: string;
  };
}

const SearchResultsItem = memo(({ event, handleResultClick }: { event: Event; handleResultClick: (event: Event) => void }) => (
  <ListItem
    button
    onClick={() => handleResultClick(event)}
    sx={{
      '&:hover': { backgroundColor: 'action.hover' },
      borderBottom: '1px solid',
      borderColor: 'divider',
      py: 1.5,
    }}
  >
    {event.coverImage?.url && (
      <Avatar
        src={event.coverImage.url}
        alt={event.eventName}
        sx={{ width: 50, height: 50, mr: 2 }}
      />
    )}
    <ListItemText
      primary={
        <Box
          sx={{
            color: 'text.primary',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
              color: 'primary.main'
            }
          }}
        >
          {event.eventName}
        </Box>
      }
      primaryTypographyProps={{ fontWeight: 'medium' }}
      secondary={
        <>
          {event.location}
          <Box component="span" mx={1}>•</Box>
          {new Date(event.date).toLocaleDateString()}
        </>
      }
      secondaryTypographyProps={{ variant: 'body2' }}
    />
  </ListItem>
));

const NoResultsFound = memo(() => (
  <ListItem sx={{ py: 2 }}>
    <ListItemText
      primary="No events found"
      primaryTypographyProps={{ color: 'text.secondary', textAlign: 'center' }}
    />
  </ListItem>
));

const SearchEventComponent = () => {
  const { fullData } = useSelector((state: RootState) => state?.event);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleResultClick = useCallback((event: Event) => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearchFocused(false);
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      const results = fullData.filter((event: Event) =>
        event.eventName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm, fullData]);

  return (
    <Box >
      {/* Search Box */}
      <Box
        sx={{
          maxWidth: "250px",
          display: "flex",
          height: "40px",
          alignItems: "center",
          width: "100%",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "8px 12px",
          backgroundColor: "#fff",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <IconButton size="small" sx={{ mr: 1 }}>
          <Iconify icon="eva:search-fill" width={20} height={20} />
        </IconButton>

        <InputBase
          placeholder="Search events..."
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          sx={{
            flex: 1,
            fontSize: "14px",
            color: "#666",
            "&::placeholder": { color: "#bbb" },
          }}
          fullWidth
        />
      </Box>

      {/* Search Results Dropdown */}
      {isSearchFocused && searchTerm && (
        <Paper
          sx={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '50%', // Add this
            transform: 'translateX(-50%)', // Add this
            zIndex: 9999,
            maxHeight: 300,
            width: '100%', // Change from maxWidth to width
            maxWidth: 500, // Keep maxWidth as a constraint
            overflow: 'auto',
            boxShadow: 3,
            borderRadius: '8px',
          }}
        >
          <List>
            {searchResults.length > 0 ? (
              searchResults.map((event) => (
                <Link to={`/our-event/${event._id}`} target='__blank' style={{ textDecoration: "none" }}>
                  <SearchResultsItem
                    key={event._id}
                    event={event}
                    handleResultClick={handleResultClick}
                  />
                </Link>
              ))
            ) : (
              <NoResultsFound />
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export const SearchEvent = memo(SearchEventComponent);