import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Stack,
  } from '@mui/material';
  
export function TicketingAndTransactionsSupervisionTable ({
    headers,
    data,
    emptyMessage = 'No data available',
    statusFilter = '',
    actionButtons = [],
    roundedCorners = true,
    showDivider = true,
  }:any){
    const isEmpty = data.length === 0;
  
    return (
      <Table sx={{ backgroundColor: '#f8f9fa', borderRadius: roundedCorners ? 2 : 0 }}>
        <TableHead>
          <TableRow>
            {headers.map((header:any, index:any) => (
              <TableCell
                key={header.key || header}
                align="center"
                sx={{
                  bgcolor: '#1F8FCD',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  borderTopLeftRadius: roundedCorners && index === 0 ? '20px' : 0,
                  borderTopRightRadius: roundedCorners && index === headers.length - 1 ? '20px' : 0,
                }}
              >
                {header.label || header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
  
        <TableBody>
          {isEmpty ? (
            <TableRow
              sx={{
                backgroundColor: '#EEEEEE',
                position: 'relative',
                ...(showDivider && {
                  '&:not(:last-child)': {
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '96%',
                      borderBottom: '1px solid #C3C3C3',
                    },
                  },
                }),
              }}
            >
              <TableCell
                colSpan={headers.length}
                align="center"
                sx={{
                  py: 2,
                  fontWeight: 500,
                  color: 'Black',
                  ...(roundedCorners && {
                    borderBottomLeftRadius: '20px',
                    borderBottomRightRadius: '20px',
                  }),
                }}
              >
                {emptyMessage}{statusFilter ? ` with status: ${statusFilter}` : ''}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row:any, index:any) => {
              const isLastRow = index === data.length - 1;
              return (
                <TableRow
                  key={row.id || index}
                  sx={{
                    backgroundColor: '#EEEEEE',
                    position: 'relative',
                    ...(showDivider && {
                      '&:not(:last-child)': {
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '96%',
                          borderBottom: '1px solid #C3C3C3',
                        },
                      },
                    }),
                  }}
                >
                  {headers.map((header:any, headerIndex:any) => {
                    const headerKey = header.key || header;
                    const cellValue = row[headerKey];
                    const isFirstCell = headerIndex === 0;
                    const isLastCell = headerIndex === headers.length - 1;
                    const isStatusCell = headerKey === 'status';
                    const hasActions = isLastCell && actionButtons.length > 0;
  
                    if (hasActions) {
                      return (
                        <TableCell
                          key={`actions-${index}`}
                          align="center"
                          sx={{
                            ...(roundedCorners && {
                              borderBottomRightRadius: isLastRow ? '20px' : 0,
                            }),
                            width: actionButtons.length > 2 ? '41%' : '25%',
                          }}
                        >
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1}
                            justifyContent="center"
                            alignItems="center"
                          >
                            {actionButtons.map((button:any) => (
                              <Button
                                key={button.label}
                                variant="contained"
                                size="small"
                                onClick={() => button.onClick(row)}
                                sx={{
                                  bgcolor: '#0e2a47',
                                  '&:hover': { bgcolor: '#0c223b' },
                                  width: { xs: '100%', sm: 'auto' },
                                }}
                              >
                                {button.label}
                              </Button>
                            ))}
                          </Stack>
                        </TableCell>
                      );
                    }
  
                    return (
                      <TableCell
                        key={`${headerKey}-${index}`}
                        align="center"
                        sx={{
                          ...(roundedCorners && {
                            ...(isFirstCell && {
                              borderBottomLeftRadius: isLastRow ? '20px' : 0,
                            }),
                            ...(isLastCell && {
                              borderBottomRightRadius: isLastRow ? '20px' : 0,
                            }),
                          }),
                          ...(isStatusCell && {
                            fontWeight: 600,
                            color:
                              cellValue === 'Successful' || cellValue === 'Approved'
                                ? 'green'
                                : cellValue === 'Pending' || cellValue === 'Under Review'
                                  ? 'orange'
                                  : cellValue === 'Cancelled' || cellValue === 'Blocked'
                                    ? 'red'
                                    : 'inherit',
                          }),
                        }}
                      >
                        {cellValue}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    );
  };