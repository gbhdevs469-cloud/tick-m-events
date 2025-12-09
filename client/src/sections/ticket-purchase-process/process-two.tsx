import { Box, Button, Grid, Paper, TextField, MenuItem, InputAdornment, CircularProgress, Alert } from "@mui/material";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import PhoneInput from 'react-phone-number-input'
import type { E164Number } from 'libphonenumber-js';
import { RootState } from "src/redux/store";
import axios from "axios";
import { HeadProcess } from "./head-process";
import 'react-phone-number-input/style.css'

interface FormData {
  name: string;
  email: string;
  number: string;
  country: string;
  state: string;
  city: string;
  address: string;
  gender: string;
  age: string;
  hearAboutEvent: string;
  eventSpecificInfo: string;
}

export function ProcessTwo({ onOrderDetailsUpdate, onBack, onNext, ticketCount }: any) {
  const { name, email, number, gender } = useSelector((state: RootState) => state.auth.user);
  const [phoneNumber, setPhoneNumber] = useState(number || '');
  const [formTouched, setFormTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string>('');

  const [formData, setFormData] = useState<FormData[]>(
    Array.from({ length: ticketCount }, () => ({
      name: '',
      email: '',
      number: '',
      country: 'Cameroon', // Set Cameroon as default
      state: '',
      city: '',
      address: '',
      gender: '',
      age: '',
      hearAboutEvent: '',
      eventSpecificInfo: ''
    }))
  );

  // 📌 Better API with Promise-based fallbacks
  const fetchCountries = async () => {
    setLoading(true);
    setApiError('');

    const apiEndpoints = [
      {
        name: 'restcountries',
        url: "https://restcountries.com/v3.1/all?fields=name",
        handler: async (url: string) => {
          const response = await axios.get(url);
          return response.data.map((country: any) => country.name.common).sort();
        }
      },
      {
        name: 'countriesnow',
        url: "https://countriesnow.space/api/v0.1/countries",
        handler: async (url: string) => {
          const response = await axios.get(url);
          return response.data.data.map((country: any) => country.country).sort();
        }
      },
      {
        name: 'static',
        url: null,
        handler: async () => [
          "Cameroon", "South Africa", "United States", "United Kingdom", "Canada", "Australia",
          "India", "Germany", "France", "Brazil", "Japan", "China", "Nigeria",
          "Kenya", "Egypt", "Ghana", "Uganda", "Tanzania", "Zimbabwe", "Botswana",
          "Namibia", "Mozambique", "Zambia", "Malawi", "Angola", "Ethiopia"
        ].sort()
      }
    ];

    try {
      const results = await Promise.allSettled(
        apiEndpoints.map(async (endpoint) => {
          try {
            const countryList = await endpoint.handler(endpoint.url as string);
            return { success: true, data: countryList, source: endpoint.name };
          } catch (error) {
            return { success: false, error, source: endpoint.name };
          }
        })
      );

      const successfulResult = results.find(result =>
        result.status === 'fulfilled' &&
        result.value.success &&
        result.value.data.length > 0
      );

      if (successfulResult && successfulResult.status === 'fulfilled') {
        setCountries(successfulResult.value.data);
      } else {
        throw new Error('All country APIs failed');
      }
    } catch (error) {
      setApiError('Failed to load countries. Please refresh the page.');
      // Use static data as final fallback
      setCountries([
        "Cameroon", "South Africa", "United States", "United Kingdom", "Canada", "Australia",
        "India", "Germany", "France", "Brazil", "Japan", "China"
      ].sort());
    } finally {
      setLoading(false);
    }
  };

  // 📌 Fetch states with Promise-based approach
  const fetchStates = useCallback(async (country: string) => {
    if (!country) return;

    setLoading(true);

    const apiHandlers = [
      {
        name: 'countriesnow',
        handler: async () => {
          const response = await axios.post("https://countriesnow.space/api/v0.1/countries/states", { country });
          return response.data.data.states.map((state: any) => state.name);
        }
      },
      {
        name: 'static',
        handler: async () => getStaticStates(country)
      }
    ];

    try {
      const results = await Promise.allSettled(
        apiHandlers.map(async (handler) => {
          try {
            const stateList = await handler.handler();
            return { success: true, data: stateList, source: handler.name };
          } catch (error) {
            return { success: false, error, source: handler.name };
          }
        })
      );

      const successfulResult = results.find(result =>
        result.status === 'fulfilled' &&
        result.value.success &&
        result.value.data.length > 0
      );

      if (successfulResult && successfulResult.status === 'fulfilled') {
        setStates(successfulResult.value.data);
      } else {
        setStates([]);
      }
    } catch (error) {
      setStates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 📌 Fetch cities with Promise-based approach
  const fetchCities = async (country: string, state: string) => {
    if (!country || !state) return;

    setLoading(true);

    const apiHandlers = [
      {
        name: 'countriesnow',
        handler: async () => {
          const response = await axios.post("https://countriesnow.space/api/v0.1/countries/state/cities", { country, state });
          return response.data.data;
        }
      },
      {
        name: 'static',
        handler: async () => getStaticCities(country, state)
      }
    ];

    try {
      const results = await Promise.allSettled(
        apiHandlers.map(async (handler) => {
          try {
            const cityList = await handler.handler();
            return { success: true, data: cityList, source: handler.name };
          } catch (error) {
            return { success: false, error, source: handler.name };
          }
        })
      );

      const successfulResult = results.find(result =>
        result.status === 'fulfilled' &&
        result.value.success &&
        result.value.data.length > 0
      );

      if (successfulResult && successfulResult.status === 'fulfilled') {
        setCities(successfulResult.value.data);
      } else {
        setCities([]);
      }
    } catch (error) {
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  // Static states data for fallback
  const getStaticStates = (country: string): string[] => {
    const stateData: { [key: string]: string[] } = {
      "Cameroon": [
        "Adamawa", "Centre", "East", "Far North", "Littoral",
        "North", "Northwest", "South", "Southwest", "West"
      ],
      "South Africa": [
        "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
        "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"
      ],
      "United States": [
        "California", "Texas", "Florida", "New York", "Illinois"
      ],
      "India": [
        "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Uttar Pradesh"
      ]
    };
    return stateData[country] || [];
  };

  // Static cities data for fallback
  const getStaticCities = (country: string, state: string): string[] => {
    const cityData: { [key: string]: { [key: string]: string[] } } = {
      "Cameroon": {
        "Centre": ["Yaoundé", "Mfou", "Ngoumou", "Obala"],
        "Littoral": ["Douala", "Edéa", "Loum", "Manjo"],
        "West": ["Bafoussam", "Bangangté", "Dschang", "Mbouda"],
        "Southwest": ["Buea", "Limbe", "Kumba", "Muyuka"],
        "Northwest": ["Bamenda", "Kumbo", "Wum", "Ndop"]
      },
      "South Africa": {
        "Gauteng": ["Johannesburg", "Pretoria", "Soweto", "Randburg"],
        "Western Cape": ["Cape Town", "Stellenbosch", "Paarl", "Worcester"],
        "KwaZulu-Natal": ["Durban", "Pietermaritzburg", "Newcastle", "Ladysmith"]
      },
      "United States": {
        "California": ["Los Angeles", "San Francisco", "San Diego", "Sacramento"],
        "Texas": ["Houston", "Dallas", "Austin", "San Antonio"]
      }
    };
    return cityData[country]?.[state] || [];
  };

  const handlePhoneChange = (value: E164Number | undefined) => {
    const phoneValue = value as string;
    setPhoneNumber(phoneValue);
    setFormData(prevData => {
      const updated = [...prevData];
      updated[0] = { ...updated[0], number: phoneValue };
      return updated;
    });
  };

  useEffect(() => {
    fetchCountries();
    // Fetch states for Cameroon when component mounts
    if (formData[0]?.country === 'Cameroon') {
      fetchStates('Cameroon');
    }
  }, [fetchStates, formData]);

  useEffect(() => {
    setFormData(prev => {
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        name: name || '',
        email: email || '',
        number: number || '',
        gender: gender || '',
        country: 'Cameroon' // Ensure Cameroon remains selected
      };
      return updated;
    });
  }, [name, email, number, gender]);

  const handleChange = (index: number, field: keyof FormData, value: string) => {
    setFormData(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });

    if (field === "country") {
      fetchStates(value);
      setStates([]);
      setCities([]);
    }
    if (field === "state") {
      fetchCities(formData[index].country, value);
      setCities([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);

    if (!isFormValid()) return;

    const participants = formData.map(({ name: participantName, age, gender: participantGender }) => ({
      name: participantName,
      age,
      gender: participantGender
    }));

    const orderAddress = {
      email: formData[0].email,
      number: formData[0].number || phoneNumber,
      country: formData[0].country,
      state: formData[0].state,
      city: formData[0].city,
      address: formData[0].address,
      hearAboutEvent: formData[0].hearAboutEvent,
      eventSpecificInfo: formData[0].eventSpecificInfo
    };

    onOrderDetailsUpdate({
      participants,
      orderAddress
    });

    onNext();
  };

  const isFormValid = () => {
    const first = formData[0];
    const requiredAddressFieldsFilled = (
      first.email.trim() &&
      (first.number || phoneNumber) &&
      first.country &&
      first.state &&
      first.city &&
      first.address.trim() &&
      first.hearAboutEvent
    );
    const allParticipantsValid = formData.every(p =>
      p.name.trim() &&
      p.gender
    );
    return requiredAddressFieldsFilled && allParticipantsValid;
  };

  return (
    <Box mt={6}>
      <form onSubmit={handleSubmit}>
        <Paper sx={{ width: "100%", p: 4, boxShadow: 3, borderRadius: 2, position: "relative" }}>
          <HeadProcess title="Participant Details" step="2" />

          {apiError && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}

          <Grid container rowSpacing={2} mt={2}>
            {/* <Grid item xs={12}>
              <Box display="flex" fontWeight="bold">
                <Box width="33%">Full Name *</Box>
                <Box width="33%" pl={1}>Age</Box>
                <Box width="33%" pl={2}>Gender</Box>
              </Box>
            </Grid> */}

            {formData.map((participant, index) => (
              <Grid item xs={12} key={index}>
                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    required
                    name={`name-${index}`}
                    label="Full Name"
                    placeholder="Enter Full Name"
                    value={participant.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    error={formTouched && !participant.name}
                    helperText={formTouched && !participant.name ? 'Name is required' : ''}
                  />
                  <TextField
                    fullWidth
                    name={`age-${index}`}
                    label="Age (optional)"
                    value={participant.age}
                    onChange={(e) => {
                      let value = e.target.value;

                      // Allow only digits max 3 length
                      if (!/^\d{0,3}$/.test(value)) return;

                      // Auto-delete age > 150 (invalid human age)
                      if (Number(value) > 150) {
                        value = value.slice(0, -1); // removes last typed character
                      }

                      handleChange(index, "age", value);
                    }}
                    placeholder="Age"
                    type="text"
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9]*"
                    }}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(
                      formTouched &&
                      participant.age &&
                      (
                        participant.age.length > 3 ||
                        Number(participant.age) > 150
                      )
                    )}
                    helperText={
                      participant.age && participant.age.length > 3
                        ? "Age cannot exceed 3 digits"
                        : participant.age && Number(participant.age) > 150
                          ? "Human age cannot exceed 150 years"
                          : ""
                    }
                    FormHelperTextProps={{
                      sx: { color: "red", fontWeight: "bold" }  // 🔥 Make helper text red
                    }}
                  />
                  <TextField
                    select
                    fullWidth
                    required
                    name={`gender-${index}`}
                    label="Gender"
                    value={participant.gender}
                    onChange={(e) => handleChange(index, 'gender', e.target.value)}
                    SelectProps={{ native: true }}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={formTouched && !participant.gender}
                    helperText={formTouched && !participant.gender ? 'Please Select Gender' : ''}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </TextField>

                </Box>
              </Grid>
            ))}

            <Grid container spacing={3} mt={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  name="email"
                  label="Email"
                  value={formData[0]?.email || ''}
                  onChange={(e) => handleChange(0, 'email', e.target.value)}
                  type="email"
                  variant="outlined"
                  placeholder="Enter your email"
                  sx={fieldStyles}
                  error={formTouched && !formData[0]?.email}
                  helperText={formTouched && !formData[0]?.email ? 'Email is required' : ''}
                />
              </Grid>

              <Grid item xs={12} sx={phoneInputStyles}>
                <TextField
                  fullWidth
                  required
                  name="number"
                  type="text"
                  label="Mobile Number"
                  placeholder="Enter 8 digits (after 6)"
                  value={phoneNumber.startsWith("6") ? phoneNumber.slice(1) : phoneNumber}
                  onChange={(e) => {
                    const input = e.target.value.replace(/^6/, ""); // remove extra 6 if user types it
                    if (/^\d{0,8}$/.test(input)) {
                      const fullNumber = `6${input}`;
                      setPhoneNumber(fullNumber);
                    }
                  }}
                  inputProps={{
                    maxLength: 8,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        6
                      </InputAdornment>
                    ),
                  }}
                  helperText="Number will automatically start with 6 (e.g., 671234567)"
                  InputLabelProps={{ shrink: true }}
                  sx={{ mt: 2 }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  required
                  label={loading ? "Loading countries..." : "Country"}
                  value={formData[0]?.country || 'Cameroon'}
                  onChange={(e) => handleChange(0, "country", e.target.value)}
                  error={formTouched && !formData[0]?.country}
                  helperText={formTouched && !formData[0]?.country ? 'Country is required' : ''}
                  disabled={loading}
                  InputProps={{
                    endAdornment: loading ? <CircularProgress size={20} /> : null,
                  }}
                >
                  <MenuItem value="Cameroon">Cameroon</MenuItem>
                  {countries
                    .filter(country => country !== "Cameroon")
                    .map((country, index) => (
                      <MenuItem key={index} value={country}>{country}</MenuItem>
                    ))
                  }
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  required
                  label={loading ? "Loading states..." : "State"}
                  value={formData[0]?.state || ''}
                  onChange={(e) => handleChange(0, "state", e.target.value)}
                  disabled={!states.length || loading}
                  error={formTouched && !formData[0]?.state}
                  helperText={formTouched && !formData[0]?.state ? 'State is required' : ''}
                >
                  <MenuItem value="">Select State</MenuItem>
                  {states.map((state, index) => (
                    <MenuItem key={index} value={state}>{state}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  required
                  label={loading ? "Loading cities..." : "City"}
                  value={formData[0]?.city || ''}
                  onChange={(e) => handleChange(0, "city", e.target.value)}
                  disabled={!cities.length || loading}
                  error={formTouched && !formData[0]?.city}
                  helperText={formTouched && !formData[0]?.city ? 'City is required' : ''}
                >
                  <MenuItem value="">Select City</MenuItem>
                  {cities.map((city, index) => (
                    <MenuItem key={index} value={city}>{city}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="address"
                  required
                  label="Address"
                  value={formData[0]?.address || ''}
                  onChange={(e) => handleChange(0, 'address', e.target.value)}
                  type="text"
                  variant="outlined"
                  placeholder="Enter your full address"
                  sx={fieldStyles}
                  error={formTouched && !formData[0]?.address}
                  helperText={formTouched && !formData[0]?.address ? 'Address is required' : ''}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  required
                  name="hearAboutEvent"
                  label="How did you hear about the event?"
                  value={formData[0]?.hearAboutEvent || ''}
                  onChange={(e) => handleChange(0, 'hearAboutEvent', e.target.value)}
                  variant="outlined"
                  sx={fieldStyles}
                  error={formTouched && !formData[0]?.hearAboutEvent}
                  helperText={formTouched && !formData[0]?.hearAboutEvent ? 'Please select an option' : ''}
                >
                  <MenuItem value="">Select an option</MenuItem>
                  <MenuItem value="Browsing TICK-M EVENTS">Browsing TICK-M EVENTS</MenuItem>
                  <MenuItem value="Social Media Shares">Social Media Shares</MenuItem>
                  <MenuItem value="Push/Email Notifications">Push/Email Notifications</MenuItem>
                  <MenuItem value="Official Website">Official Website</MenuItem>
                  <MenuItem value="Word of Mouth">Word of Mouth</MenuItem>
                  <MenuItem value="Paid Ads">Paid Ads</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="eventSpecificInfo"
                  value={formData[0]?.eventSpecificInfo || ''}
                  onChange={(e) => handleChange(0, 'eventSpecificInfo', e.target.value)}
                  type="text"
                  variant="outlined"
                  placeholder="Event-specific information (e.g., meal preference)"
                  sx={fieldStyles}
                />
              </Grid>
            </Grid>
          </Grid>

          <Box
            mt={3}
            display="flex"
            justifyContent="center"
            gap={2}
            sx={{
              width: '100%',
              flexDirection: { xs: 'column', sm: 'row' }
            }}
          >
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                py: 1.5,
                bgcolor: '#0B3558',
                '&:hover': {
                  bgcolor: '#0A2D4D',
                  boxShadow: 2
                },
                flex: { sm: 1 }
              }}
              disabled={!isFormValid() || loading}
            >
              {loading ? 'Loading...' : 'Proceed to Payment'}
            </Button>
          </Box>
        </Paper>
      </form>
    </Box>
  );
}

const fieldStyles = {
  backgroundColor: "#fff",
  borderRadius: 1,
  '& .MuiOutlinedInput-root': { borderRadius: 1 },
};

const phoneInputStyles = {
  '& .PhoneInput': {
    width: '100%',
    '& input': {
      width: '100%',
      padding: '16.5px 14px',
      border: '1px solid rgba(0, 0, 0, 0.23)',
      borderRadius: '4px',
      fontFamily: 'inherit',
      fontSize: '1rem',
      '&:hover': {
        borderColor: 'black',
      },
      '&:focus': {
        borderColor: 'black',
        borderWidth: '2px',
        outline: 'none',
      },
    },
    '& .PhoneInputCountry': {
      marginRight: '8px',
    },
    '& .PhoneInputCountrySelect': {
      marginRight: '8px',
    },
  },
  '& .PhoneInput--focus': {
    '& input': {
      borderColor: 'black',
      borderWidth: '2px',
    },
  },
};