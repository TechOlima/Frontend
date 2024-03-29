import React, { Component } from 'react';
import { Button, Input, Row, Nav, NavItem, NavLink, TabContent, TabPane, Col, Modal, ModalBody, ModalHeader, ModalFooter, Form, FormGroup, Label } from 'reactstrap';
import { Card, CardHeader, CardBody, Alert, FormFeedback } from 'reactstrap';
import settings from './settings.json';
import MaskedInput from 'react-maskedinput'

export class Order extends Component {
    static displayName = Order.name;

  constructor(props) {
    super(props);
      this.state = {
          orders: [],
          storages: [],
          products: [],
          loading: true,
          activeTab: "1",
          searchPattern: "",
          showModal: false,          
          activeOrder: null,
          successMessage: null,
          errorMessage: null,
          //переменные для добавления товаров в заказ
          newProductID: null,
          newProductName: null,
          newProductPrice: null,
          newProductQuantity: null,
          newProductSum: null,
          newProductSuccessMessage: null,
          newProductErrorMessage: null,
          autorize: false,
          token: null,
          incorrectEmail: false,
          states:[]
      };
      this.toggleModal = this.toggleModal.bind(this);
      this.editOrder = this.editOrder.bind(this);
      this.renderOrderTable = this.renderOrderTable.bind(this);
      this.changeActiveOrder = this.changeActiveOrder.bind(this);
      this.getActiveOrder = this.getActiveOrder.bind(this);
      this.saveActiveOrderChanges = this.saveActiveOrderChanges.bind(this);
      this.deleteActiveOrder = this.deleteActiveOrder.bind(this);      
      this.standingAdress = this.standingAdress.bind(this);
      this.orderChangeState = this.orderChangeState.bind(this);
      this.populateProductData = this.populateProductData.bind(this);      
      this.addProductInOrder = this.addProductInOrder.bind(this);
      this.deleteProductFromOrder = this.deleteProductFromOrder.bind(this);
      this.populateStateData = this.populateStateData.bind(this);
    }
    getCookie(name) {
        let matches = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    async deleteProductFromOrder(order_ProductID, index) {
        if (order_ProductID) {
            const response = await fetch(settings.apiurl + '/Order_Product/' + order_ProductID, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + this.state.token,
                    'Content-Type': 'application/json;',
                    'accept': 'text/plain'
                },
            });
            if (response.ok) {
                const response = await fetch(settings.apiurl + '/Orders/' + this.state.activeOrder.orderID);
                const data = await response.json();
                this.setState({
                    newProductSuccessMessage: 'Данные успешно удалены',
                    newProductErrorMessage: null,
                    activeOrder:
                        this.getActiveOrder(data)
                },
                    () => {
                        this.populateOrderData();
                    });
            }
            else this.setState({ errorMessage: 'Произошла ошибка при удалении', successMessage: null });
        }
        else {
            if (index > -1) {
                let activeOrder = this.state.activeOrder;
                activeOrder.orderProducts.splice(index, 1);
                this.setState({ activeOrder: activeOrder });
            }
        }
    }

    async addProductInOrder() {
        
        let productInOrder = {
            productID: this.state.newProductID,
            orderID: this.state.activeOrder.orderID,
            quantity: this.state.newProductQuantity,
            productName: this.state.newProductName,
            salePrice: this.state.newProductPrice,
            totalSum: this.state.newProductSum
        };

        if (this.state.activeOrder.orderID) {
            const response = await fetch(settings.apiurl + '/Order_Product/', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + this.state.token,
                    'Content-Type': 'application/json;',
                    'accept': 'text/plain'
                },
                body: JSON.stringify(productInOrder)
            });
            if (response.ok) {
                const response = await fetch(settings.apiurl + '/Orders/' + this.state.activeOrder.orderID);
                const data = await response.json();
                this.setState({
                    newProductSuccessMessage: 'Данные успешно сохранены',
                    newProductErrorMessage: null,
                    activeOrder:
                        this.getActiveOrder(data)
                },
                    () => {
                        this.populateOrderData();
                    });
            }
            else this.setState({ newProductErrorMessage: 'Произошла ошибка при сохранении', newProductSuccessMessage: null });
        }
        else {
            let activeOrder = this.state.activeOrder;
            activeOrder.orderProducts.push(productInOrder);
            this.setState({ activeOrder: activeOrder });            
        }
    }

    async orderChangeState(newstate) {
        let activeOrder = this.getActiveOrder(this.state.activeOrder);
        const response = await fetch(settings.apiurl + '/Orders/' + this.state.activeOrder.orderID + '?state=' + newstate, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + this.state.token,
                'Content-Type': 'application/json;',
                'accept': 'text/plain'
            },
        });
        if (response.ok) {
            let message = activeOrder.smsNotification === true || activeOrder.emailNotification === true ? "Клиенту отправлены уведомления." : "";
            this.setState({ successMessage: 'Статус заказа изменен. ' + message, errorMessage: null });
            this.populateOrderData();
            //обновляем данные по заказу
            const response = await fetch(settings.apiurl + '/Orders/' + activeOrder.orderID);
            const data = await response.json();
            activeOrder = this.getActiveOrder(data);
            this.setState({
                activeOrder: activeOrder
            });
            //console.log(activeOrder)
        }
        else this.setState({ errorMessage: 'Произошла ошибка при изменении статуса заказа', successMessage: null });
    }    
    async standingAdress() {
        const response = await fetch(settings.mkr_service_url + '/DadataAdress/ClearAddress?adress=' + this.state.activeOrder?.deliveryAddress);
        if (response.ok) {            
            const data = await response.json();
            //заполняет данные в заказе по адресу
            let order = this.state.activeOrder;
            order.deliveryAddressStd = data.result;
            order.streetWithType = data.streetWithType;
            order.house = data.house;
            order.block = data.block;
            order.entrance = data.entrance;
            order.floor = data.floor;
            order.flat = data.flat;
            order.qc = data.qc;
            let message = data.qcDescription;
            this.setState({ activeOrder: order, successMessage: order.qc === "0" ? message : "", errorMessage: order.qc !== "0" ? message : "" });
        }
        else this.setState({ errorMessage: 'Произошла ошибка при распознавании адреса', successMessage: null });
    }

    toggleModal() {
        let newmodal = !this.state.showModal;
        this.setState({ showModal: newmodal });
    }
    getActiveOrder(order) {
        return {
            orderID: order ? order.orderID : null,
            clientName: order ? order.clientName ? order.clientName : "" : "",
            clientPhone: order ? order.clientPhone ? order.clientPhone : "" : "",
            clientEmail: order ? order.clientEmail ? order.clientEmail : "" : "",
            state: order ? order.state : "",
            totalSum: order ? order.totalSum ? order.totalSum : "" : "",
            deliveryAddress: order ? order.deliveryAddress ? order.deliveryAddress : "" : "",
            deliveryDate: order ? order.deliveryDate ? order.deliveryDate : "" : "",
            orderDate: order ? order.orderDate ? order.orderDate : "" : "",
            note: order ? order.note ? order.note : "" : "",
            orderProducts: order ? order.orderProducts ? order.orderProducts : [] : [],
            //стандартизированный адрес
            deliveryAddressStd: order?.deliveryAddressStd ? order.deliveryAddressStd : "",
            streetWithType: order?.streetWithType ? order.streetWithType : "",
            house: order?.house ? order.house : "",
            block: order?.block ? order.block : "",
            entrance: order?.entrance ? order.entrance : "",
            floor: order?.floor ? order.floor : "",
            flat: order?.flat ? order.flat : "",
            qc: order?.qc ? order.qc : "",
            emailNotification: order ? order.emailNotification !== null ? order.emailNotification : false : false,
            smsNotification: order ? order.smsNotification !== null ? order.smsNotification : false : false,
        };
    }

    async saveActiveOrderChanges() {
        let activeOrder = this.getActiveOrder(this.state.activeOrder);
        
        const response = await fetch(this.state.activeOrder.orderID ? (settings.apiurl + '/Orders/' + this.state.activeOrder.orderID) : (settings.apiurl + '/Orders/'), {
            method: this.state.activeOrder.orderID ? 'PUT' : 'POST',
            headers: {
                'Authorization': 'Bearer ' + this.state.token,
                'Content-Type': 'application/json;',
                'accept': 'text/plain'
            },
            body: JSON.stringify(activeOrder)
        });
        if (response.ok) {
            if (this.state.activeOrder.orderID !== null) {
                this.setState({ successMessage: 'Данные успешно сохранены', errorMessage: null });
            }
            else {
                const data = await response.json();
                this.setState({ activeOrder: this.getActiveOrder(data), successMessage: 'Данные успешно сохранены', errorMessage: null });
            }
            this.populateOrderData();
        }
        else this.setState({ errorMessage: 'Произошла ошибка при сохранении', successMessage: null });

    }
    async deleteActiveOrder() {
        const response = await fetch(settings.apiurl + '/Orders/' + this.state.activeOrder.orderID, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + this.state.token,
                'Content-Type': 'application/json;',
                'accept': 'text/plain'
            },
        });
        if (response.ok) {
            this.setState({ activeOrder: this.getActiveOrder(), successMessage: 'Данные успешно удалены', errorMessage: null }, () => {
                this.populateOrderData();
            });
        }
        else this.setState({ errorMessage: 'Произошла ошибка при удалении', successMessage: null });
    }

    

    componentDidMount() {
        this.populateOrderData();
        this.populateProductData();
        this.populateStateData();
        if (this.getCookie("token")) this.setState({ token: this.getCookie("token"), autorize: true });
        //$('#clientPhone').mask('+7 (999) 999-99-99');
    }
    async editOrder(orderID) {
        const response = await fetch(settings.apiurl + '/Orders/' + orderID);
        const data = await response.json();
        this.setState({
            activeOrder: this.getActiveOrder(data),
            successMessage: null,
            errorMessage: null,
            storageSuccessMessage: null,
            storageErrorMessage: null
        }, () => {
            this.toggleModal();
        });
    }
    changeActiveOrder(value, propertie) {
        
        let changedOrder = this.state.activeOrder;
        changedOrder[propertie] = value;        
        this.setState({ activeOrder: changedOrder });
        if (propertie === 'clientEmail') {
            //let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let re = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i;
            this.setState({ incorrectEmail: !re.test(value) });
        }
    }

    renderModal() {
        const orderID = this.state.activeOrder ? this.state.activeOrder.orderID ? this.state.activeOrder.orderID : null : null;
        //определяем статус в который можно перевести заказ
        let currentState = this.state.states.filter(i => i.name === this.state.activeOrder?.state)[0];
        let maxStateId = this.state.states[this.state.states.length - 1]?.stateID;
        let newState = this.state.states.filter(i => i.stateID > currentState?.stateID && i.stateID < maxStateId)[0];
        //console.log(currentState, newState);

        return (
            <div>
                <Modal isOpen={this.state.showModal} size={orderID ? 'xl' : 'lg'} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Карточка заказа</ModalHeader>
                    <ModalBody>
                        {this.state.successMessage ?
                            <Alert color="success">
                                {this.state.successMessage}
                            </Alert>
                            : ''}
                        {this.state.errorMessage ?
                            <Alert color="danger">
                                {this.state.errorMessage}
                            </Alert>
                            : ''}
                        <Form>                            
                            <Row>
                                <Col md={orderID ? 4 : 6}>
                                    <Card>
                                        <CardHeader>Клиент</CardHeader>
                                        <CardBody>
                                        <FormGroup>
                                                <Label for="clientName">
                                                ФИО
                                            </Label>
                                            <Input
                                                    id="clientName"
                                                    name="clientName"
                                                    value={this.state.activeOrder ? this.state.activeOrder.clientName : ''}
                                                onChange={(ev) => {
                                                    this.changeActiveOrder(ev.target.value, 'clientName');
                                                }}
                                            >
                                            </Input>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="clientPhone">
                                                    Телефон
                                                </Label>
                                                <MaskedInput autoComplete='off'
                                                    className="form-control"
                                                    mask="+7 (111)-111-11-11"
                                                    id="clientPhone"
                                                    name="clientPhone"
                                                    size="20"
                                                    value={this.state.activeOrder ? this.state.activeOrder.clientPhone : ''}
                                                    onChange={(ev) => {
                                                        this.changeActiveOrder(ev.target.value, 'clientPhone');
                                                    }}
                                                />
                                            </FormGroup>
                                            <FormGroup check>
                                                <Input type="checkbox"
                                                    checked={this.state.activeOrder ? this.state.activeOrder.smsNotification : false}
                                                onChange={(ev) => {
                                                    this.changeActiveOrder(ev.target.checked, 'smsNotification');
                                                }}/>
                                                {' '}
                                                <Label check>
                                                    Уведомлять по телефону
                                                </Label>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="clientEmail">
                                                    Email
                                                </Label>
                                                <Input
                                                    invalid={this.state.incorrectEmail}
                                                    id="clientEmail"
                                                    name="clientEmail"
                                                    type="email"
                                                    value={this.state.activeOrder ? this.state.activeOrder.clientEmail : ''}
                                                    onChange={(ev) => {
                                                        this.changeActiveOrder(ev.target.value, 'clientEmail');
                                                    }}
                                                >
                                                </Input>
                                                {
                                                    this.state.incorrectEmail ?
                                                        <FormFeedback>
                                                            Некорректный адрес электронной почты!
                                                        </FormFeedback> : ''
                                                }                                                
                                            </FormGroup>
                                            <FormGroup check>
                                                <Input type="checkbox" checked={this.state.activeOrder ? this.state.activeOrder.emailNotification : false}                                                    
                                                    onChange={(ev) => {                                                        
                                                        this.changeActiveOrder(ev.target.checked, 'emailNotification');
                                                    }}/>
                                                {' '}
                                                <Label check>
                                                    Уведомлять по email
                                                </Label>
                                            </FormGroup>
                                        </CardBody>
                                    </Card>                                    
                                </Col>
                                <Col md={orderID ? 4 : 6}>
                                    <Card>
                                        <CardHeader>Доставка</CardHeader>
                                        <CardBody>
                                            <FormGroup>
                                                <Label for="deliveryAddress">
                                                    Адрес
                                                </Label>
                                                <Input
                                                    id="deliveryAddress"
                                                    name="deliveryAddress"
                                                    type='textarea'
                                                    bsSize="lg"
                                                    value={this.state.activeOrder ? this.state.activeOrder.deliveryAddress : ''}
                                                    onChange={(ev) => {
                                                        this.changeActiveOrder(ev.target.value, 'deliveryAddress');
                                                    }}
                                                >
                                                </Input>
                                                <Button className="mt-2" onClick={this.standingAdress}>Стандартизировать</Button>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="deliveryDate">
                                                    Дата
                                                </Label>
                                                <Input
                                                    id="deliveryDate"
                                                    name="deliveryDate"
                                                    type='datetime-local'
                                                    value={this.state.activeOrder ? this.state.activeOrder.deliveryDate : ''}
                                                    onChange={(ev) => {
                                                        this.changeActiveOrder(ev.target.value, 'deliveryDate');
                                                    }}
                                                >
                                                </Input>
                                            </FormGroup>                                            
                                        </CardBody>
                                    </Card>
                                </Col>
                                {orderID ? <Col md={3}>
                                    <FormGroup>
                                        <Label for="orderID">
                                            Номер
                                        </Label>
                                        <Input
                                            id="orderID"
                                            name="orderID"
                                            plaintext
                                            placeholder=""
                                            defaultValue={this.state.activeOrder ? this.state.activeOrder.orderID : ''}                                            
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="state">
                                            Статус 
                                        </Label><br/>
                                        <Label for="state">
                                            <b>{this.state.activeOrder ? this.state.activeOrder.state : ''}</b>
                                        </Label> 
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="totalSum">
                                            Сумма
                                        </Label>
                                        <Input
                                            id="totalSum"
                                            name="totalSum"
                                            plaintext
                                            placeholder=""
                                            defaultValue={this.state.activeOrder ? this.state.activeOrder.totalSum : ''}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="orderDate">
                                            Дата создания
                                        </Label>
                                        <Input
                                            id="orderDate"
                                            name="orderDate"
                                            plaintext
                                            placeholder=""
                                            defaultValue={this.state.activeOrder ? this.state.activeOrder.orderDate : ''}
                                        />
                                    </FormGroup>
                                </Col> : ''}                                
                            </Row>
                            {
                                this.state.activeOrder?.deliveryAddressStd ?
                                    <Card
                                        className="my-2"
                                        style={{
                                            width: '100%'
                                        }}
                                    >
                                        <CardHeader>
                                            <b>Стандартизированный адрес</b>
                                        </CardHeader>
                                        <CardBody> 
                                                <Row>
                                                <Col md={12}>
                                                    <FormGroup>
                                                        <Label>
                                                            Стандартизированный адрес
                                                        </Label>
                                                        <Input
                                                            type='textarea'
                                                            plaintext
                                                            defaultValue={this.state.activeOrder ? this.state.activeOrder.deliveryAddressStd : ''}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                    <Col md={2}>
                                                    <FormGroup>
                                                        <Label>
                                                            Улица
                                                        </Label>
                                                        <Input
                                                            plaintext
                                                            type='textarea'
                                                            defaultValue={this.state.activeOrder ? this.state.activeOrder.streetWithType : ''}
                                                        />
                                                    </FormGroup>
                                                    </Col>
                                                    <Col md={2}>
                                                    <FormGroup>
                                                        <Label>
                                                            Дом
                                                        </Label>
                                                        <Input
                                                            plaintext
                                                            defaultValue={this.state.activeOrder ? this.state.activeOrder.house : ''}
                                                        />
                                                    </FormGroup>
                                                    </Col>                                            
                                                <Col md={2}>
                                                    <FormGroup>
                                                        <Label>
                                                            Корпус
                                                        </Label>
                                                        <Input
                                                            plaintext
                                                            defaultValue={this.state.activeOrder ? this.state.activeOrder.block : ''}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={2}>
                                                    <FormGroup>
                                                        <Label>
                                                            Подьезд
                                                        </Label>
                                                        <Input
                                                            plaintext
                                                            defaultValue={this.state.activeOrder ? this.state.activeOrder.entrance : ''}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={2}>
                                                    <FormGroup>
                                                        <Label>
                                                            Этаж
                                                        </Label>
                                                        <Input
                                                            plaintext
                                                            defaultValue={this.state.activeOrder ? this.state.activeOrder.floor : ''}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={2}>
                                                    <FormGroup>
                                                        <Label>
                                                            Квартира
                                                        </Label>
                                                        <Input
                                                            plaintext
                                                            defaultValue={this.state.activeOrder ? this.state.activeOrder.flat : ''}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card> : ""
                            }                            
                                    <Card
                                        className="my-2"
                                        style={{
                                            width: '100%'
                                        }}
                                    >
                                        <CardHeader>
                                            <b>Товары</b>
                                        </CardHeader>
                                        <CardBody>
                                            {this.state.newProductSuccessMessage ?
                                                <Alert color="success">
                                                    {this.state.newProductSuccessMessage}
                                                </Alert>
                                                : ''}
                                            {this.state.newProductErrorMessage ?
                                                <Alert color="danger">
                                                    {this.state.newProductErrorMessage}
                                                </Alert>
                                                : ''}
                                            {
                                                this.state.activeOrder?.orderProducts?.length > 0 ?
                                                    <Row>
                                                        <Col md={4}>
                                                            <Label>
                                                                Товар
                                                            </Label>
                                                        </Col>
                                                        <Col md={2}>
                                                            <Label>
                                                                Цена
                                                            </Label>
                                                        </Col>
                                                        <Col md={2}>
                                                            <Label>
                                                                Количество
                                                            </Label>
                                                        </Col>
                                                        <Col md={2}>
                                                            <Label>
                                                                Сумма
                                                            </Label>
                                                        </Col>
                                                    </Row> : ""
                                            }
                                    {this.state.activeOrder?.orderProducts?.map((orderProduct, index) =>
                                                <Row key={index}>
                                                    <Col md={4}>
                                                        <Input
                                                            id="orderProductName"
                                                            name="orderProductName"
                                                            plaintext
                                                            defaultValue={orderProduct.productName}
                                                        />
                                                    </Col>
                                                    <Col md={2}>
                                                        <Input
                                                            id="orderProductPrice"
                                                            name="orderProductPrice"
                                                            plaintext
                                                            defaultValue={orderProduct.salePrice}
                                                        />
                                                    </Col>
                                                    <Col md={2}>
                                                        <Input
                                                            id="orderProductquantity"
                                                            name="orderProductquantity"
                                                            plaintext
                                                            defaultValue={orderProduct.quantity}
                                                        />
                                                    </Col>
                                                    <Col md={2}>
                                                        <Input
                                                            id="orderProducttotalSum"
                                                            name="orderProducttotalSum"
                                                            plaintext
                                                            defaultValue={orderProduct.totalSum
}
                                                        />
                                                    </Col>
                                                    <Col md={2}>
                                                        <Button
                                                            color="danger"
                                                            size="sm"
                                                            onClick={() => { this.deleteProductFromOrder(orderProduct.order_ProductID, index) }}
                                                        >
                                                            Удалить
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            )}
                                            <Row className="mt-2">
                                                <Col md={6}>
                                                    <Input
                                                        id="newProductID"
                                                        name="newProductID"
                                                        value={this.state.newProductID ? this.state.newProductID : ''}
                                                        type='select'
                                                        onChange={(ev) => {
                                                            let product = this.state.products.filter(i => String(i.productID) === String(ev.target.value))[0];
                                                            //let newProductPrice = product.salePrice;
                                                            //console.log(newProductPrice);
                                                            this.setState({
                                                                newProductID: ev.target.value,
                                                                newProductPrice: product.salePrice,
                                                                newProductName: product.name
                                                            });
                                                        }}
                                                    >
                                                        <option value={null}>
                                                            Не выбран
                                                        </option>
                                                        {this.state.products.map(product =>
                                                            <option value={product.productID} key={product.productID}>
                                                                {product.name}-{product.salePrice} руб.
                                                            </option>
                                                        )}
                                                    </Input>
                                                </Col>
                                                <Col md={2}>
                                                    <Input
                                                        id="newProductQuantity"
                                                        name="newProductQuantity"
                                                        value={this.state.newProductQuantity ? this.state.newProductQuantity : ''}
                                                        onChange={(ev) => {
                                                            let newProductSum = parseFloat(ev.target.value) * parseFloat(this.state.newProductPrice);                                                            
                                                            this.setState({
                                                                newProductQuantity: ev.target.value,
                                                                newProductSum: newProductSum
                                                            });                                                            
                                                        }}
                                                        type="number"
                                                    >                                                        
                                                    </Input>
                                                </Col>
                                                <Col md={2}>
                                                    <Input
                                                        id="newProductID"
                                                        name="newProductID"
                                                        defaultValue={this.state.newProductSum ? this.state.newProductSum : ''}
                                                        plaintext
                                                    >
                                                    </Input>
                                                </Col>
                                                <Col md={2}>
                                                    <Button
                                                        color="primary"
                                                        size="sm"
                                                        onClick={() => { this.addProductInOrder() }}
                                                    >
                                                        Добавить
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>            
                            <FormGroup>
                                <Label for="note">
                                    Примечание
                                </Label>
                                <Input
                                    id="note"
                                    name="note"
                                    type="textarea"
                                    value={this.state.activeOrder ? this.state.activeOrder.note : ""}
                                    onChange={(ev) => {
                                        this.changeActiveOrder(ev.target.value, 'note');
                                    }}
                                />
                            </FormGroup> 
                        </Form>                        
                    </ModalBody>
                    <ModalFooter>
                        {this.state.activeOrder ? this.state.activeOrder.orderID ?
                            <div>
                                {newState ?
                                    <Button onClick={() => this.orderChangeState(newState.name)}>
                                        Перевести в статус - {newState.name}
                                </Button> : '' }
                                {' '}
                                {this.state.activeOrder.state !== 'Доставлен' && this.state.activeOrder.state !== 'Отменен' ?
                                    <Button onClick={() => this.orderChangeState('Отменен')}>
                                        Отменить заказ
                                </Button> : ''}
                                {' '}
                                <Button color="danger" onClick={this.deleteActiveOrder}>
                                    Удалить
                                </Button>
                            </div>
                         : '' : ''}
                        {' '}
                        {this.state.activeOrder && this.state.activeOrder.orderProducts.length > 0 ?
                            <Button color="secondary" onClick={this.saveActiveOrderChanges}>
                                Сохранить
                            </Button> : ''}
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

    renderOrderTable(orders) {
        return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
                <th></th>
                <th>Номер</th>
                <th>Статус</th>
                <th>ФИО клиента</th>
                <th>Телефон</th>
                <th>Адрес</th>
                <th>Товары</th>
                <th>Сумма</th>
                <th>Примечание</th>            
          </tr>
        </thead>
        <tbody>
                { orders?.map(order =>
                    <tr key={order.orderID}>
                        <td>
                            {this.state.autorize ?
                                <Button
                                    color="primary"
                                    size="sm"
                                    onClick={() => { this.editOrder(order.orderID) }}
                                >
                                    Изменить
                                </Button> : ''}
                        </td>
                        <td>{order.orderID}</td>
                        <td>{order.state}</td>
                        <td>{order.clientName}</td>
                        <td>{order.clientPhone}</td>
                        <td>{order.deliveryAddress}</td>
                        <td><ul>{order.orderProducts?.map(
                            orderProduct =>
                                <li key={orderProduct.order_ProductID}>{orderProduct.productName + '-' + orderProduct.quantity}</li>
                        )}</ul></td>
                        <td>{order.totalSum}</td>
                        <td>{order.note}</td>
                        
            </tr>
          )}
        </tbody>
      </table>
    );
  }

    render() {
        const actualStates = ['Создан','Оформлен','Собран','В доставке'];

      let contentsActual = this.state.loading
          ? <p><em>Загрузка...</em></p>
          : this.renderOrderTable(this.state.orders.filter(i => actualStates.includes(i.state)));

      let contentsAll = this.state.loading
          ? <p><em>Загрузка...</em></p>
          : this.renderOrderTable(this.state.orders);

      let modal = this.renderModal();
      return (
          <div>
              <h1 id="tabelLabel" >Заказы</h1>
              {!this.state.autorize ? <Alert color="info">
                  Для выполнения операций необходимо авторизоваться. Нажмите кнопку Войти.
              </Alert> : ''}
              {this.state.autorize ?
                  <div style={{ textAlign: 'right' }}>
                      <button className="btn btn-primary" onClick={() => {
                          this.setState({ activeOrder: this.getActiveOrder(), successMessage: null, errorMessage: null }, () => {
                              this.toggleModal();
                          });
                      }}>Создать</button></div> : ''}
              <div className="row gy-1">
                  <Row className="gy-2"><Col sm="12"><Input onKeyDown={(ev) => {
                      if (ev.keyCode === 13) {
                          this.setState({ searchPattern: ev.target.value }, () => { this.populateOrderData() })                          
                      }
                  }} placeholder='Введите текст для поиска' /></Col></Row>
              </div>
              <br />
              <Nav tabs >
                  <NavItem>
                      <NavLink className={this.state.activeTab === "1" ? "active" : ""} onClick={() => this.setState({ activeTab: "1" })}>Активные</NavLink>
                  </NavItem>
                  <NavItem>
                      <NavLink className={this.state.activeTab === "2" ? "active" : ""} onClick={() => this.setState({ activeTab: "2" })}>Все</NavLink>
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
                              {contentsAll}
                          </Col>
                      </Row>
                  </TabPane>
              </TabContent>
              {modal}
          </div>
      );
  }

    async populateOrderData() {
        const response = await fetch(settings.apiurl + '/Orders' + (this.state.searchPattern ? '?SearchPattern=' + this.state.searchPattern : ''));
        const data = await response.json();
        this.setState({ orders: data, loading: false });
    }
    async populateProductData() {
        const response = await fetch(settings.apiurl + '/Products?SearchPattern=' + this.state.searchPattern);
        const data = await response.json();
        this.setState({ products: data, loading: false });
    }
    async populateStateData() {
        const response = await fetch(settings.apiurl + '/States');
        const data = await response.json();
        this.setState({ states: data, loading: false });
    }
}
