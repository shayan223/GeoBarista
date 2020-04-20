//Example code from: https://material-ui.com/components/dialogs/#full-screen-dialogs
import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

import { initLocStorage, getLocStorage, thumbnails, geojson } from '../Tools/initLocStorage';

/* for development purposes
Remove:
<Button color="inherit" onClick={initLocStorage(true)}>
default settings
</Button>

not useful outside development, probably -> to discuss in future
*/

export default function ComLineOptions(props) {
    const {classes, optionsMenuOpen, getTextToDisplay, toggleOptionsMenu, saveData, handleThumbnails, handleGeoJSON, forceStateRefresh} = props;

    return (
        <Dialog fullScreen={true} open={optionsMenuOpen} onClose={toggleOptionsMenu(false)}>
<AppBar className={classes.appBarOptions}>
        <Toolbar>
        <IconButton edge="start" color="inherit" onClick={toggleOptionsMenu(false)}>
<CloseIcon/>
    </IconButton>
    <Button id="reset" color="inherit" onClick={() => initLocStorage(true) && forceStateRefresh()}>
    Reset Settings
    </Button>
    <div className={classes.grow}/>
    <Button color="inherit" onClick={saveData}>
        save
        </Button>
        </Toolbar>
        </AppBar>
        <List>
        <ListItem>
        <ListItemText primary={getTextToDisplay(thumbnails)}/>
    </ListItem>
    <ListItem>
    <TextField id="thumbnails" fullWidth label={getLocStorage(thumbnails)} onChange={handleThumbnails} variant="filled"/>
        </ListItem>
        <Divider/>
        <ListItem>
        <ListItemText primary={getTextToDisplay(geojson)}/>
    </ListItem>
    <ListItem>
    <TextField id="geojson" fullWidth label={getLocStorage(geojson)} onChange={handleGeoJSON} variant="filled"/>
        </ListItem>
        </List>
        </Dialog>
)
}