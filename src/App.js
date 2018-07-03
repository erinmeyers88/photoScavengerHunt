import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import PhotoCamera from 'material-ui/svg-icons/image/photo-camera';
import {Link, browserHistory} from 'react-router';

import * as firebase from 'firebase';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();


const config = {
    apiKey: "AIzaSyBZMyUStWE4bTgWGCueL8H1cAJ36c_-N5g",
    authDomain: "guestbook-be612.firebaseapp.com",
    databaseURL: "https://guestbook-be612.firebaseio.com",
    storageBucket: "guestbook-be612.appspot.com",
    messagingSenderId: "385301875545"
};

firebase.initializeApp(config);

const storage = firebase.storage();

const images = storage.ref().child('images');

const tasks = firebase.database().ref().child('tasks');

const firebaseConnected = firebase.database().ref('.info/connected');

const customTheme = getMuiTheme({
    palette: {
        primary1Color: '#35CCBA',
        // primary2Color: cyan700,
        // primary3Color: grey400,
        accent1Color: '#5BA4F6',
        // accent2Color: grey100,
        // accent3Color: grey500,
        // textColor: 'white',
        // alternateTextColor: white,
        // canvasColor: white,
        // borderColor: grey300,
        // disabledColor: 'yellow'
        // pickerHeaderColor: cyan500,
        // clockCircleColor: fade(darkBlack, 0.07),
        // shadowColor: fullBlack,
    }
});

class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            firebaseConnected: true,
            drawer: false
        }
    }

    componentDidMount() {
        let self = this;
        firebaseConnected.on("value", function (snap) {
            if (snap.val() === true) {
                self.setState({firebaseConnected: true});
            } else {
                self.setState({firebaseConnected: false});
            }
        });
    }

    addPhoto(team, task, image, location) {
        let upload = images.child(task + ' ' + team).put(image);
        upload.on('state_changed', function (snap) {
        }, function (error) {
        }, function () {
            let newPhoto = {
                task,
                team,
                image: upload.snapshot.downloadURL,
                time: new Date().toISOString(),
                lat: location.coords.latitude,
                lng: location.coords.longitude

            };

            if (firebaseConnected) {
                tasks.push(newPhoto);
            }

        });
    }

    goHome() {
        browserHistory.push('/');
    }

    render() {

        let self = this;
        let children = React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                tasks,
                addPhoto: self.addPhoto,
                images: images,
                firebaseConnected: self.state.firebaseConnected
            });
        });

        return (
            <MuiThemeProvider muiTheme={customTheme}>
                <div style={{height: '100%'}}>
                    <AppBar
                      showMenuIconButton={false}
                        title="Photo Scavenger Hunt"
                        iconElementRight={<div>
                            <Link to="/add"> <IconButton><PhotoCamera/></IconButton></Link>
                        </div>}
                        onTitleTouchTap={this.goHome.bind(this)}
                    />
                    {children}
                </div>
            </MuiThemeProvider>


        );
    }
}

export default App;