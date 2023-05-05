import React, { Component } from 'react';
import { Button } from 'reactstrap';
import settings from './settings.json';

export class Supply extends Component {
    static displayName = Supply.name;

  constructor(props) {
    super(props);
      this.state = { supplies: [], loading: true };
  }

  componentDidMount() {
      this.populateSupplyData();
  }

    static renderSupplyTable(supplies) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th></th>
            <th>Дата покупки</th>
            <th>Дата получения</th>
            <th>Сумма</th>
            <th>Получен</th>
            <th>Примечание</th>
            <th>Продукты в поставке</th>            
          </tr>
        </thead>
        <tbody>
                {supplies.map(supply =>
                    <tr key={supply.supplyID}>
                  <td>
                      <Button
                          color="primary"
                          size="sm"                          
                      >
                          Изменить
                      </Button>  
                  </td>
                        <td>{supply.shippingDate}</td>
                        <td>{supply.receivingDate}</td>                                              
                        <td>{supply.totalSum}</td>
                        <td>{supply.isReveived}</td>                        
                        <td>{supply.note}</td>
                        <td><ul>{supply.supply_Products.map(
                            supply_product =>
                                <li key={supply_product.supply_ProductID}>{supply_product.product.name}</li>
                        )}</ul></td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
        ? <p><em>Loading...</em></p>
        : Supply.renderSupplyTable(this.state.supplies);

    return (
      <div>
            <h1 id="tabelLabel" >Поставки</h1>
            <button className="btn btn-primary" onClick={this.incrementCounter}>Добавить поставку</button>
        {contents}
      </div>
    );
  }

    async populateSupplyData() {
        const response = await fetch(settings.apiurl + '/Supplies');
        const data = await response.json();
        this.setState({ supplies: data, loading: false });
  }
}
