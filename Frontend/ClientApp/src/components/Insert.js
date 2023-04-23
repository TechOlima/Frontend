import React, { Component } from 'react';
import { Button } from 'reactstrap';
import settings from './settings.json';

export class Insert extends Component {
    static displayName = Insert.name;

  constructor(props) {
    super(props);
    this.state = { inserts: [], loading: true };
  }

  componentDidMount() {
      this.populateInsertData();
  }

  static renderInsertTable(inserts) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th></th>
            <th>Продукт</th>
            <th>Вес</th>
            <th>Тип камня</th>            
          </tr>
        </thead>
        <tbody>
          {inserts.map(insert =>
              <tr key={insert.insertID}>
                  <td>
                      <Button
                          color="info"
                          size="sm"
                          disabled
                      >
                          Изменить
                      </Button>
                      <Button
                          color="danger"
                          size="sm"
                          disabled
                      >
                          Удалить
                      </Button>

                  </td>
                  <td>{insert.product.name}</td>
                  <td>{insert.weight}</td>
                  <td>{insert.stoneType.name}</td>                  
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
        ? <p><em>Загрузка...</em></p>
        : Insert.renderInsertTable(this.state.inserts);

    return (
      <div>
            <h1 id="tabelLabel" >Вставки</h1>
            <button className="btn btn-primary" disabled onClick={this.incrementCounter}>Добавить вставку</button>
        {contents}
      </div>
    );
  }

    async populateInsertData() {        
        const response = await fetch(settings.apiurl + '/Inserts');
        const data = await response.json();
        this.setState({ inserts: data, loading: false });
  }
}
