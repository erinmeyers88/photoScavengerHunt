import React, {Component} from 'react';
import Grid from './Grid';
import muiThemeable from 'material-ui/styles/muiThemeable';

class Home extends Component {

  componentWillMount() {
    this.setState({
      tasks: {
        task1: [],
        task2: [],
        task3: [],
        task4: [],
        task5: []
      },
      task: '',
      team: '',
      imageUploading: false,
      drawer: false
    });
  }

  componentDidMount() {
    let tempList = {
      task1: [],
      task2: [],
      task3: [],
      task4: [],
      task5: []
    };


    if (this.props.firebaseConnected) {
      this.props.tasks.on('value', snap => {
        this.setState({tasks: { task1: [],
          task2: [],
          task3: [],
          task4: [],
          task5: []}}, function () {
          snap.forEach(function (photo) {

            let newPhoto = {
              task: photo.val().task,
              team: photo.val().team,
              image: photo.val().image,
              time: photo.val().time,
              lat: photo.val().lat,
              lng: photo.val().lng,
              key: photo.key,
            };


            if (photo.val().task === 'Task 1') {
              tempList.task1.push(newPhoto);
            }
            if (photo.val().task === 'Task 2') {
              tempList.task2.push(newPhoto);
            }
            if (photo.val().task === 'Task 3') {
              tempList.task3.push(newPhoto);
            }
            if (photo.val().task === 'Task 4') {
              tempList.task4.push(newPhoto);
            }
            if (photo.val().task === 'Task 5') {
              tempList.task5.push(newPhoto);
            }


          });
          this.setState({tasks: tempList}, function () {
            tempList = { task1: [],
              task2: [],
              task3: [],
              task4: [],
              task5: []};
          });

        });

      });
    }
  }

  deletePhoto(key, name) {
    if (this.props.firebaseConnected) {
      this.props.tasks.child(key).remove();
      this.props.images.child(name).delete().then(function () {
        console.log('file deleted');
      });
    }
  }

  setMap(map) {
    this.setState({
      map: map
    });
  }

  zoomMap(item) {
    this.state.map.panTo({lat: item.lat, lng: item.lng});
  }


  render() {
    return (
      <div className="pure-g" style={{height: 'calc(100% - 64px)'}}>
        {/*<Location list={this.state.guestList} setMapOnParent={this.setMap.bind(this)}/>*/}
        <Grid list={this.state.tasks} images={this.props.images}
              deletePhoto={this.deletePhoto.bind(this)}
              zoomMap={this.zoomMap.bind(this)}/>
      </div>
    );
  }
}

export default muiThemeable()(Home);