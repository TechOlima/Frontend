import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, UncontrolledButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu   } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
      this.state = {
          dropdownOpen: false,
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
    }

    dropdownOpen() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

  render() {    

      return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
          <NavbarBrand tag={Link} to="/">Olima</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/">Стартовая</NavLink>
              </NavItem> 
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/product">Товары</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/product">Заказы</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/product">Товары в заказах</NavLink>
                </NavItem>
                <UncontrolledButtonDropdown>
                    <DropdownToggle nav caret>
                        Справочники
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem to="/product"><NavLink tag={Link} className="text-dark" to="/product">Тип товара</NavLink></DropdownItem>
                        <DropdownItem to="/product"><NavLink tag={Link} className="text-dark" to="/product">Тип материала</NavLink></DropdownItem>
                        <DropdownItem to="/product"><NavLink tag={Link} className="text-dark" to="/product">Вставки</NavLink></DropdownItem>
                        <DropdownItem to="/product"><NavLink tag={Link} className="text-dark" to="/product">Фото</NavLink></DropdownItem>
                        <DropdownItem to="/product"><NavLink tag={Link} className="text-dark" to="/product">Тип камня</NavLink></DropdownItem>
                    </DropdownMenu>
                </UncontrolledButtonDropdown>
            </ul>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}
