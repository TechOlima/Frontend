import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import settings from './settings.json';

export class Order extends Component {
    static displayName = Order.name;

  constructor(props) {
    super(props);
      this.state = {
          orders: [],
          loading: true,
          showModal: false
      };
      this.toggleModal = this.toggleModal.bind(this);
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
                          color="primary"
                          size="sm"                          
                      >
                          Изменить
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

    toggleModal() {
        let newmodal = !this.state.showModal;
        this.setState({ showModal: newmodal });
    }

  renderModal() {
      return (
          <div>              
              <Modal isOpen={this.state.showModal} size='lg' toggle={this.toggleModal}>
                  <ModalHeader toggle={this.toggleModal}>Карточка заказа</ModalHeader>
                  <ModalBody>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                      minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                      aliquip ex ea commodo consequat. Duis aute irure dolor in
                      reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est laborum.
                  </ModalBody>
                  <ModalFooter>
                      <Button color="primary" onClick={this.toggleModal}>
                          Do Something
                      </Button>{' '}
                      <Button color="secondary" onClick={this.toggleModal}>
                          Cancel
                      </Button>
                  </ModalFooter>
              </Modal>
          </div>
      );
  }

  render() {
    let contents = this.state.loading
        ? <p><em>Loading...</em></p>
        : Order.renderOrderTable(this.state.orders);

    let modal = this.renderModal();

    return (
      <div>
            <h1 id="tabelLabel" >Заказы</h1>
            <button className="btn btn-primary" onClick={this.toggleModal}>Добавить заказ</button>
            {contents}
            {modal}
      </div>
    );
  }

    async populateOrderData() {
        const response = await fetch(settings.apiurl + '/Orders');
        const data = await response.json();
        this.setState({ orders: data, loading: false });
  }
}
