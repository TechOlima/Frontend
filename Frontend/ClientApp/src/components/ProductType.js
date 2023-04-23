import React, { Component } from 'react';
import { Button } from 'reactstrap';
import settings from './settings.json';

export class ProductType extends Component {
    static displayName = ProductType.name;

  constructor(props) {
    super(props);
      this.state = { productTypes: [], loading: true };
  }

  componentDidMount() {
      this.populateProductTypeData();
  }

    static renderProductTypeTable(productTypes) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th></th>
            <th>Наименование</th>                
          </tr>
        </thead>
        <tbody>
                {productTypes.map(productType =>
                    <tr key={productType.productTypeID}>
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
                        <td>{productType.name}</td>                        
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
        ? <p><em>Loading...</em></p>
        : ProductType.renderProductTypeTable(this.state.productTypes);

    return (
      <div>
            <h1 id="tabelLabel" >Типы товара</h1>
            <button className="btn btn-primary" disabled onClick={this.incrementCounter}>Добавить тип товара</button>
        {contents}
      </div>
    );
  }

    async populateProductTypeData() {
        const response = await fetch(settings.apiurl + '/ProductTypes');
        const data = await response.json();
        this.setState({ productTypes: data, loading: false });
  }
}
