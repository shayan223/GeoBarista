import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import ImageTableBody from './ImageTableBody';
import ImageTableHead from './ImageTableHead';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function ImageTable(props) {
    const {images, selectImageById, setImageVisibleById, openDialog, sortImages} = props;
    const classes = useStyles();
    const columns = [
        {
            id: 'base_name',
            label: 'File Name'
        },
        {
            id: 'file_extension',
            label: 'File Type'
        },
        {
            id: 'mission',
            label: 'Mission'
        },
        {
            id: 'camera',
            label: 'Camera'
        },
        {
            id: 'fov',
            label: 'FOV'
        },
        {
            id: 'lla',
            label: 'LLA'
        },
        {
            id: 'velocity',
            label: 'Velocity'
        },
        {
            id: 'gsd',
            label: 'GSD'
        },
    ]
    return (
    <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
            <ImageTableHead 
                columns={columns}
                images={images} 
                selectImageById={selectImageById} 
                setImageVisibleById={setImageVisibleById}
                openDialog={openDialog}
                sortImages={sortImages}
            />
            <ImageTableBody 
                columns={columns}
                images={images} 
                selectImageById={selectImageById} 
                setImageVisibleById={setImageVisibleById}
            />
        </Table>
    </TableContainer>
    );
}