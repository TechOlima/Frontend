import React, { Component } from 'react';
import {
    CardImg
} from 'reactstrap';
import settings from './settings.json';

export class Photo extends Component {
    static displayName = Photo.name;

  constructor(props) {
    super(props);
      this.state = { photos: [], loading: true };
  }

  componentDidMount() {
      this.populatePhotoData();
  }

    static renderPhotoTable(photos) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>            
            <th>Идентификатор товара</th>
            <th>Фотография</th>
            <th>Url</th>            
          </tr>
        </thead>
        <tbody>
                {photos.map(photo =>
                    <tr key={photo.photoID}>
                        <td>{photo.productID}</td>
                        <td><div style={{ width: 100 }}><CardImg
                            
                            src={photo.photoUrl ? photo.photoUrl : ''}
                        /></div></td>
                        <td>{photo.photoUrl}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
        ? <p><em>Loading...</em></p>
        : Photo.renderPhotoTable(this.state.photos);

    return (
      <div>
            <h1 id="tabelLabel" >Фотографии</h1>            
        {contents}
      </div>
    );
  }

    async populatePhotoData() {        
        const response = await fetch(settings.apiurl + '/Photos');
        const data = await response.json();
        this.setState({ photos: data, loading: false });
  }
}
