import React, { Component } from 'react';
import { Row, Col, Card, CardTitle, Button, NavLink} from 'reactstrap';
import { Link } from 'react-router-dom';
import settings from './settings.json';


export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            orders: [],
            supplies: [],
            storages: [],
            productsloading: true,
            ordersloading: true,
            suppliesloading: true,
            storagesloading: true,
        };        
    }

    componentDidMount() {
        this.populateData();
    }

    async populateData() {
        //загружаем заказы
        let response = await fetch(settings.apiurl + '/Orders');
        let data = await response.json();
        this.setState({ orders: data, ordersloading: false });
        //загружаем товары
        response = await fetch(settings.apiurl + '/Products');
        data = await response.json();
        this.setState({ products: data, productsloading: false });
        //загружаем поставки
        response = await fetch(settings.apiurl + '/Supplies');
        data = await response.json();
        this.setState({ supplies: data, suppliesloading: false });
        //загружаем склад
        response = await fetch(settings.apiurl + '/Storages');
        data = await response.json();
        this.setState({ storages: data, storagesloading: false });
    }

  render() {
    return (
      <div>
        <h1>Система управления заказами!</h1>
            <Row>
                <Col sm="6">
                    <Card body>
                        <CardTitle tag="h5">
                            Товары
                        </CardTitle>                        
                            {this.state.productsloading ? <em>Загрузка...</em> :
                                <ul>
                                    {this.state.products.slice(0, 5).map(product =>
                                        <li key={product.productID}>
                                            {product.name}
                                        </li>
                                    )}
                                </ul>}                        
                        <Button color="light">
                            <NavLink tag={Link} to="/product">Перейти</NavLink>
                        </Button>
                    </Card>
                </Col>
                <Col sm="6">
                    <Card body>
                        <CardTitle tag="h5">
                            Заказы
                        </CardTitle>
                        
                            {this.state.ordersloading ? <em>Загрузка...</em> :
                                <ul>
                                    {this.state.orders.slice(0, 5).map(order =>
                                        <li key={order.orderID}>
                                            {order.clientName}&nbsp;<b>{order.totalSum} руб.</b>
                                        </li>
                                    )}
                                </ul>}
                        
                        <Button color="light">
                            <NavLink tag={Link} to="/order">Перейти</NavLink>
                        </Button>
                    </Card>
                </Col>
            </Row>
            <br />
            <br />
            <Row>
                <Col sm="6">
                    <Card body>
                        <CardTitle tag="h5">
                            Поставки
                        </CardTitle>
                        
                            {this.state.suppliesloading ? <em>Загрузка...</em> : <ul>
                                {this.state.supplies.slice(0, 5).map(supplу =>
                                    <li key={supplу.supplyID}>
                                        {new Date(supplу.shippingDate).toLocaleDateString()}&nbsp;<b>{supplу.totalSum} руб.</b>
                                    </li>
                                )}
                            </ul>}
                        
                        <Button color="light">
                            <NavLink tag={Link} to="/supply">Перейти</NavLink>
                        </Button>
                    </Card>
                </Col>
                <Col sm="6">
                    <Card body>
                        <CardTitle tag="h5">
                            Склад
                        </CardTitle>
                        
                            {this.state.storageloading ? <em>Загрузка...</em> : 
                                <ul>
                                    {this.state.storages.slice(0, 5).map(storage =>
                                        <li key={storage.storageID}>
                                            {storage.productName}
                                        </li>
                                    )}
                                </ul>}
                        
                        <Button color="light">
                            <NavLink tag={Link} to="/storage">Перейти</NavLink>
                        </Button>
                    </Card>
                </Col>
            </Row>
            
      </div>
    );
  }
}
