import { 
    Paper,
    Button, 
    styled
} from '@mui/material';

export const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 
    '#1A2027' 
    : 
    // '#76b5c5' // tourqise
    // '#eeeee4' // sand
    '#CFD6D9'
    ,
    ...theme.typography.body2,
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    alignItems: "stretch"
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