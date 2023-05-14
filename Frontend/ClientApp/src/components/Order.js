import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Form, Row, Col, FormGroup,Label,Input } from 'reactstrap';
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
                      <Form>
                          <Row>
                              <Col md={6}>
                                  <FormGroup>
                                      <Label for="exampleEmail">
                                          Email
                                      </Label>
                                      <Input
                                          id="exampleEmail"
                                          name="email"
                                          placeholder="with a placeholder"
                                          type="email"
                                      />
                                  </FormGroup>
                              </Col>
                              <Col md={6}>
                                  <FormGroup>
                                      <Label for="examplePassword">
                                          Password
                                      </Label>
                                      <Input
                                          id="examplePassword"
                                          name="password"
                                          placeholder="password placeholder"
                                          type="password"
                                      />
                                  </FormGroup>
                              </Col>
                          </Row>
                          <FormGroup>
                              <Label for="exampleAddress">
                                  Address
                              </Label>
                              <Input
                                  id="exampleAddress"
                                  name="address"
                                  placeholder="1234 Main St"
                              />
                          </FormGroup>
                          <FormGroup>
                              <Label for="exampleAddress2">
                                  Address 2
                              </Label>
                              <Input
                                  id="exampleAddress2"
                                  name="address2"
                                  placeholder="Apartment, studio, or floor"
                              />
                          </FormGroup>
                          <Row>
                              <Col md={6}>
                                  <FormGroup>
                                      <Label for="exampleCity">
                                          City
                                      </Label>
                                      <Input
                                          id="exampleCity"
                                          name="city"
                                      />
                                  </FormGroup>
                              </Col>
                              <Col md={4}>
                                  <FormGroup>
                                      <Label for="exampleState">
                                          State
                                      </Label>
                                      <Input
                                          id="exampleState"
                                          name="state"
                                      />
                                  </FormGroup>
                              </Col>
                              <Col md={2}>
                                  <FormGroup>
                                      <Label for="exampleZip">
                                          Zip
                                      </Label>
                                      <Input
                                          id="exampleZip"
                                          name="zip"
                                      />
                                  </FormGroup>
                              </Col>
                          </Row>
                          <FormGroup check>
                              <Input
                                  id="exampleCheck"
                                  name="check"
                                  type="checkbox"
                              />
                              <Label
                                  check
                                  for="exampleCheck"
                              >
                                  Check me out
                              </Label>
                          </FormGroup>
                          <Button>
                              Sign in
                          </Button>
                      </Form>
                  </ModalBody>
                  <ModalFooter>
                      <Button color="danger" onClick={this.toggleModal}>
                          Удалить
                      </Button>{' '}
                      <Button color="secondary" onClick={this.toggleModal}>
                          Сохранить
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
