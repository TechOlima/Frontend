import React, { Component } from 'react';
import { Button, Input, Row, Nav, NavItem, NavLink, TabContent, TabPane, Col, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import settings from './settings.json';

export class Product extends Component {
    static displayName = Product.name;

  constructor(props) {
    super(props);
      this.state = {
          products: [],
          loading: true,
          activeTab: "1",
          searchPattern: "",
          showModal: false
      };
      this.toggleModal = this.toggleModal.bind(this);
  }
    toggleModal() {
        let newmodal = !this.state.showModal;
        this.setState({ showModal: newmodal });
    }

  componentDidMount() {
    this.populateProductData();
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

  static renderProductTable(products) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th></th>
            <th>Наименование</th>
            <th>Состав</th>
            <th>Тип</th>
            <th>Материал</th>
            <th>Код производителя</th>            
            <th>Описание</th>
            <th>Пол</th>            
            <th>Размер</th>
          </tr>
        </thead>
        <tbody>
                {products.slice(0, 10).map(product =>
              <tr key={product.productID}>
                  <td>
                      <Button
                          color="primary"
                          size="sm"                          
                      >
                          Изменить
                      </Button>  
                  </td>
                  <td>{product.name}</td>
                  <td>{product.equipment}</td>
                  <td>{product.productType.name}</td>
                  <td>{product.materialType.name}</td>
                  <td>{product.vendorCode}</td>                  
                  <td>{product.description}</td>
                  <td>{product.gender}</td>                  
                  <td>{product.size}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contentsActual = this.state.loading
        ? <p><em>Загрузка...</em></p>
        : Product.renderProductTable(this.state.products.filter(i=> !i.is_Deleted));

      let contentsDeleted = this.state.loading
          ? <p><em>Загрузка...</em></p>
          : Product.renderProductTable(this.state.products.filter(i => i.is_Deleted));

      let modal = this.renderModal();

    return (
      <div>
            <h1 id="tabelLabel" >Товары</h1>
            <div style={{ textAlign: 'right' }}><button className="btn btn-primary" onClick={this.toggleModal}>Создать</button></div>
            <div className="row gy-1">
                <Row className="gy-2"><Col sm="12"><Input onKeyDown={(ev) => {
                    if (ev.keyCode === 13) {
                        this.setState({ searchPattern: ev.target.value }, () => { this.populateProductData()})
                        //return false;
                    }
                }} placeholder='Введите текст для поиска' /></Col></Row>
            </div>
            <br />            
            <Nav tabs >
                <NavItem>
                    <NavLink className={this.state.activeTab === "1" ? "active" : ""} onClick={() => this.setState({ activeTab: "1" })}>Актуальные</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className={this.state.activeTab === "2" ? "active" : ""} onClick={() => this.setState({ activeTab: "2" })}>Архив</NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                    <Row>
                        <Col sm="12">
                            {contentsActual}
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="2">
                    <Row>
                        <Col sm="12">
                            {contentsDeleted}
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
            {modal}
      </div>
    );
  }

    async populateProductData() {
        const response = await fetch(settings.apiurl + '/Products?SearchPattern=' + this.state.searchPattern);
        const data = await response.json();
        this.setState({ products: data, loading: false });
  }
}
