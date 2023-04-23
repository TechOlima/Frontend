import React, { Component } from 'react';
import { Button } from 'reactstrap';
import settings from './settings.json';

export class Order extends Component {
    static displayName = Order.name;

  constructor(props) {
    super(props);
      this.state = { orders: [], loading: true };
  }

  componentDidMount() {
      this.populateOrderData();
  }

    static renderOrderTable(orders) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th></th>
            <th>Клиент</th>
            <th>Телефон</th>
            <th>Почта</th>
            <th>Статус</th>
            <th>Сумма заказа</th>
            <th>Адрес достаки</th>
            <th>Дата доставки</th>
            <th>Дата заказа</th>
            <th>Примечание</th>
            <th>Продукты в заказе</th>
          </tr>
        </thead>
        <tbody>
                { orders.map(order =>
                    <tr key={order.orderID}>
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
                        <td>{order.clientName}</td>
                        <td>{order.clientPhone}</td>
                        <td>{order.clientEmail}</td>
                        <td>{order.state}</td>
                        <td>{order.totalSum}</td>
                        <td>{order.deliveryAddress}</td>
                        <td>{order.deliveryDate}</td>
                        <td>{order.orderDate}</td>
                        <td>{order.note}</td>
                        <td><ul>{order.order_Products.map(
                            order_product =>
                                <li key={order_product.order_ProductID}>{order_product.product.name}</li>
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
        : Order.renderOrderTable(this.state.orders);

    return (
      <div>
            <h1 id="tabelLabel" >Заказы</h1>
            <button className="btn btn-primary" disabled onClick={this.incrementCounter}>Добавить заказ</button>
        {contents}
      </div>
    );
  }

    async populateOrderData() {
        const response = await fetch(settings.apiurl + '/Orders');
        const data = await response.json();
        this.setState({ orders: data, loading: false });
  }
}
