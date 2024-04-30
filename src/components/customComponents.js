import { 
    Paper,
    Button, 
    styled
} from '@mui/material';

export const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 
        /* Dark Theme */
        '#1A2027' 
        :
        /* Light Theme */
        // '#76b5c5' // tourqise
        // '#eeeee4' // sand
        '#CFD6D9'
    ,
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    padding: theme.spacing(2),
    textAlign: 'center',
    width: '100%',
    height: '100%'
}));

export const UploadButton = styled(Button)({
    backgroundColor: 'lightgrey',
    color: 'white',
    fontWeight: 'bold',
    '&:hover': {
        backgroundColor: 'darkorange',
    },
});

export const SaveButton = styled(Button)({
    backgroundColor: 'green',
    color: 'white',
    fontWeight: 'bold',
    '&:hover': {
        backgroundColor: 'darkgreen',
    },
});