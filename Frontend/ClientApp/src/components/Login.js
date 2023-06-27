import React, { Component } from 'react';
import {
    Card, CardHeader, CardBody, FormGroup, Label, Button, CardFooter, Row, Col,
    Input, Alert
} from 'reactstrap';
import settings from './settings.json';

export class Login extends Component {
    static displayName = Login.name;
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            successMessage: null,
            errorMessage: null,
            redirectUrl: null,
            token: null
        };
        this.autorize = this.autorize.bind(this);
    }
    componentDidMount() {        
        //получаем параметр редиректа
        const search = window.location.search;
        const params = new URLSearchParams(search);
        let redirectUrl = params.get('redirectUrl');
        //console.log(code);
        if (redirectUrl !== null) {
            this.setState({ redirectUrl: redirectUrl });            
        }
    }

    async autorize() {
        //делаем запрос на получение токена
        const data = new FormData();
        data.append("username", this.state.login);
        data.append("password", this.state.password);        
        const response = await fetch(settings.identityapiurl + '/OAuth/GetTokenByLogin', {
            method: 'POST',
            body: data
        });
        if (response.ok) {
            const data = await response.text();
            this.setState({ token: data, successMessage: 'Авторизация прошла успешно. Сейчас Вы будете перенаправлены..', errorMessage: null },
                () => {
                    //let date = new Date(Date.now() + 6000e3);
                    //date = date.toUTCString(); 
                    //document.cookie = "user=John; expires=" + date;                    
                    document.cookie = "token=" + data + "; max-age=3600";
                    //console.log(document.cookie);
                    setTimeout(() => {
                        let redirect = this.state.redirectUrl ? this.state.redirectUrl : '/home';
                        window.location.href = redirect;
                    }, 2000); 
                    
                });
        }
        else this.setState({ successMessage: null, errorMessage: 'Ошибка авторизации' });        
    }

  render() {
    return (
        <div>
            <Row>
                <Col md={12}>
                    <Card style={{
                        width: '25rem'
                    }}
                    >
                        <CardHeader>
                            Введите логин и пароль
                        </CardHeader>
                        <CardBody>
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
                            <FormGroup>
                                <Label for="exampleEmail">
                                    Логин
                                </Label>
                                <Input
                                    id="exampleEmail"
                                    name="email"
                                    placeholder="Введите логин"
                                    value={this.state.login}
                                    onChange={(ev) => this.setState({login: ev.target.value})}
                                    type="email"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="examplePassword">
                                    Пароль
                                </Label>
                                <Input
                                    id="examplePassword"
                                    name="password"
                                    placeholder="Введите пароль"
                                    value={this.state.password}
                                    onChange={(ev) => this.setState({ password: ev.target.value })}
                                    type="password"
                                />
                            </FormGroup>
                            <Button color='primary' onClick={this.autorize}>
                                Авторизоваться
                            </Button>
                        </CardBody>
                        <CardFooter>
                            После успешной авторизации Вы будете перенаправлены на исходный сервис
                        </CardFooter>
                    </Card>
                </Col>            
            </Row>
            
            </div>
    );
  }
}
