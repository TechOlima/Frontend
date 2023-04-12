import React, { Component } from 'react';

export class Product extends Component {
    static displayName = Product.name;

  constructor(props) {
    super(props);
    this.state = { products: [], loading: true };
  }

  componentDidMount() {
    this.populateProductData();
  }

  static renderProductTable(products) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Наименование</th>
            <th>Состав</th>
            <th>Тип</th>
            <th>Материал</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product =>
              <tr key={product.productID}>
                  <td>{product.name}</td>
                  <td>{product.equipment}</td>
                  <td>{product.productType.name}</td>
                  <td>{product.materialType.name}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
        ? <p><em>Loading...</em></p>
        : Product.renderProductTable(this.state.products);

    return (
      <div>
            <h1 id="tabelLabel" >Товары</h1>
            <button className="btn btn-primary" disabled onClick={this.incrementCounter}>Добавить товар</button>
        {contents}
      </div>
    );
  }

  async populateProductData() {
      const response = await fetch('weatherforecast');
    const data = await response.json();
    this.setState({ products: data, loading: false });
  }
}
