import React, {Component} from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import muiThemeable from 'material-ui/styles/muiThemeable';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import * as _ from 'lodash';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: 450,
    overflowY: 'auto',
  },
};

class List extends Component {

  handleDeletePhoto(key, name) {
    this.props.deletePhoto(key, name);
  }

  renderSection(value, name) {
    return <div key={name} style={{padding: 30}}>
      <Subheader>{name.toUpperCase()}</Subheader>
      <GridList
        cellHeight={180}
        style={styles.gridList}
      >
        {value.map((item, key) => (
          <GridTile
            key={key}
            title={item.team}
            actionIcon={<IconButton
              onClick={() => this.handleDeletePhoto(item.key, item.item + ' ' + item.team)}/>}
          >
            <img role="presentation" src={item.image}/>
          </GridTile>
        ))}
      </GridList>
    </div>
  }

  render() {
    console.log('list', this.props.list);

    let sections = [];

    _.mapKeys(this.props.list, (value, name) => {
      console.log(value, name);
      sections.push(this.renderSection(value, name));
    });


    return (
      <div className="pure-u-1" style={{
        padding: 20,
        backgroundColor: this.props.muiTheme.palette.accent1Color,
        boxSizing: 'border-box',
        height: '100%',
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap :'wrap'
      }}>
        {sections}
      </div>
    );
  }
}

export default muiThemeable()(List);
