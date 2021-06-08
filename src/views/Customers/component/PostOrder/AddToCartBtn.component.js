import React, { Component } from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import {Add, Remove} from '@material-ui/icons'

class AddToCartBtnComponent extends Component {
    constructor(props) {
        super(props);
        this._handleSubtraction = this._handleSubtraction.bind(this);
        this._handleAddition = this._handleAddition.bind(this);
    }

    _handleSubtraction() {
        const { productId } = this.props;
        this.props.changeQuantity(productId, -1);
    }
    _handleAddition() {
        const { productId } = this.props;
        this.props.changeQuantity(productId, +1);
    }


    render() {
        const { quantity } = this.props;
        return (
            <div style={{display:'flex', alignItems: 'center', justifyContent: 'center', marginLeft:'20px'}}>
                <ButtonBase style={{ color: 'white', backgroundColor: '#C53232' }} onClick={this._handleSubtraction}>
                    <Remove/>
                </ButtonBase>
                <div style={{ margin: '0px 5px', fontSize: '14px', fontWeight: 'bold' }}>
                    {quantity}
                </div>
                <ButtonBase style={{ color: 'white', backgroundColor: '#279871' }} onClick={this._handleAddition}>
                    <Add/>
                </ButtonBase>
            </div>
        )
    }
}

export default AddToCartBtnComponent;
