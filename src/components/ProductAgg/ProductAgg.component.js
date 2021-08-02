import React, {Component} from 'react';
import styles from './Style.module.css';

class ProductAggComponent extends Component {
    constructor() {
        super();
    }

    _renderCalculation() {
        const { data } = this.props;
        const productsObj = {};
        data.forEach((dt) => {
            dt.products.forEach((p) => {
                if (!(p.product_id in productsObj) && p.status !== 'SKIPPED') {
                    productsObj[p.product_id] = {
                        name: p.name,
                        product_id: p.product_id,
                        unit: p.unit,
                        unit_step: p.unit_step,
                        quantity: 0,
                    }
                }
                (productsObj[p.product_id]).quantity += p.quantity;
            });
        });
        console.log('dataObject', productsObj);
        return Object.keys(productsObj).map((key) => {
            const val = productsObj[key];
            const totalQuantity = Math.ceil(val.quantity * val.unit_step)
            return (
                <div className={styles.productPill}>
                    <span className={styles.productName}>{val.name} </span>
                    <span>{totalQuantity} {val.unit}</span>
                </div>
            )
        })
    }

    render() {
        return (
            <div className={styles.productCont}>
                {this._renderCalculation()}
            </div>
        );
    }
}

export default ProductAggComponent;
