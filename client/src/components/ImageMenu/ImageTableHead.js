import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

export default function ImageTableHead(props) {
    const {images, selectImageById, openDialog} = props;
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        onChange={((e) => {
                            images.forEach((image) => {
                                selectImageById(image._id, e.target.checked);
                            })
                        })}
                    />
                </TableCell>
                <TableCell>File Path</TableCell>
                <TableCell>Mission</TableCell>
            </TableRow>
        </TableHead>
    )
}