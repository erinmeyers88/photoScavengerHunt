import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AddPhoto from 'material-ui/svg-icons/image/add-a-photo';
import EXIF from 'exif-js';
import * as _ from 'underscore';
import muiThemeable from 'material-ui/styles/muiThemeable';

class Form extends Component {

  constructor(props, context) {
    super(props, context);
    this.setImage = this.setImage.bind(this);
    this.state = {
      location: null,
      guestList: [],
      task: '',
      team: '',
      time: '',
    }
  }

  componentWillMount() {
    let self = this;
    navigator.geolocation.getCurrentPosition(function (location) {
      self.setState({
        location: location,
        guestList: [],
        task: '',
        team: '',
        time: '',
      });
    });
  }

  componentDidMount() {
    let tempList = [];
    this.props.tasks.on('value', snap => {
      this.setState({guestList: []}, function () {
        snap.forEach(function (newPhoto) {
          tempList.push({
            task: newPhoto.val().task,
            team: newPhoto.val().team,
            image: newPhoto.val().image,
            time: newPhoto.val().time,
            location: newPhoto.val().location,
            key: newPhoto.key,
          });
        });
        this.setState({tasks: tempList}, function () {
          tempList = [];
        });

      });

    });


  }

  setTeam(e, index, value) {
    this.setState({
      team: value
    });
  }

  setTeamCode(e) {
    this.setState({
      teamCode: e.target.value
    });
  }

  setTask(e, index, value) {
    this.setState({
      task: value
    });
  }

  setImage(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        image: file,
        imagePreviewUrl: reader.result
      });
    };

    let tags = [];

    EXIF.getData(file, function () {
      // console.log('data: ', EXIF.getAllTags(this));
      let stuff = EXIF.getAllTags(this);

      _.mapObject(stuff, function (val, key) {
        tags.push({key: key, value: val});
      })
    });

    this.setState({tags: tags});

    reader.readAsDataURL(file)
  }

  handleAddGuest() {
    this.props.addPhoto(this.state.team, this.state.task, this.state.image, this.state.location);
    this.setState({
      task: '',
      team: '',
      time: '',
      image: null,
      imagePreviewUrl: null,
    });
  }

  checkDisabled() {
    let disabled = true;
    if (this.state.team === '' || this.state.teamCode === '' || this.state.task === '' || !this.state.image) {
      disabled = true;
    } else {
      if (this.state.team === 'Team 1' && this.state.teamCode !== 'TechTeam1Code') {
        disabled = true;
      } else if (this.state.team === 'Team 2' && this.state.teamCode !== 'TechTeam2Code') {
        disabled = true;
      } else if (this.state.team === 'Team 3' && this.state.teamCode !== 'TechTeam3Code') {
        disabled = true;
      } else if (this.state.team === 'Team 4' && this.state.teamCode !== 'TechTeam4Code') {
        disabled = true;
      } else if (this.state.team === 'Team 5' && this.state.teamCode !== 'TechTeam5Code') {
        disabled = true;
      } else {
        disabled = false;
      }
    }
    return disabled;
  }

  render() {
    return (
      <div className="pure-g" style={{padding: 20}}>
        <div className="pure-u-1">
          <div style={{
            border: '1px dashed',
            boxSizing: 'border-box',
            backgroundImage: 'url(' + this.state.imagePreviewUrl + ')',
            backgroundSize: 'cover',
            height: '100%'
          }}>
            <FloatingActionButton secondary containerElement="label" label="Choose Image">
              <input style={{display: 'none', imageOrientation: 'from-image'}}
                     onChange={(e) => this.setImage(e)} type="file"
                     id="image"
                     name="image" accept="image/*" capture="camera"/>
              <AddPhoto/>
            </FloatingActionButton>
          </div>

          <div className="pure-u-1" style={{marginBottom: 20,boxSizing: 'border-box'}}>
            <SelectField fullWidth name="team" floatingLabelText="Team"
                         onChange={this.setTeam.bind(this)} value={this.state.team}>
              <MenuItem value="Team 1" primaryText="Team 1" />
              <MenuItem value="Team 2" primaryText="Team 2" />
              <MenuItem value="Team 3" primaryText="Team 3" />
              <MenuItem value="Team 4" primaryText="Team 4" />
              <MenuItem value='Team 5' primaryText="Team 5" />
            </SelectField>
          </div>

          <div className="pure-u-1" style={{marginBottom: 20, boxSizing: 'border-box'}}>
            <TextField fullWidth name="teamCode" floatingLabelText="Team Code"
                       onChange={this.setTeamCode.bind(this)} value={this.state.teamCode}/>
          </div>

          <div className="pure-u-1" style={{marginBottom: 20, boxSizing: 'border-box'}}>
            <SelectField fullWidth name="task" floatingLabelText="Task"
                         onChange={this.setTask.bind(this)} value={this.state.task}>
              <MenuItem value="Task 1" primaryText="Task 1" />
              <MenuItem value="Task 2" primaryText="Task 2" />
              <MenuItem value="Task 3" primaryText="Task 3" />
              <MenuItem value="Task 4" primaryText="Task 4" />
              <MenuItem value="Task 5" primaryText="Task 5" />

            </SelectField>

          </div>
          <div style={{padding: 20, display: 'flex', justifyContent: 'center'}}>
            <RaisedButton label="Add" disabled={this.checkDisabled()}
                          onTouchTap={this.handleAddGuest.bind(this)}/>
          </div>
        </div>

      </div>
    );
  }
}

export default muiThemeable()(Form);
