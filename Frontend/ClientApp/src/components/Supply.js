import React, { Component } from 'react';
import { Button, Input, Row, Nav, NavItem, NavLink, TabContent, TabPane, Col, Modal, ModalBody, ModalHeader, ModalFooter, Form, FormGroup, Label } from 'reactstrap';
import { Card, CardHeader, CardBody, Alert } from 'reactstrap';
import settings from './settings.json';

export class Supply extends Component {
    static displayName = Supply.name;

    constructor(props) {
        super(props);
        this.state = {
            supplies: [],
            products: [],
            loading: true,
            activeTab: "1",
            dateToSearch: null,
            dateFromSearch: null,
            showModal: false,
            activeSupply: null,
            successMessage: null,
            errorMessage: null,
            storageSuccessMessage: null,
            storageErrorMessage: null,
            productID: '',
            purchasePrice: 0,
            salePrice: 0
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.editSupply = this.editSupply.bind(this);
        this.renderSupplyTable = this.renderSupplyTable.bind(this);
        this.changeActiveSupply = this.changeActiveSupply.bind(this);
        this.getActiveSupple = this.getActiveSupply.bind(this);
        this.saveActiveSupplyChanges = this.saveActiveSupplyChanges.bind(this);
        this.deleteActiveSupply = this.deleteActiveSupply.bind(this);
        this.addStorageInSupply = this.addStorageInSupply.bind(this);
        this.deleteStorageFromSupply = this.deleteStorageFromSupply.bind(this);
        this.populateProducts = this.populateProducts.bind(this);
        this.populateSuppliesData = this.populateSuppliesData.bind(this);
    }
    toggleModal() {
        let newmodal = !this.state.showModal;
        this.setState({ showModal: newmodal });
    }
    getActiveSupply(supply) {
        return {
            supplyID: supply ? supply.supplyID : null,
            productCount: supply ? supply.productCount ? supply.productCount : "" : "",
            totalSum: supply ? supply.totalSum ? supply.totalSum : "" : "",
            shippingDate: supply ? supply.shippingDate ? supply.shippingDate : "" : "",
            receivingDate: supply ? supply.receivingDate ? supply.receivingDate : null : null,
            isReceived: supply ? supply.isReceived ? supply.isReceived : false : false,
            note: supply ? supply.note ? supply.note : "" : "",
            storages: supply ? supply.storages ? supply.storages : [] : []
        };
    }

    async saveActiveSupplyChanges() {
        let activeSupply = this.state.activeSupply;

        const response = await fetch(this.state.activeSupply.supplyID ? (settings.apiurl + '/Supplies/' + this.state.activeSupply.supplyID) : (settings.apiurl + '/Supplies/'), {
            method: this.state.activeSupply.supplyID ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json;',
                'accept': 'text/plain'
            },
            body: JSON.stringify(activeSupply)
        });
        if (response.ok) {
            if (this.state.activeSupply.supplyID !== null) {
                this.setState({ successMessage: 'Данные успешно сохранены', errorMessage: null });                
            }
            else {
                const data = await response.json();
                this.setState({ activeSupply: this.getActiveSupply(data), successMessage: 'Данные успешно сохранены', errorMessage: null });
            }
            this.populateSuppliesData();
        }
        else this.setState({ errorMessage: 'Произошла ошибка при сохранении', successMessage: null });
    }
    async deleteActiveSupply() {
        const response = await fetch(settings.apiurl + '/Supplies/' + this.state.activeSupply.supplyID, {
            method: 'DELETE',
        });
        if (response.ok) {
            this.setState({ activeSupply: this.getActiveSupply(), successMessage: 'Данные успешно удалены', errorMessage: null }, () => {
                this.populateSuppliesData();
            });
        }
        else this.setState({ errorMessage: 'Произошла ошибка при удалении', successMessage: null });
    }
    async addStorageInSupply() {
        console.log(this.state.activeSupply);
        let postStorage = {            
            productID: this.state.productID,
            supplyID: this.state.activeSupply.supplyID,
            purchasePrice: this.state.purchasePrice,
            salePrice: this.state.salePrice
        };
        const response = await fetch(settings.apiurl + '/Storages/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;',
                'accept': 'text/plain'
            },
            body: JSON.stringify(postStorage)
        });
        if (response.ok) {
            const response = await fetch(settings.apiurl + '/Supplies/' + this.state.activeSupply.supplyID);
            const data = await response.json();
            this.setState({
                storageSuccessMessage: 'Данные успешно сохранены',
                storageErrorMessage: null,
                activeSupply:
                    this.getActiveSupply(data)
            },
                () => {
                    this.populateSuppliesData();                    
                });
        }
        else this.setState({ storageErrorMessage: 'Произошла ошибка при сохранении', storageSuccessMessage: null });
    }

    async deleteStorageFromSupply(storage) {
        const response = await fetch(settings.apiurl + '/Storages/' + storage.storageID, {
            method: 'DELETE',
        });
        if (response.ok) {
            const response = await fetch(settings.apiurl + '/Supplies/' + this.state.activeSupply.supplyID);
            const data = await response.json();
            this.setState({
                SuccessMessage: 'Данные успешно сохранены',
                ErrorMessage: null,
                activeSupply:
                    this.getActiveSupply(data)
            },
                () => {
                    this.populateSuppliesData();
                });
        }
        else this.setState({ storageErrorMessage: 'Произошла ошибка при сохранении', storageSuccessMessage: null });
    }

    componentDidMount() {
        this.populateSuppliesData();
        this.populateProducts();
    }
    async editSupply(supplyID) {
        const response = await fetch(settings.apiurl + '/Supplies/' + supplyID);
        const data = await response.json();
        this.setState({
            activeSupply: this.getActiveSupply(data),
            successMessage: null,
            errorMessage: null,
            productSuccessMessage: null,
            productErrorMessage: null
        }, () => {
            this.toggleModal();
        });
    }
    changeActiveSupply(value, propertie) {
        let changedSupply = this.state.activeSupply;
        changedSupply[propertie] = value;
        this.setState({ activeSupply: changedSupply });
    }

    renderModal() {
        const supplyID = this.state.activeSupply ? this.state.activeSupply.supplyID ? this.state.activeSupply.supplyID : null : null;
        return (
            <div>
                <Modal isOpen={this.state.showModal} size={supplyID ? 'lg' : 'xs'} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Карточка поставки</ModalHeader>
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
                                <Col md={12}>
                                    <FormGroup>
                                            <Label for="productCount">
                                                Дата покупки
                                            </Label>
                                            <Input
                                            id="shippingDate"
                                            name="shippingDate"
                                            type='datetime-local'
                                            value={this.state.activeSupply ? this.state.activeSupply.shippingDate : ''}
                                                onChange={(ev) => {
                                                    this.changeActiveSupply(ev.target.value, 'shippingDate');
                                                }}
                                            >
                                            </Input>
                                    </FormGroup>
                                    {
                                        supplyID ? 
                                        <FormGroup>
                                            <Label for="productCount">
                                                Дата получения
                                            </Label>
                                            <Input
                                                    id="receivingDate"
                                                    name="receivingDate"
                                                type='datetime-local'
                                                    value={this.state.activeSupply ? this.state.activeSupply.receivingDate ? this.state.activeSupply.receivingDate : '' : ''}
                                                onChange={(ev) => {
                                                    this.changeActiveSupply(ev.target.value, 'receivingDate');
                                                }}
                                            >
                                            </Input>
                                        </FormGroup> : ''
                                    }
                                    <FormGroup>
                                        <Label for="note">
                                            Примечание
                                        </Label>
                                        <Input
                                            id="note"
                                            name="note"
                                            type='textarea'
                                            value={this.state.activeSupply ? this.state.activeSupply.note : ''}
                                            onChange={(ev) => {
                                                this.changeActiveSupply(ev.target.value, 'note');
                                            }}
                                        >
                                        </Input>
                                    </FormGroup>                                    
                                </Col>     
                            </Row>                            
                            {
                                this.state.activeSupply?.supplyID ?
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
                                            {this.state.storageSuccessMessage ?
                                                <Alert color="success">
                                                    {this.state.storageSuccessMessage}
                                                </Alert>
                                                : ''}
                                            {this.state.storageErrorMessage ?
                                                <Alert color="danger">
                                                    {this.state.storageErrorMessage}
                                                </Alert>
                                                : ''}
                                            {
                                                this.state.activeSupply?.storages?.length > 0 ?
                                                    <Row>
                                                        <Col md={4}>
                                                            <Label>
                                                                Товар
                                                            </Label>
                                                        </Col>
                                                        <Col md={2}>
                                                            <Label>
                                                                Цена покупки
                                                            </Label>
                                                        </Col>
                                                        <Col md={2}>
                                                            <Label>
                                                                Цена продажи
                                                            </Label>
                                                        </Col>
                                                    </Row> : ""
                                            }
                                            {this.state.activeSupply?.storages?.map(storage =>
                                                <Row key={storage.storageID}>
                                                    <Col md={4}>
                                                        <Input
                                                            id="productName"
                                                            name="productName"
                                                            plaintext
                                                            defaultValue={storage.productName}
                                                        />
                                                    </Col>
                                                    <Col md={2}>
                                                        <Input
                                                            id="purchasePrice"
                                                            name="purchasePrice"
                                                            plaintext
                                                            defaultValue={storage.purchasePrice}
                                                        />
                                                    </Col>
                                                    <Col md={2}>
                                                        <Input
                                                            id="salePrice"
                                                            name="salePrice"
                                                            plaintext
                                                            defaultValue={storage.salePrice}
                                                        />
                                                    </Col>
                                                    <Col md={2}>
                                                        <Button
                                                            color="danger"
                                                            size="sm"
                                                            onClick={() => { this.deleteStorageFromSupply(storage) }}
                                                        >
                                                            Удалить
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            )}
                                            <Row className="mt-2">
                                                <Col md={4}>
                                                    <Input
                                                        id="productID"
                                                        name="productID"
                                                        value={this.state.productID}
                                                        type='select'
                                                        onChange={(ev) => {
                                                            this.setState({ productID: ev.target.value });
                                                        }}
                                                    >
                                                        <option disabled value={null}>
                                                            Не выбран
                                                        </option>
                                                        {this.state.products.map(product =>
                                                            <option value={product.productID} key={product.productID}>
                                                                {product.name}
                                                            </option>
                                                        )}
                                                    </Input>
                                                </Col>
                                                <Col md={2}>
                                                    <Input
                                                        id="purchasePrice"
                                                        name="purchasePricee"
                                                        value={this.state.purchasePrice}
                                                        type='number'
                                                        onChange={(ev) => {
                                                            this.setState({ purchasePrice: ev.target.value });
                                                        }}
                                                    >
                                                    </Input>
                                                </Col>
                                                <Col md={2}>
                                                    <Input
                                                        id="salePrice"
                                                        name="salePrice"
                                                        value={this.state.salePrice}
                                                        type='number'
                                                        onChange={(ev) => {
                                                            this.setState({ salePrice: ev.target.value });
                                                        }}
                                                    >
                                                    </Input>
                                                </Col>
                                                <Col md={2}>
                                                    <Button
                                                        color="primary"
                                                        size="sm"
                                                        onClick={() => { this.addStorageInSupply() }}
                                                    >
                                                        Добавить
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card> : ""
                            }
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        {supplyID ? <Button color="danger" onClick={this.deleteActiveSupply}>
                            Удалить
                        </Button> : ''}
                        {' '}
                        <Button color="secondary" onClick={this.saveActiveSupplyChanges}>
                            Сохранить
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

    renderSupplyTable(supplies) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th></th>
                        <th>Количество товара</th>
                        <th>Сумма поставки</th>
                        <th>Товары</th>
                        <th>Дата покупки</th>
                        <th>Дата доставки</th>                        
                        <th>Примечание</th>
                    </tr>
                </thead>
                <tbody>
                    {supplies?.map(supply =>
                        <tr key={supply.supplyID}>
                            <td>
                                <Button
                                    color="primary"
                                    size="sm"
                                    onClick={() => { this.editSupply(supply.supplyID) }}
                                >
                                    Изменить
                                </Button>
                            </td>
                            <td>{supply.productCount}</td>
                            <td>{supply.totalSum}</td>
                            <td><ul>{supply.storages?.map(
                                storage =>
                                    <li key={storage.storageID}>{storage.productName}-{storage.purchasePrice}</li>
                            )}</ul></td>
                            <td>{new Date(supply.shippingDate).toLocaleDateString()}</td>
                            <td>{new Date(supply.receivingDate).toLocaleDateString()}</td>                            
                            <td>{supply.note}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contentsActual = this.state.loading
            ? <p><em>Загрузка...</em></p>
            : this.renderSupplyTable(this.state.supplies?.filter(i => i.isReceived !== true));

        let contentsDone = this.state.loading
            ? <p><em>Загрузка...</em></p>
            : this.renderSupplyTable(this.state.supplies?.filter(i => i.isReceived === true));

        let modal = this.renderModal();
        return (
            <div>
                <h1 id="tabelLabel" >Поставки</h1>
                <div style={{ textAlign: 'right' }}>
                    <button className="btn btn-primary" onClick={() => {
                        this.setState({ activeSupply: this.getActiveSupply(), successMessage: null, errorMessage: null }, () => {
                            this.toggleModal();
                        });
                    }}>Создать</button></div>
                <Row className="mt-2">
                    <Col sm="6">
                        <FormGroup>
                            <Label for="note">
                                От
                            </Label>
                            <Input
                                id="dateFrom"
                                name="dateFrom"
                                type="datetime-local"
                                value={this.state.dateFromSearch ? this.state.dateFromSearch : ''}
                                onChange={(ev) => {
                                    this.setState({ dateFromSearch: ev.target.value });
                                }}
                                onKeyDown={(ev) => {
                                    if (ev.keyCode === 13) {
                                        this.populateSuppliesData();
                                    }
                                }}
                            />
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <Label for="note">
                                До
                            </Label>
                            <Input
                                id="dateTo"
                                name="dateTo"
                                type="datetime-local"
                                value={this.state.dateToSearch ? this.state.dateToSearch : ''}
                                onChange={(ev) => {
                                    this.setState({ dateToSearch: ev.target.value });
                                }}
                                onKeyDown={(ev) => {
                                    if (ev.keyCode === 13) {
                                        this.populateSuppliesData();
                                    }
                                }}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <br />
                <Nav tabs >
                    <NavItem>
                        <NavLink className={this.state.activeTab === "1" ? "active" : ""} onClick={() => this.setState({ activeTab: "1" })}>Активные</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={this.state.activeTab === "2" ? "active" : ""} onClick={() => this.setState({ activeTab: "2" })}>Полученные</NavLink>
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
                                {contentsDone}
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
                {modal}
            </div>
        );
    }

    async populateSuppliesData() {
        const response = await fetch(settings.apiurl + '/Supplies' +
            (this.state.dateFromSearch || this.state.dateToSearch ? '?' : '') +
            (this.state.dateFromSearch ? 'dateFrom=' + this.state.dateFromSearch + '&': '') +
            (this.state.dateToSearch ? 'dateTo=' + this.state.dateToSearch : '')
        );
        const data = await response.json();
        this.setState({ supplies: data, loading: false });
    }
    async populateProducts() {
        const response = await fetch(settings.apiurl + '/Products');
        const data = await response.json();
        this.setState({ products: data });
    }
}
