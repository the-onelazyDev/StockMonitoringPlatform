import { makeStyles } from '@material-ui/core/styles';

export const useSharedStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  tableRow: {
    backgroundColor: '#f5f5f5',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
  tableCell: {
    color: '#333333',
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
  },
  button: {
    backgroundColor: '#4caf50',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#388e3c',
    },
  },
  lsvContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  symbolName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  lsv: {
    fontSize: '0.9rem',
  },
});